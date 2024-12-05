import React, { useState } from "react";
import { TfiEmail } from "react-icons/tfi";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgetPass = () => {
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

    setLoading(true); // Bật trạng thái loading
    axiosInstance
      .post("/auth/forgot-password", { email })
      .then((response) => {
        setLoading(false); // Tắt loading
        if (response.data.status) {
          toast.success("Mời bạn kiểm tra email!");
          navigate("/sign-up");
        } else {
          toast.error(response.data.message || "Có lỗi xảy ra!");
        }
      })
      .catch((error) => {
        setLoading(false); // Tắt loading
        const errorMessage =
          error.response?.data?.message || "Email không tồn tại!";
        toast.error(errorMessage);
      });
  };

  return (
    <div className="a-right">
      <form className="infoForm authForm" onSubmit={handleSubmit}>
        <div className="form-control">
          <h1 className="text-2xl font-bold mt-2">Forgot Password</h1>

          <TfiEmail className="w-6 h-6 text-primary" />
          <h3>Enter your email</h3>

          <div className="form-control">
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
            className="btn btn-primary w-full"
            disabled={loading} // Vô hiệu hoá nút khi đang xử lý
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPass;