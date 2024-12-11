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
    if (!query.trim()) {
      // Ensure trimming whitespace
      alert("Vui lòng nhập từ khóa tìm kiếm.");
      return;
    }

    // Gọi API tìm kiếm và điều hướng đến trang kết quả
    await searchPosts(query);
    navigate("/search-results");
  };

  return (
    <div className="LogoSearch">
      <img src={logo} alt="Logo" />
      <div className="Search">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm đồ bị mất"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Cập nhật từ khóa tìm kiếm
        />
        <div className="S-icon" onClick={handleSearch}>
          <UilSearch />
        </div>
      </div>
    </div>
  );
};

// import React from "react";
// import logo from "../../img/logo.png";
// import { UilSearch } from "@iconscout/react-unicons";
// import { useSearchStore } from "../../store/useSearchStore";
// import { useNavigate } from "react-router-dom";

// const LogoSearch = () => {
//   const { query, setQuery, searchPosts } = useSearchStore();
//   const navigate = useNavigate();

//   const handleSearch = async () => {
//     if (!query) {
//       alert("Vui lòng nhập từ khóa tìm kiếm.");
//       return;
//     }

//     // Gọi API tìm kiếm và điều hướng đến trang kết quả
//     await searchPosts(query);
//     navigate("/search-results");
//   };

//   return (
//     <div className="LogoSearch bg-base-100 rounded-xl">
//       <img src={logo} alt="Logo" />
//       <div className="Search">
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Tìm kiếm bài đăng..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)} // Cập nhật từ khóa tìm kiếm
//         />
//         <div className="S-icon" onClick={handleSearch}>
//           <UilSearch />
//         </div>
//       </div>
//     </div>
//   );
// };

export default LogoSearch;
