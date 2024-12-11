import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu mới và mật khẩu xác nhận không khớp");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        "/user/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || "Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra trong quá trình xử lý.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <button className="go-back-btn" onClick={handleGoBack}>
          Quay lại
        </button>
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Thay đổi mật khẩu
        </h1>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Mật khẩu cũ
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Nhập lại mật khẩu mới
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
