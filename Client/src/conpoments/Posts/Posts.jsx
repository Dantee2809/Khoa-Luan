// Posts.js
import React, { useState, useEffect } from "react";
import "./Posts.css";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";

const Posts = () => {
  const { posts, isLoading, fetchPosts, createPostSuccess } = usePostStore();
  const { authUser } = useAuthStore();
  const currentUserId = authUser?._id;

  useEffect(() => {
    fetchPosts(); // Lấy danh sách bài viết khi component mount
  }, [fetchPosts]);

  useEffect(() => {
    if (createPostSuccess) {
      // Cuộn lên đầu trang khi có bài viết mới
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [createPostSuccess]); // Chỉ chạy khi createPostSuccess thay đổi

  // Lọc danh sách bài viết đã duyệt
  const approvedPosts = posts.filter((post) => !post.isApproved);

  return (
    <div className="Posts">
      {isLoading && <Loader />}
      <div>
        {approvedPosts.map((item, i) => (
          <Post
            key={i}
            data={item}
            currentUserId={currentUserId}
            authUserId={authUser._id}
          />
        ))}
        {approvedPosts.length === 0 && !isLoading && (
          <p>Hiện không có bài đăng nào được phê duyệt.</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
