import React, { useEffect } from "react";
import { useSearchStore } from "../../store/useSearchStore";
import Post from "./Post";
import "../PostSide/PostSide.css";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";
import Posts from "../Posts/Posts";

const SearchDetail = () => {
  const { results } = useSearchStore(); // Lấy kết quả tìm kiếm từ store
  const { fetchPosts } = usePostStore(); // Truy xuất dữ liệu từ store
  const { authUser } = useAuthStore(); // Lấy thông tin người dùng hiện tại
  const { searchResults } = useSearchStore();

  const currentUserId = authUser?._id; // Lấy ID của người dùng từ auth store
  // return (
  //   <div className="SearchResults">
  //     <h1>Kết quả tìm kiếm</h1>
  //     {results.length > 0 ? (
  //       results.map((i, post) => (
  //         <Post key={i} data={post} currentUserId={currentUserId} />
  //       ))
  //     ) : (
  //       <p>Không tìm thấy kết quả phù hợp</p>
  //     )}
  //   </div>
  useEffect(() => {
    fetchPosts(); // Gọi API để tải bài đăng khi component mount
  }, [fetchPosts]);
  return (
    <div className="SearchResults">
      <h1>Kết quả tìm kiếm</h1>
      {Array.isArray(searchResults) && searchResults.length === 0 ? (
        <p>Không có bài viết nào phù hợp với từ khóa của bạn.</p>
      ) : (
        <ul>
          {searchResults.map((post, i) => (
            <Post key={i} data={post} currentUserId={currentUserId} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchDetail;
