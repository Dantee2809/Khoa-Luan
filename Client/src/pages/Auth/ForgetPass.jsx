import React, { useState } from "react";
import { TfiEmail } from "react-icons/tfi";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Logo from "../../img/logo.png";
import "./Auth.css";

const ForgetPass = () => {
  return (
    <div className="Auth">
      <div className="a-left">
        <img src={Logo} alt="Logo" />
        <div className="Webname">
          <h1>TL SOSICAL</h1>
          <h6>Mạng xã hội tìm đồ bị thất lạc toàn quốc</h6>
        </div>
      </div>
      <Forget />
    </div>
  );
};

function Forget() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra email không trống
    if (!email) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Đang gửi email..."); // Hiện thông báo loading

    axiosInstance
      .post("/auth/forgot-password", { email })
      .then((response) => {
        console.log("API Response:", response.data); // Log phản hồi từ API
        setLoading(false);
        toast.dismiss(toastId); // Ẩn thông báo loading

        if (response.data.status) {
          toast.success("Email gửi thành công! Kiểm tra email của bạn.");
          navigate("/sign-in");
        } else {
          toast.error(response.data.message || "Có lỗi xảy ra!");
        }
      })
      .catch((error) => {
        console.error("API Error:", error.response); // Log lỗi từ API
        setLoading(false);
        toast.dismiss(toastId); // Ẩn thông báo loading
        const errorMessage =
          error.response?.data?.message || "Có lỗi xảy ra khi gửi email!";
        toast.error(errorMessage);
      });
  };

  return (
    <div className="a-right">
      <form className="infoForm authForm" onSubmit={handleSubmit}>
        <h3>Quên mật khẩu</h3>
        <div>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="infoInput"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="button infoButton" disabled={loading}>
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default ForgetPass;
