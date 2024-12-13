import React, { useEffect, useState } from "react";
import { useSearchStore } from "../../store/useSearchStore"; // Nhập store zustand để lấy trạng thái tìm kiếm
import Post from "./Post"; // Component Post để hiển thị mỗi bài đăng
import { useAuthStore } from "../../store/useAuthStore"; // Để lấy thông tin người dùng hiện tại
// import "./SearchDetail.css";
import "./Post.css";

const SearchDetail = () => {
  const {
    query,
    location,
    lostDate,
    searchResults,
    isLoading,
    error,
    searchPosts,
    setQuery,
    setLocation,
    setLostDate,
    provinces,
    fetchProvinces,
  } = useSearchStore();

  const { authUser } = useAuthStore();
  const currentUserId = authUser?._id;

  const [locationText, setLocationText] = useState(""); // Trạng thái cho input location (text)

  // Lấy ID tỉnh thành dựa vào tên
  const getLocationIdByName = (name) => {
    const province = provinces.find((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
    return province ? province.id : null; // Trả về ID nếu tìm thấy, nếu không trả về null
  };

  const handleLocationChange = (e) => {
    const text = e.target.value;
    setLocationText(text); // Cập nhật input location
    const locationId = getLocationIdByName(text);
    if (locationId) {
      setLocation(locationId); // Cập nhật ID location khi tìm thấy
    } else {
      setLocation(""); // Nếu không tìm thấy tỉnh thành, reset location
    }
  };

  useEffect(() => {
    fetchProvinces(); // Gọi API lấy tỉnh thành khi component mount
    if (query || location || lostDate) {
      searchPosts(query, location, lostDate); // Gọi action searchPosts từ store
    }
  }, [query, location, lostDate, fetchProvinces, searchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Khi người dùng submit form, gọi searchPosts với các tham số đã nhập
    searchPosts(query, location, lostDate);
  };

  return (
    <div className="SearchResults">
      <h1>Kết quả tìm kiếm</h1>

      {/* Form tìm kiếm */}
      <form onSubmit={handleSearch}>
        <div className="search-inputs">
          <input
            type="text"
            placeholder="Tìm kiếm đồ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Cập nhật từ khóa tìm kiếm
          />
          <input
            type="text" // Giữ đây là input text cho tỉnh thành
            placeholder="Tên tỉnh thành"
            value={locationText} // Giá trị của input location
            onChange={handleLocationChange} // Cập nhật ID location khi thay đổi
          />
          <input
            type="date"
            value={lostDate}
            onChange={(e) => setLostDate(e.target.value)} // Cập nhật ngày mất
          />
          <button type="submit">Tìm kiếm</button>
        </div>
      </form>

      {/* Hiển thị trạng thái tìm kiếm */}
      {isLoading && <p className="loading">Đang tải...</p>}

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="error">{error}</p>}

      {/* Hiển thị kết quả tìm kiếm */}
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((post, i) => (
            <Post key={i} data={post} currentUserId={currentUserId} />
          ))}
        </ul>
      ) : (
        !isLoading && <p>Không tìm thấy bài đăng nào.</p>
      )}
    </div>
  );
};

export default SearchDetail;
