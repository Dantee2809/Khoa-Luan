// Frontend - PostSide.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "../Post/Post"; // Đảm bảo import đúng component Post
import { useAuthStore } from "../../store/useAuthStore";

const PostSide = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuthStore(); // Lấy thông tin người dùng từ store

  useEffect(() => {
    // Kiểm tra nếu có user
    if (!user) return;

    // Gọi API để lấy các bài viết của người dùng
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/post/posts/user/${user._id}`);
        setPosts(response.data); // Lưu bài viết vào state
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    fetchPosts();
  }, [user]);

  return (
    <div className="PostSide">
      <h2>Bài viết của tôi</h2>
      {posts.length === 0 ? (
        <p>Chưa có bài viết nào.</p>
      ) : (
        <div className="posts-list">
          {/* Lặp qua các bài viết và hiển thị */}
          {posts.map((post) => (
            <Post
              key={post._id}
              data={post}
              currentUserId={user._id}
              authUserId={user._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostSide;
