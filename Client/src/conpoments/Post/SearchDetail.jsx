import React, { useEffect, useState } from "react";
import { useSearchStore } from "../../store/useSearchStore";
import Post from "./Post";
import { useAuthStore } from "../../store/useAuthStore";
import "./SearchDetail.css";
import toast from "react-hot-toast";

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
    clearSearchResults, // đảm bảo clear dữ liệu trước khi tìm kiếm
  } = useSearchStore();

  const { authUser } = useAuthStore();
  const currentUserId = authUser?._id;

  const [locationText, setLocationText] = useState("");

  // Lấy ID tỉnh thành dựa vào tên
  const getLocationIdByName = (name) => {
    const province = provinces.find((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
    return province ? province.id : null;
  };
  const handleLocationChange = (e) => {
    const text = e.target.value;
    setLocationText(text);
    const locationId = getLocationIdByName(text);
    setLocation(locationId || "");
  };

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() && !locationText.trim() && !lostDate) {
      toast.error("Vui lòng nhập thông tin tìm kiếm!");

      return;
    }
    try {
      // 1️⃣ Clear kết quả tìm kiếm cũ
      await clearSearchResults();

      // 2️⃣ Format ngày theo định dạng chính xác
      const formattedLostDate = lostDate
        ? new Date(`${lostDate}T00:00:00.000Z`).toISOString()
        : "";

      // 3️⃣ Gọi API tìm kiếm bài viết
      searchPosts(query, location, formattedLostDate);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
    }
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
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tên tỉnh thành"
            value={locationText}
            onChange={handleLocationChange}
          />
          <input
            type="date"
            value={lostDate}
            onChange={(e) => setLostDate(e.target.value)}
          />
          <button type="submit">Tìm kiếm</button>
        </div>
      </form>

      {isLoading && <p className="loading">Đang tải...</p>}
      {error && <p className="error">{error}</p>}

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
