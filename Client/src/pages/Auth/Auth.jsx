import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../img/logo.png";
import "./Auth.css";
import { useAuthStore } from "../../store/useAuthStore";

const Auth = ({ isAdminLogin }) => {
  return (
    <div className="Auth">
      <div className="a-left">
        <img src={Logo} alt="Logo" />
        <div className="Webname">
          <h1>TL SOSICAL</h1>
          <h6>Mạng xã hội tìm đồ bị thất lạc toàn quốc</h6>
        </div>
      </div>
      <Login isAdminLogin={isAdminLogin} />
    </div>
  );
};

function Login({ isAdminLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn, user, fetchDataByRole } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(formData); // Gọi login để đăng nhập

    if (user) {
      const expectedRole = isAdminLogin ? "admin" : "user"; // Xác định role mong muốn

      if (user.role === expectedRole) {
        // Vai trò khớp
        await fetchDataByRole(user.role); // Lấy dữ liệu theo role
      } else {
        // Vai trò không khớp
        alert(
          `Bạn không có quyền truy cập vào trang ${
            isAdminLogin ? "Admin" : "User"
          }!`
        );
      }
    }
  };

  return (
    <div className="a-right">
      <form className="infoForm authForm" onSubmit={handleSubmit}>
        <h3>{isAdminLogin ? "Đăng Nhập Admin" : "Đăng Nhập Người Dùng"}</h3>
        <div>
          <input
            placeholder="you@example.com"
            className="infoInput"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <input
            className="infoInput"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          className="button infoButton"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Đăng nhập"
          )}
        </button>
        <div>
          <p className="text-base-content/60" style={{ fontSize: "12px" }}>
            Chưa có tài khoản?{" "}
            <Link
              to="/sign-up"
              className="link link-primary "
              style={{ color: "blue" }}
            >
              Đăng Ký
            </Link>
          </p>
        </div>
        <div>
          <p className="text-base-content/60" style={{ fontSize: "12px" }}>
            {" "}
            <Link
              to="/forget-password"
              className="link link-primary "
              style={{ color: "blue" }}
            >
              Quên mật khẩu?
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Auth;
