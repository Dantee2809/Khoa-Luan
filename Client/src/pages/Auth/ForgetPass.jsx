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

    setLoading(true); // Bật loading
    axiosInstance
      .post("/auth/forgot-password", { email })
      .then((response) => {
        console.log("API Response:", response.data); // Log phản hồi từ API
        setLoading(false);
        if (response.data.status) {
          navigate("/sign-in");
        } else {
          toast.error(response.data.message || "Có lỗi xảy ra!");
        }
      })
      .catch((error) => {
        console.error("API Error:", error.response); // Log lỗi từ API
        setLoading(false);
        const errorMessage =
          error.response?.data?.message || "Email không tồn tại!";
        toast.error(errorMessage);
      });
  };

  return (
    <div className="a-right">
      <form className="infoForm authForm" onSubmit={handleSubmit}>
        <h3>Nhập email của bạn</h3>
        <div>
          <input
            type="email"
            placeholder="you@example.com"
            className="infoInput"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="button infoButton"
          disabled={loading} // Trạng thái vô hiệu hoá khi loading
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default ForgetPass;
