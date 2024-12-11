import React, { useState, useEffect } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import { useFollowStore } from "../../store/useFollowStore";
import { usePostStore } from "../../store/usePostStore";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useDeletestore } from "../../store/useDeletestore";

const Post = ({ data, currentUserId }) => {
  const {
    following,
    fetchFollowingStatus,
    followUser,
    unfollowUser,
    setFollowing,
  } = useFollowStore();

  const { provinces, fetchProvinces, reportPost, deletePost } = usePostStore();
  const { deleteMinePost } = useDeletestore(); // Lấy hàm deletePost từ store
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Kiểm tra xem bài viết có thuộc về người dùng hiện tại không
  const isCurrentUserPost = currentUserId === (data.userId?._id || data.userId);

  const userId = data?.userId?._id || null;
  const username = data?.userId?.username || "Người dùng ẩn danh";

  // Lấy danh sách tỉnh thành nếu chưa tải
  useEffect(() => {
    if (provinces.length === 0) fetchProvinces();
  }, [provinces, fetchProvinces]);

  // Lấy trạng thái theo dõi
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const isFollowing = await fetchFollowingStatus(currentUserId, userId);
        setFollowing(userId, isFollowing);
      } catch (error) {
        console.error("Failed to fetch follow status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUserId && userId) fetchFollowStatus();
  }, [currentUserId, userId, fetchFollowingStatus, setFollowing]);

  // Xử lý xóa bài viết
  const handleDeletePost = async () => {
    try {
      await deletePost(data._id); // Sử dụng deletePost từ store
      toast.success("Bài đăng đã bị xóa.");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Xử lý theo dõi người dùng
  const handleFollow = async () => {
    if (!currentUserId || !userId) return;
    setIsLoading(true);
    try {
      await followUser(currentUserId, userId);
      setFollowing(userId, true);
    } catch (error) {
      console.error("Failed to follow user:", error);
      toast.error("Không thể theo dõi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý bỏ theo dõi người dùng
  const handleUnfollow = async () => {
    if (!currentUserId || !userId) return;
    setIsLoading(true);
    try {
      await unfollowUser(currentUserId, userId);
      setFollowing(userId, false);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      toast.error("Không thể bỏ theo dõi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý báo cáo bài viết
  const handleReport = async () => {
    try {
      await reportPost(data._id, currentUserId);
    } catch (error) {
      console.error("Failed to report post:", error);
      toast.error("Không thể báo cáo bài viết.");
    }
  };

  // Lấy tên tỉnh thành dựa vào ID
  const getProvinceNameById = (location) => {
    const locationId = Number(location);
    const province = provinces.find((p) => p.id === locationId);
    return province ? province.name : "Không xác định";
  };

  // Format ngày tạo
  const formattedDate = data.createdAt
    ? new Date(data.createdAt).toLocaleString("vi-VN", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "Không rõ ngày";

  // Kiểm tra trạng thái theo dõi
  const isUserFollowing = following[userId] || false;

  // Render component
  return (
    <div className="post-container post-card relative p-4 border rounded-lg mb-4">
      {/* Hình ảnh bài đăng */}
      {data.image && (
        <div className="post-image-container">
          {isCurrentUserPost && (
            <button
              className="delete-btn absolute top-2 right-2 p-2 text-black rounded-full focus:outline-none"
              onClick={() => {
                const confirmDelete = window.confirm(
                  "Bạn có chắc chắn muốn xóa bài đăng này không?"
                );
                if (confirmDelete) {
                  handleDeletePost();
                }
              }}
            >
              <X />
            </button>
          )}

          <Link to={`/post/${data._id}`}>
            <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-lg aspect-[4/4]">
              {/* Blurred background image */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-md scale-110"
                style={{ backgroundImage: `url(${data.image})` }}
              ></div>

              {/* Main image */}
              <img
                src={data.image}
                alt="post"
                className="relative w-full h-full object-contain z-10"
              />
            </div>
          </Link>
        </div>
      )}

      {/* Nút tương tác */}
      <div className="postReact">
        {!isCurrentUserPost && (
          <>
            <button
              className="report-btn button btn-danger"
              onClick={() => {
                if (!isUserFollowing) {
                  alert("Bạn cần theo dõi trước khi nhắn tin!");
                } else {
                  navigate("/chatbox");
                }
              }}
            >
              Nhắn Tin
            </button>
            <button
              className={`report-btn button btn-danger ${
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
          <b>Người đăng: {isCurrentUserPost ? "Bài của bạn" : username}</b>
        </span>
        <br />
        <span>Mô tả: {data.desc || "Không có mô tả"}</span>
        <br />
        Địa điểm: {getProvinceNameById(data.location)}
        <br />
        <span>Ngày tạo: {formattedDate}</span>
        <br />
        {/* <span>
          Liên hệ:{" "}
          {data.contact
            ? `${data.contact.substring(0, 3)}***${data.contact.substring(
                data.contact.length - 3
              )}`
            : "Không có thông tin liên hệ"}
        </span> */}
        <span
          className={`font-bold border rounded px-2 py-1 ${
            data.isLost
              ? "text-red-500 border-red-500"
              : data.isFound
              ? "text-green-500 border-green-500"
              : "text-gray-500 border-gray-500"
          }`}
        >
          Tin :{" "}
          {data.isLost
            ? "Cần tìm"
            : data.isFound
            ? "Nhặt được"
            : "Chưa xác định"}
        </span>
      </div>
    </div>
  );
};

export default Post;
