import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useParams } from "react-router-dom";
import "./UserList.css";

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null); // Dữ liệu người dùng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch thông tin người dùng
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/admin/user/${userId}`);
        setUserData(response.data);
      } catch (error) {
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle block/unblock user
  const handleBlockUser = async () => {
    try {
      const response = await axiosInstance.put(`/admin/block/${userId}`);
      if (response.status === 200) {
        // Cập nhật trạng thái block/unblock sau khi thay đổi
        setUserData((prevData) => ({
          ...prevData,
          isBlocked: !prevData.isBlocked, // Toggle block status
        }));
      }
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  if (loading) return <p>Đang tải thông tin người dùng...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <img
          src={userData.profilePic || "/avatar.jpg"} // Avatar người dùng
          alt={`${userData.username}'s Avatar`}
          className="profile-avatar"
        />
        <h1 className="username">{userData.username}</h1>
      </div>
      <div className="profile-info">
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Vai trò:</strong> {userData.role}
        </p>
        <p>
          <strong>Ngày tham gia:</strong>{" "}
          {new Date(userData.createdAt).toLocaleDateString()}
        </p>
        {/* Thêm thông tin khác của người dùng nếu cần */}
      </div>
      <div className="block-section">
        <button
          className={`btn ${userData.isBlocked ? "btn-unblock" : "btn-block"}`}
          onClick={handleBlockUser}
        >
          {userData.isBlocked ? "Bỏ chặn" : "Chặn"}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
