import React, { useEffect } from "react";
import { usePostStore } from "../../store/usePostStore";
import { useDeletestore } from "../../store/useDeletestore";
import { useNavigate } from "react-router-dom";
import { FaSyncAlt, FaInfoCircle, FaTrashAlt, FaBan } from "react-icons/fa";

const ReportPost = () => {
  const { posts, fetchPosts, toggleApproval, isLoading, error } =
    usePostStore();
  const { deletePost } = useDeletestore();
  const navigate = useNavigate();

  // Lấy danh sách bài viết khi component được render
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-xl font-semibold">
          Lỗi: {error}. Vui lòng thử lại sau!
        </p>
      </div>
    );
  }

  // Lọc chỉ các bài viết có báo cáo
  const reportedPosts = posts.filter((post) => post.reportsCount > 0);

  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      await deletePost(postId);
      fetchPosts(); // Tải lại danh sách bài viết sau khi xóa
    }
  };

  const handleToggleApproval = async (postId, isApproved) => {
    await toggleApproval(postId, isApproved);
    fetchPosts(); // Tải lại danh sách bài viết sau khi chặn
  };

  return (
    <div className="ReportList bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">
            📢 Danh sách bài viết bị báo cáo
          </h2>
          <button
            onClick={fetchPosts}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? <FaSyncAlt className="animate-spin" /> : <FaSyncAlt />}
            <span>{isLoading ? "Đang tải..." : "Tải lại"}</span>
          </button>
        </div>

        {reportedPosts.length === 0 ? (
          <div className="text-center mt-20">
            <h3 className="text-xl font-semibold text-gray-700">
              🚫 Không có bài viết nào bị báo cáo.
            </h3>
            <p className="text-gray-500 mt-2">
              Mọi bài viết đều đang hoạt động bình thường.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportedPosts.map((post, index) => (
              <div
                key={post._id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {index + 1}. {post.desc}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  <strong>Loại bài viết:</strong>{" "}
                  {post.isLost
                    ? "Đồ bị mất"
                    : post.isFound
                    ? "Đã tìm được đồ"
                    : "Chưa xác định"}
                </p>

                <p className="text-sm text-red-500 mb-2">
                  <strong>📢 Số lượng báo cáo:</strong> {post.reportsCount}
                </p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() =>
                      navigate(`/admin-dashboard/admin-post/${post._id}`)
                    }
                    className="flex items-center justify-center w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
                  >
                    <FaInfoCircle className="mr-2" /> Xem chi tiết
                  </button>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() =>
                      handleToggleApproval(post._id, post.isApproved)
                    }
                    className={`flex items-center justify-center w-full bg-${
                      post.isApproved ? "yellow-500" : "green-500"
                    } text-white py-2 rounded-lg hover:bg-${
                      post.isApproved ? "yellow-600" : "green-600"
                    } transition-all`}
                  >
                    <FaBan className="mr-2" />{" "}
                    {post.isApproved ? "Bỏ chặn" : "Chặn bài"}
                  </button>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="flex items-center justify-center w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all ml-2"
                  >
                    <FaTrashAlt className="mr-2" /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPost;
