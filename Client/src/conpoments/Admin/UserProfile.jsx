import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
// import "./UserList.css";
import { axiosInstance } from "../../lib/axios";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate(); // Hook để điều hướng
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
        setUserData((prevData) => ({
          ...prevData,
          isBlocked: !prevData.isBlocked, // Toggle block status
        }));
      }
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  // Handle "Quay lại" button click
  const handleGoBack = () => {
    navigate(-1); // Điều hướng trở lại trang trước
  };

  if (loading) return <p>Đang tải thông tin người dùng...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-profile-container p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleGoBack}
          className="btn btn-sm btn-outline text-zinc-600 hover:bg-zinc-100"
        >
          Quay lại
        </button>
      </div>

      <div className="profile-header flex flex-col items-center gap-4 p-4">
        <div className="relative">
          <img
            src={userData.profilePic || "/avatar.jpg"} // Avatar người dùng
            alt={`${userData.username}'s Avatar`}
            className="w-32 h-32 rounded-full object-cover border-4 border-zinc-300"
          />
        </div>
      </div>

      <div className="profile-info text-center mb-6">
        <h1 className="username text-2xl font-bold text-blue-600">
          {userData.username}
        </h1>
        <p className="text-lg text-zinc-500">
          {userData.firstname} {userData.lastname}
        </p>
        <strong>Ngày tham gia:</strong>{" "}
        {new Date(userData.createdAt).toLocaleDateString("vi-VN")}
        <p className="text-md text-rose-500">
          {userData.role === "admin" && "Đây là admin"}
        </p>
      </div>

      <div className="follow-status mb-6">
        <hr className="mb-4" />
        <div className="flex justify-around">
          <div className="follow text-center">
            <span className="text-xl font-semibold">
              {userData.followers?.length || 0}
            </span>
            <span className="block text-sm text-zinc-400">Người theo dõi</span>
          </div>
          <div className="follow text-center">
            <span className="text-xl font-semibold">
              {userData.following?.length || 0}
            </span>
            <span className="block text-sm text-zinc-400">Đang theo dõi</span>
          </div>
        </div>
      </div>

      <div className="block-section mb-6 text-center">
        <button
          className={`btn ${
            userData.isBlocked ? "btn-unblock" : "btn-block"
          } w-full`}
          onClick={handleBlockUser}
        >
          {userData.isBlocked ? "Bỏ chặn" : "Chặn"}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
