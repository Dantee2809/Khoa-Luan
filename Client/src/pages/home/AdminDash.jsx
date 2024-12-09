import React, { useEffect, useState } from "react";
import { usePostStore } from "../../store/usePostStore";
import { useDeletestore } from "../../store/useDeletestore";
import { FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminDash = () => {
  const { posts, fetchPosts, toggleApproval, isLoading, error, setPosts } =
    usePostStore();
  const { deletePost } = useDeletestore();
  const [showBulkApprovalMenu, setShowBulkApprovalMenu] = useState(false); // State để hiển thị menu
  const [selectedPosts, setSelectedPosts] = useState([]); // Mảng lưu các bài viết được chọn
  const [showCheckbox, setShowCheckbox] = useState(false); // Trạng thái hiển thị checkbox
  const [loadingButtons, setLoadingButtons] = useState({
    bulkDelete: false,
    bulkApproval: false,
  });
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Xử lý xóa bài viết đã chọn
  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) {
      alert("Vui lòng chọn ít nhất một bài viết!");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa các bài viết đã chọn?")) {
      try {
        setLoadingButtons((prev) => ({ ...prev, bulkDelete: true }));
        await Promise.all(
          selectedPosts.map(async (postId) => {
            await deletePost(postId);
          })
        );
        fetchPosts(); // Làm mới danh sách bài viết sau khi xóa
        setSelectedPosts([]); // Xóa danh sách bài viết đã chọn
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
      } finally {
        setLoadingButtons((prev) => ({ ...prev, bulkDelete: false }));
      }
    }
  };
  // Xử lý xóa bài viết và làm mới danh sách
  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        setLoadingButtons((prev) => ({ ...prev, [postId]: true }));
        await deletePost(postId);
        fetchPosts(); // Làm mới danh sách bài viết sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
      } finally {
        setLoadingButtons((prev) => ({ ...prev, [postId]: false }));
      }
    }
  };
  // Cập nhật trạng thái của checkbox
  const handleCheckboxChange = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  // Sửa lại hàm toggleApproval
  const handleToggleApproval = async (postId, newStatus) => {
    try {
      setLoadingButtons((prev) => ({ ...prev, [postId]: true }));
      // Giả sử toggleApproval sẽ thay đổi trạng thái isApproved
      await toggleApproval(postId, newStatus);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, isApproved: newStatus } : post
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Sửa lại handleBulkApproval để gọi đúng toggleApproval
  const handleBulkApproval = async (action) => {
    if (selectedPosts.length === 0) {
      alert("Vui lòng chọn ít nhất một bài viết để thực hiện hành động!");
      return;
    }

    const newStatus = action === "approve"; // Chặn = true, bỏ chặn = false

    if (
      window.confirm(
        `Bạn có chắc chắn muốn ${
          newStatus ? "bỏ chặn" : "chặn"
        } các bài viết đã chọn?`
      )
    ) {
      try {
        setLoadingButtons((prev) => ({ ...prev, bulkApproval: true }));

        await Promise.all(
          selectedPosts.map(async (postId) => {
            const post = posts.find((post) => post._id === postId);
            if (post) {
              await handleToggleApproval(postId, newStatus); // Thực hiện chặn hoặc bỏ chặn
            }
          })
        );

        fetchPosts(); // Làm mới danh sách bài viết sau khi thực hiện hành động
        setSelectedPosts([]); // Xóa danh sách bài viết đã chọn
      } catch (error) {
        console.error("Lỗi khi chặn/bỏ chặn bài viết:", error);
      } finally {
        setLoadingButtons((prev) => ({ ...prev, bulkApproval: false }));
        setShowBulkApprovalMenu(false); // Đóng menu khi đã xử lý xong
      }
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

      <div className="flex justify-start space-x-4">
        {/* <button
          onClick={handleBulkDelete}
          className="btn btn-danger py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:bg-red-300 disabled:cursor-not-allowed"
          disabled={selectedPosts.length === 0 || loadingButtons.bulkDelete}
          
        >
          {loadingButtons.bulkDelete ? "Đang xóa..." : "Xóa"}
        </button>

        <button
          onClick={() => setShowBulkApprovalMenu((prev) => !prev)} // Toggle menu
          className="btn btn-warning px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:bg-yellow-300 disabled:cursor-not-allowed"
          disabled={selectedPosts.length === 0 || loadingButtons.bulkApproval}
        >
          {loadingButtons.bulkApproval ? "Đang thực hiện..." : "Chặn / Bỏ chặn"}
        </button>

        {showBulkApprovalMenu && (
          <div className="absolute bg-white shadow-lg rounded-lg mt-2 py-2 w-40">
            <button
              onClick={() => handleBulkApproval("unapprove")}
              className="block w-full text-yellow-600 hover:bg-yellow-200 px-4 py-2 text-left"
            >
              Chặn các bài viết đã chọn
            </button>
            <button
              onClick={() => handleBulkApproval("approve")}
              className="block w-full text-green-600 hover:bg-green-200 px-4 py-2 text-left"
            >
              Bỏ chặn các bài viết đã chọn
            </button>
          </div>
        )} */}

        {/* Nút chuyển đổi giữa checkbox và số thứ tự */}
        <div className="mb-4 flex justify-start space-x-4">
          <button
            onClick={() => setShowCheckbox((prev) => !prev)}
            className="btn btn-info py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {showCheckbox ? "Hiển thị số thứ tự" : "Hiển thị checkbox"}
          </button>
        </div>
        {selectedPosts.length > 0 && (
          <div className="mb-4 flex justify-start space-x-4">
            <button
              onClick={handleBulkDelete}
              className="btn btn-danger py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:bg-red-300 disabled:cursor-not-allowed"
              disabled={loadingButtons.bulkDelete}
            >
              {loadingButtons.bulkDelete ? "Đang xóa..." : "Xóa"}
            </button>

            <button
              onClick={() => setShowBulkApprovalMenu((prev) => !prev)}
              className="btn btn-warning px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:bg-yellow-300 disabled:cursor-not-allowed"
              disabled={loadingButtons.bulkApproval}
            >
              {loadingButtons.bulkApproval
                ? "Đang thực hiện..."
                : "Chặn / Bỏ chặn"}
            </button>
          </div>
        )}

        {/* Menu lựa chọn "Chặn" và "Bỏ chặn" */}
        {showBulkApprovalMenu && (
          <div className="absolute bg-white shadow-lg rounded-lg mt-2 py-2 w-40">
            <button
              onClick={() => handleBulkApproval("unapprove")}
              className="block w-full text-left px-4 py-2 text-yellow-600 hover:bg-yellow-200"
            >
              Chặn các bài viết đã chọn
            </button>
            <button
              onClick={() => handleBulkApproval("approve")}
              className="block w-full text-left px-4 py-2 text-green-600 hover:bg-green-200"
            >
              Bỏ chặn các bài viết đã chọn
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table
          className="table table-zebra w-full border-collapse"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="bg-gray-200">
            <tr>
              <th>
                {showCheckbox ? (
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === posts.length}
                    onChange={() => {
                      if (selectedPosts.length === posts.length) {
                        setSelectedPosts([]);
                      } else {
                        setSelectedPosts(posts.map((post) => post._id));
                      }
                    }}
                  />
                ) : (
                  "STT"
                )}
              </th>
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
                <td className="text-center">
                  {showCheckbox ? (
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post._id)}
                      onChange={() => handleCheckboxChange(post._id)}
                    />
                  ) : (
                    index + 1 // Hiển thị số thứ tự nếu không hiển thị checkbox
                  )}
                </td>
                <td className="text-center truncate">
                  <Link to={`/admin-dashboard/admin-post/${post._id}`}>
                    {post.desc}
                  </Link>
                </td>

                <td className="text-center truncate">
                  {post.isLost
                    ? "Đồ bị mất"
                    : post.isFound
                    ? "Đã tìm được đồ"
                    : "Chưa xác định"}
                </td>
                <td className="text-center truncate">
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
                <td className="text-center flex justify-center items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleApproval(post._id, post.isApproved);
                    }}
                    className={`btn btn-sm ${
                      post.isApproved ? "btn-danger" : "btn-success"
                    }`}
                    disabled={loadingButtons[post._id]}
                  >
                    {post.isApproved ? "Bỏ chặn" : "Chặn"}
                  </button>
                </td>
                <td className="text-center justify-center items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post._id);
                    }}
                    className=" text-red-950"
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
