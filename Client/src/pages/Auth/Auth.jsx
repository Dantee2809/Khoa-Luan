import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../img/logo.png";
import "./Auth.css";
import { useAuthStore } from "../../store/useAuthStore";

const Auth = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(false); // State để lưu trạng thái checkbox

  return (
    <div className="Auth">
      <div className="a-left">
        <img src={Logo} alt="Logo" />
        <div className="Webname">
          <h1>TL SOSICAL</h1>
          <h6>Mạng xã hội tìm đồ bị thất lạc toàn quốc</h6>
        </div>
      </div>
      <Login isAdminLogin={isAdminLogin} setIsAdminLogin={setIsAdminLogin} />{" "}
      {/* Truyền setIsAdminLogin vào Login */}
    </div>
  );
};

function Login({ isAdminLogin, setIsAdminLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn, user, fetchDataByRole } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Thêm state để lưu lỗi

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi khi bắt đầu submit

    try {
      // Gửi yêu cầu đăng nhập với tham số isAdminLogin
      await login({ ...formData, isAdminLogin });

      if (user) {
        const expectedRole = isAdminLogin ? "admin" : "user"; // Vai trò mong muốn

        if (user.role === expectedRole) {
          // Vai trò khớp
          await fetchDataByRole(user.role); // Lấy dữ liệu theo vai trò
        } else {
          // Vai trò không khớp
          setError(
            `Bạn không có quyền truy cập vào trang ${
              isAdminLogin ? "Admin" : "User"
            }!`
          );
        }
      }
    } catch (err) {
      // Xử lý lỗi từ server
      setError(err.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="a-right">
      {/* Checkbox để chuyển đổi giữa admin login và user login */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={isAdminLogin}
            onChange={() => setIsAdminLogin(!isAdminLogin)} // Đảo trạng thái khi thay đổi checkbox
          />
          Đăng nhập với tư cách admin
        </label>
      </div>
      <form className="infoForm authForm" onSubmit={handleSubmit}>
        <h3>{isAdminLogin ? "Đăng Nhập Admin" : "Đăng Nhập Người Dùng"}</h3>
        {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
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
              className="link link-primary"
              style={{ color: "blue" }}
            >
              Đăng Ký
            </Link>
          </p>
        </div>
        <div>
          <p className="text-base-content/60" style={{ fontSize: "12px" }}>
            <Link
              to="/forget-password"
              className="link link-primary"
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
