import React, { useState } from "react";
import toast from "react-hot-toast";
import { TfiEmail } from "react-icons/tfi";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import Logo from "../../img/logo.png";
import "./Auth.css";

const ResetPass = () => {
  return (
    <div className="Auth">
      <div className="a-left">
        <img src={Logo} alt="Logo" />
        <div className="Webname">
          <h1>TL SOSICAL</h1>
          <h6>Mạng xã hội tìm đồ bị thất lạc toàn quốc</h6>
        </div>
      </div>
      <Reset />
    </div>
  );
};

function Reset() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post("/auth/reset-password-from-forget/" + token, { password })
      .then((response) => {
        if (response.data.status) {
          toast.success("Bạn đã đổi pass thành công!");
          navigate("/sign-in");
        } else {
          toast.error(response.data.message || "Có lỗi xảy ra!");
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Email không tồn tại!";
        toast.error(errorMessage);
      });
  };

  return (
    <div className="a-right">
      <form className="infoForm authForm" onSubmit={handleSubmit}>
        <div className="form-control">
          <TfiEmail className="w-6 h-6 text-primary" />
          <h3>Nhập mật khẩu mới</h3>

          <div className="form-control">
            <input
              className="infoInput"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPass;
