import React, { useState, useEffect } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import { useFollowStore } from "../../store/useFollowStore";
import { usePostStore } from "../../store/usePostStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { X } from "lucide-react"; // Đảm bảo bạn đã import X từ lucide-react

const Post = ({ data, currentUserId, authUserId }) => {
  const {
    following,
    fetchFollowingStatus,
    followUser,
    unfollowUser,
    setFollowing,
  } = useFollowStore();

  const [isLoading, setIsLoading] = useState(true);
  const { provinces, fetchProvinces, reportPost } = usePostStore(); // Lấy dữ liệu từ store

  const deletePost = async (postId) => {
    try {
      const response = await axiosInstance.delete(`/post/user/${postId}`);
      alert(response.data.message);
      // Cập nhật lại danh sách bài viết sau khi xóa thành công
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Có lỗi xảy ra khi xóa bài đăng");
    }
  };
  const handleDelete = async () => {
    try {
      await deletePost(data._id); // Gọi hàm xóa bài đăng với ID của bài viết
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  useEffect(() => {
    if (provinces.length === 0) {
      fetchProvinces(); // Lấy danh sách tỉnh thành khi component mount
    }
  }, [provinces, fetchProvinces]);

  const isCurrentUserPost = currentUserId === data.userId;

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      try {
        const isFollowing = await fetchFollowingStatus(
          currentUserId,
          data.userId
        );
        setFollowing(data.userId, isFollowing);
      } catch (error) {
        setFollowing(data.userId, false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [currentUserId, data.userId, fetchFollowingStatus, setFollowing]);

  const handleFollow = async () => {
    if (!currentUserId || !data.userId) return;
    setIsLoading(true);
    try {
      await followUser(currentUserId, data.userId);
      setFollowing(data.userId, true);
    } catch (error) {
      console.error("Failed to follow user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!currentUserId || !data.userId) return;
    setIsLoading(true);
    try {
      await unfollowUser(currentUserId, data.userId);
      setFollowing(data.userId, false);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReport = async () => {
    try {
      await reportPost(data._id, currentUserId);
    } catch (error) {
      toast.success("Có lỗi khi báo cáo bài viết.");
      console.error("Report failed:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage (hoặc từ nơi lưu trữ khác)
      await axiosInstance.delete(`/post/user/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token xác thực trong header
        },
      });
      deletePost(postId); // Xử lý xóa bài đăng trên frontend
      toast.success("Bài đăng đã bị xóa thành công.");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Có lỗi xảy ra khi xóa bài đăng.");
    }
  };

  const postDetailLink = `/post/${data._id}`; // Đường dẫn đến trang chi tiết bài đăng
  const isUserFollowing = following[data.userId] || false;

  const username = isCurrentUserPost
    ? "Bài của bạn"
    : data.userName || "Người dùng ẩn danh";

  const formattedDate = data.createdAt
    ? new Date(data.createdAt).toLocaleString("vi-VN", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "Không rõ ngày";

  const getProvinceNameById = (location) => {
    const locationId = Number(location); // chuyển location thành số
    const province = provinces.find((p) => p.id === locationId);
    return province ? province.name : "Không xác định";
  };

  return (
    <div className="post-container post-card relative p-4 border rounded-lg mb-4">
      {/* Hình ảnh bài đăng */}
      {data.image && (
        <div className="post-image-container">
          {/* Nút X để xóa bài đăng */}
          <button
            className="delete-btn absolute top-2 right-2 p-2 text-black rounded-ful focus:outline-none"
            onClick={handleDelete}
          >
            <X />
          </button>
          <Link to={postDetailLink}>
            <img src={data.image} alt="post" className="post-image" />
          </Link>
        </div>
      )}

      {/* Nút tương tác */}
      <div className="postReact">
        {!isCurrentUserPost && (
          <>
            {/*Nhắn tin */}
            <button className="button fc-button" onClick="">
              Nhắn Tin
            </button>
            {/*Nút theo dõi */}
            <button
              className={`button fc-button ${
                isUserFollowing ? "unfollow" : "follow"
              }`}
              onClick={isUserFollowing ? handleUnfollow : handleFollow}
              disabled={isLoading}
            >
              {isLoading
                ? "Đang tải..."
                : isUserFollowing
                ? "Đã theo dõi"
                : "Theo dõi"}
            </button>
            {/* Nút báo cáo bài viết */}
            <button
              className="report-btn button btn-danger"
              onClick={handleReport}
            >
              Báo cáo
            </button>
          </>
        )}
      </div>

      {/* Chi tiết bài đăng */}
      <div className="detail">
        <span>
          <b>Người đăng: {username}</b>
        </span>
        <br />
        <span>Mô tả: {data.desc || "Không có mô tả"}</span>
        <br />
        Địa điểm:{" "}
        {isLoading
          ? "Đang tải địa điểm..."
          : getProvinceNameById(data.location)}
        <br />
        <span>Ngày tạo: {formattedDate}</span>
        <br />
        <span>
          Liên hệ:{" "}
          {data.contact
            ? `${data.contact.substring(0, 3)}***${data.contact.substring(
                data.contact.length - 3
              )}`
            : "Không có thông tin liên hệ"}
        </span>
        <br />
        <span
          className={`font-bold border rounded px-2 py-1 ${
            data.isLost
              ? "text-red-500 border-red-500"
              : data.isFound
              ? "text-green-500 border-green-500"
              : "text-gray-500 border-gray-500"
          }`}
        >
          Loại:{" "}
          {data.isLost
            ? "Đồ bị mất"
            : data.isFound
            ? "Đã tìm thấy"
            : "Chưa xác định"}
        </span>
      </div>
    </div>
  );
};

export default Post;
