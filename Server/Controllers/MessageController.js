import messageModel from "../Models/messageModel.js";
import UserModel from "../Models/userModel.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
//import { getReceiverSocketId, io } from "../lib/socket.js";

// export const getUsersForSidebar = async (req, res) => {
//   // Controller getContacts
//   try {
//     const loggedInUserId = req.user._id; // ID của người dùng hiện tại

//     // Tìm tất cả các cuộc hội thoại mà user đã nhắn tin và đã follow nhau
//     const contacts = await messageModel.aggregate([
//       {
//         $match: {
//           $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
//           text: { $exists: true, $ne: "" }, // Chỉ lấy tin nhắn có text không rỗng
//         },
//       },
//       {
//         $group: {
//           _id: null, // Không nhóm theo trường cụ thể nào
//           contactIds: {
//             $addToSet: {
//               $cond: [
//                 { $ne: ["$senderId", loggedInUserId] },
//                 "$senderId", // Nếu senderId không phải user hiện tại, thì lấy senderId
//                 "$receiverId", // Ngược lại, lấy receiverId
//               ],
//             },
//           },
//         },
//       },
//     ]);

//     // Kiểm tra xem người dùng có theo dõi nhau hay không
//     const followings = await UserModel.find({
//       _id: { $in: contacts[0]?.contactIds },
//     });

//     const validContacts = followings.filter((user) => {
//       // Kiểm tra nếu người dùng đã theo dõi nhau
//       return (
//         user.followers.includes(loggedInUserId) &&
//         user.following.includes(loggedInUserId)
//       );
//     });

//     res.status(200).json(validContacts);
//   } catch (error) {
//     console.error("Error in getContacts:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id; // ID người dùng hiện tại từ protectRoute
//     // Tìm thông tin người dùng hiện tại
//     const loggedInUser = await UserModel.findById(loggedInUserId);

//     if (!loggedInUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Lấy danh sách người dùng mà user hiện tại đã follow
//     const users = await UserModel.find({
//       _id: { $in: loggedInUser.followers },
//       _id: { $in: loggedInUser.following },
//     }).select("-password");

//     res.status(200).json(users);
//   } catch (error) {
//     console.error("Error in getUsersForSidebar:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const loggedInUser = await UserModel.findById(loggedInUserId);

    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Lấy tất cả tin nhắn liên quan đến người dùng hiện tại, sắp xếp theo thời gian gần nhất
    const messages = await messageModel
      .find({
        $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
      })
      .sort({ createdAt: -1 }); // Tin nhắn mới nhất sẽ ở trên cùng

    // Lấy danh sách ID người dùng đã nhắn tin (không bao gồm ID của chính mình)
    const userIdsWithMessages = Array.from(
      new Set(
        messages
          .flatMap((msg) => [
            msg.senderId.toString(),
            msg.receiverId.toString(),
          ])
          .filter((id) => id !== loggedInUserId.toString())
      )
    );

    // Lấy thông tin chi tiết của những người dùng này
    const users = await UserModel.find({
      _id: { $in: userIdsWithMessages },
    }).select("-password");

    // Tạo một danh sách người dùng kèm tin nhắn mới nhất
    const usersWithLatestMessages = users.map((user) => {
      const latestMessage = messages.find(
        (msg) =>
          msg.senderId.toString() === user._id.toString() ||
          msg.receiverId.toString() === user._id.toString()
      );

      return {
        ...user.toObject(),
        latestMessage: latestMessage ? latestMessage.text : null,
        latestMessageTime: latestMessage ? latestMessage.createdAt : null,
      };
    });

    // Sắp xếp danh sách dựa trên thời gian tin nhắn mới nhất
    usersWithLatestMessages.sort((a, b) => {
      if (b.latestMessageTime && a.latestMessageTime) {
        return new Date(b.latestMessageTime) - new Date(a.latestMessageTime);
      }
      return 0; // Nếu không có tin nhắn mới nhất, giữ nguyên vị trí
    });

    res.status(200).json(usersWithLatestMessages);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await messageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new messageModel({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // ID của user hiện tại

    // Lấy danh sách admin
    const adminUsers = await UserModel.find({ role: "admin" });

    // Tìm tất cả các cuộc hội thoại mà user đã nhắn tin
    const contacts = await messageModel.aggregate([
      {
        $match: {
          $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
          text: { $exists: true, $ne: "" }, // Chỉ lấy tin nhắn có text không rỗng
        },
      },
      {
        $group: {
          _id: null, // Không nhóm theo trường cụ thể nào
          contactIds: {
            $addToSet: {
              $cond: [
                { $ne: ["$senderId", loggedInUserId] },
                "$senderId", // Nếu senderId không phải user hiện tại, thì lấy senderId
                "$receiverId", // Ngược lại, lấy receiverId
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          contactIds: 1,
        },
      },
    ]);

    const contactIds = contacts[0]?.contactIds || [];

    // Lọc ra những user đã liên lạc và đang theo dõi
    const followingUsers = await UserModel.find({
      _id: { $in: contactIds },
      followers: { $in: [loggedInUserId] }, // Kiểm tra nếu người dùng đã theo dõi
    });

    // Gộp danh sách admin với danh sách người dùng đã liên lạc
    const resultContacts = [
      ...new Set([
        ...adminUsers.map((admin) => admin._id.toString()),
        ...followingUsers.map((user) => user._id.toString()),
      ]),
    ];

    // Tìm thông tin chi tiết của các liên hệ
    const detailedContacts = await UserModel.find({
      _id: { $in: resultContacts },
    });

    res.status(200).json(detailedContacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching contacts", error });
  }
};

export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const deletedMessage = await messageModel.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error });
  }
};
