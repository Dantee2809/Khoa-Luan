import React, { useEffect, useState } from "react";
import "./UserList.css";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";

const UserList = () => {
  const [users, setUsers] = useState([]); // Dữ liệu người dùng
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải
  const [error, setError] = useState(null);
  const { toggleBlockUser } = useAuthStore();
  const [searchUser, setSearchUser] = useState(""); // Trạng thái tìm kiếm người dùng

  // Gọi API để lấy danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/admin/getUsers");
        setUsers(response.data); // Cập nhật dữ liệu người dùng
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []); // API chỉ gọi 1 lần khi component mount

  // Hàm tìm kiếm người dùng
  const handleSearch = (e) => {
    setSearchUser(e.target.value); // Cập nhật trạng thái tìm kiếm
  };

  // Tìm kiếm người dùng trong dữ liệu
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchUser.toLowerCase())
  );

  // Sắp xếp lại danh sách, đưa người bị block xuống cuối
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (a.isBlocked && !b.isBlocked) return 1;
    if (!a.isBlocked && b.isBlocked) return -1;
    return 0;
  });

  // Hiển thị trạng thái loading khi dữ liệu đang tải
  if (isLoading) {
    return <p>Loading users...</p>;
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  // Hàm để cập nhật ngay khi bấm nút Block/Unblock
  const handleBlockToggle = async (userId) => {
    try {
      const response = await axiosInstance.put(`/admin/block/${userId}`);
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? { ...user, isBlocked: response.data.user.isBlocked }
              : user
          )
        );
      }
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  return (
    <div className="user-list-container">
      <h2 className="header">User List</h2>

      <input
        type="text"
        placeholder="Tìm kiếm người dùng"
        value={searchUser}
        onChange={handleSearch}
        className="search-input"
      />

      {sortedUsers.length === 0 ? (
        <p className="empty-message">Không có người dùng nào</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên Chính</th>
              <th>Username</th>
              <th>Email</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user._id} className={user.isBlocked ? "blocked" : ""}>
                <td>
                  <img
                    src={user.profilePic || "https://via.placeholder.com/50"}
                    alt={`${user.username}'s avatar`}
                    className="avatar"
                  />
                </td>
                <td>{user.lastname}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className={`btn ${
                      user.isBlocked ? "btn-unblock" : "btn-block"
                    }`}
                    onClick={() => handleBlockToggle(user._id)}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
