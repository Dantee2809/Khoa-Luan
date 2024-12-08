import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import "./Auth.css";
import Logo from "../../img/logo.png";
import { Link } from "react-router-dom";

const RegisterUser = () => {
  return (
    <div className="Auth">
      <div className="a-left">
        <img src={Logo} alt="Logo" />
        <div className="Webname">
          <h1>TL SOSICAL</h1>
          <h6>Mạng xã hội tìm đồ bị thất lạc toàn quốc</h6>
        </div>
      </div>
      <Auth />
    </div>
  );
};

function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const { signup, isSigningUp, registerError } = useAuthStore();

  const validateForm = () => {
    if (!formData.username.trim())
      return toast.error("Full name không được để trống");
    if (!formData.email.trim()) return toast.error("Email không được để trống");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Email không đúng định dạng");
    if (!formData.password) return toast.error("Mật khẩu không được để trống");
    if (formData.password.length < 6)
      return toast.error("Password nên có 6 kí tự ");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="a-right">
      <form className="infoForm authForm" onSubmit={handleSubmit}>
        <h3>Đăng Ký</h3>

        {/* Username */}
        <div>
          <input
            type="text"
            className="infoInput"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        {/* Email */}
        <div>
          <input
            className="infoInput"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        {/* First and Last Name */}
        <div>
          <input
            type="text"
            placeholder="First Name"
            className="infoInput"
            value={formData.firstname}
            onChange={(e) =>
              setFormData({ ...formData, firstname: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            className="infoInput"
            value={formData.lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div>
          <input
            type={showPassword ? "text" : "password"}
            className="infoInput"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="size-5 text-base-content/40" />
            ) : (
              <Eye className="size-5 text-base-content/40" />
            )}
          </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="button infoButton"
          disabled={isSigningUp}
        >
          {isSigningUp ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Loading...
            </>
          ) : (
            "Tạo Tài Khoản"
          )}
        </button>

        {/* Link to Sign In */}
        <div className="text-center">
          <p className="text-base-content/60" style={{ fontSize: "15px" }}>
            Đã có tài khoản?{" "}
            <Link
              to="/sign-in"
              className="link link-primary "
              style={{ color: "blue" }}
            >
              Đăng Nhập
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterUser;
