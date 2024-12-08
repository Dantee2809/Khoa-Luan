import React from "react";
import logo from "../../img/logo.png";
import { UilSearch } from "@iconscout/react-unicons";
import "./LogoSearch.css";
import { useSearchStore } from "../../store/useSearchStore";
import { useNavigate } from "react-router-dom";

const LogoSearch = () => {
  const { query, setQuery, searchPosts } = useSearchStore();
  const navigate = useNavigate();

  const handleSearch = async () => {
    await searchPosts(); // Tìm kiếm và lưu kết quả vào store
    navigate("/search-results"); // Điều hướng sang trang kết quả
  };

  return (
    <div className="LogoSearch bg-base-100 rounded-xl">
      <img src={logo} alt="" />
      <div className="Search">
        <input
          type="text"
          class="search-input"
          placeholder="Tìm kiếm đồ bị mất"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="S-icon" onClick={handleSearch}>
          <UilSearch />
        </div>
      </div>
    </div>
  );
};

export default LogoSearch;
