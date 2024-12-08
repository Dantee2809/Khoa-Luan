import Adv from "../Models/advModel.js";
export const getAdv = async (req, res) => {
  try {
    const ads = await Adv.find();
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Lấy tất cả quảng cáo
export const addAdv = async (req, res) => {
  const { ND, img } = req.body;

  if (!ND || !img) {
    return res
      .status(400)
      .json({ message: "Nội dung và hình ảnh không được để trống." });
  }

  try {
    const newAd = new Adv({ ND, img });
    await newAd.save();
    res.status(201).json(newAd);
  } catch (error) {
    console.error("Error in creating ad:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tạo quảng cáo." });
  }
};

// Cập nhật quảng cáo
export const updateAdv = async (req, res) => {
  const { id } = req.params;
  const { ND, img } = req.body;

  if (!ND || !img) {
    return res
      .status(400)
      .json({ message: "Nội dung và hình ảnh không được để trống." });
  }

  try {
    const updatedAd = await Adv.findByIdAndUpdate(
      id,
      { ND, img },
      { new: true, runValidators: true } // Trả về bản cập nhật mới nhất
    );

    if (!updatedAd) {
      return res.status(404).json({ message: "Không tìm thấy quảng cáo." });
    }

    res.status(200).json(updatedAd);
  } catch (error) {
    console.error("Error in updating ad:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật quảng cáo." });
  }
};
export const deleteAdv = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAd = await AdvModel.findByIdAndDelete(id);

    if (!deletedAd) {
      return res.status(404).json({ message: "Không tìm thấy quảng cáo." });
    }

    res.status(200).json({ message: "Đã xóa quảng cáo thành công." });
  } catch (error) {
    console.error("Error in deleting ad:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi khi xóa quảng cáo." });
  }
};
