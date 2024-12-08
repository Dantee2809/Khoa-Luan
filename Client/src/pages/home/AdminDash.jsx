import React, { useEffect, useState } from "react";
import { usePostStore } from "../../store/usePostStore";
import { useDeletestore } from "../../store/useDeletestore";
import { FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";

const AdminDash = () => {
  const { posts, fetchPosts, toggleApproval, isLoading, error, setPosts } =
    usePostStore();
  const { deletePost } = useDeletestore();
  const [loadingButtons, setLoadingButtons] = useState({}); // Trạng thái loading cho từng bài viết

  // Lấy danh sách bài viết khi component được render
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Xử lý xóa bài viết và làm mới danh sách
  // Xử lý xóa bài viết và làm mới danh sách
  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        setLoadingButtons((prev) => ({ ...prev, [postId]: true })); // Hiển thị trạng thái chờ
        await deletePost(postId); // Xóa bài viết
        fetchPosts(); // Làm mới danh sách bài viết sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
      } finally {
        setLoadingButtons((prev) => ({ ...prev, [postId]: false })); // Kết thúc trạng thái chờ
      }
    }
  };

  // Xử lý toggle trạng thái bài viết
  const handleToggleApproval = async (postId, currentStatus) => {
    try {
      setLoadingButtons((prev) => ({ ...prev, [postId]: true })); // Hiển thị trạng thái chờ
      await toggleApproval(postId, currentStatus); // Gọi API cập nhật trạng thái

      // Cập nhật trạng thái bài viết trong store mà không cần fetch lại toàn bộ danh sách
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, isApproved: !currentStatus } : post
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Cập nhật trạng thái thành công.");
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [postId]: false })); // Kết thúc trạng thái chờ
    }
  };

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
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Quản lý bài đăng</h2>
        <button
          onClick={fetchPosts}
          className={`btn ${isLoading ? "btn-disabled" : "btn-primary"}`}
          disabled={isLoading}
        >
          {isLoading ? "Đang tải lại..." : "Tải lại danh sách"}
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table
          className="table table-zebra w-full border-collapse"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="bg-gray-200">
            <tr>
              <th>#</th>
              <th>Tiêu đề</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Quản lý</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post._id} className="hover:bg-gray-100">
                <td>{index + 1}</td>
                <td className="truncate">{post.desc}</td>
                <td>
                  {post.isLost
                    ? "Đồ bị mất"
                    : post.isFound
                    ? "Đã tìm được đồ"
                    : "Chưa xác định"}
                </td>
                <td>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                      post.isApproved
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {post.isApproved ? "Đã chặn" : "Đang được đăng"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleApproval(post._id, post.isApproved);
                    }}
                    className={`btn btn-sm ${
                      loadingButtons[post._id]
                        ? "btn-disabled"
                        : post.isApproved
                        ? "btn-danger"
                        : "btn-success"
                    }`}
                    disabled={loadingButtons[post._id]}
                  >
                    {loadingButtons[post._id] ? (
                      "..."
                    ) : post.isApproved ? (
                      <FaTimes />
                    ) : (
                      <FaCheck />
                    )}
                  </button>
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post._id);
                    }}
                    className="btn btn-sm btn-error text-red-950"
                    disabled={loadingButtons[post._id]}
                  >
                    {loadingButtons[post._id] ? "..." : <FaTrashAlt />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDash;
