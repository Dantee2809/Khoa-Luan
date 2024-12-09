import React, { useState, useEffect } from "react";
import "./Posts.css";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";

const Posts = () => {
  const { posts, isLoading, error, fetchPosts, createPostSuccess } =
    usePostStore(); // Truy xuất dữ liệu từ store
  const { authUser } = useAuthStore(); // Lấy thông tin người dùng hiện tại
  const currentUserId = authUser?._id; // Lấy ID của người dùng từ auth store

  const [newPost, setNewPost] = useState(null);

  useEffect(() => {
    fetchPosts(); // Gọi API để tải bài đăng khi component mount
  }, [fetchPosts]);

  // Lắng nghe khi có bài viết mới được tạo thành công
  useEffect(() => {
    if (createPostSuccess && newPost) {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang khi có bài viết mới
    }
  }, [createPostSuccess, newPost]);

  // Lọc danh sách bài đăng chỉ chứa những bài có isApproved: true
  const approvedPosts = posts.filter((post) => !post.isApproved);

  return (
    <div className="Posts">
      {/* Hiển thị Loader khi đang tải */}
      {isLoading && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}

      {/* Hiển thị danh sách bài đăng đã phê duyệt */}
      <div>
        {approvedPosts.map((item, i) => (
          <Post
            key={i}
            data={item}
            currentUserId={currentUserId}
            authUserId={authUser._id}
          />
        ))}

        {/* Hiển thị thông báo nếu không có bài đăng nào được phê duyệt */}
        {approvedPosts.length === 0 && !isLoading && (
          <p>Hiện không có bài đăng nào được phê duyệt.</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
