import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./axios";

const useCheckUserStatus = () => {
  const navigate = useNavigate();

  // Hàm xóa cookie jwt
  const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  };

  // Lấy token từ cookie
  const getTokenFromCookie = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="));
    if (token) {
      return token.split("=")[1];
    }
    return null;
  };

  const checkStatus = async () => {
    const token = getTokenFromCookie();
    if (token) {
      console.log("Token: ", token);
    } else {
      console.log("Token không có trong cookie");
    }

    try {
      const response = await axiosInstance.get("/auth/check-status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log(response.data.message); // "Tài khoản hợp lệ"
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Nếu tài khoản bị chặn, hiển thị cửa sổ xác nhận
        const confirmLogout = window.confirm(
          "Tài khoản của bạn đã bị khóa. Bạn có muốn đăng xuất?"
        );

        if (confirmLogout) {
          try {
            // Gửi yêu cầu đăng xuất từ server (nếu có API đăng xuất)
            await axiosInstance.post("/auth/logout");

            // Xóa token từ localStorage và cookie
            localStorage.removeItem("token");
            deleteCookie("jwt");

            // Hiển thị thông báo đăng xuất thành công
            alert("Đăng xuất thành công!");

            // Điều hướng người dùng về trang đăng nhập
            navigate("/sign-in");

            // Thêm đoạn code này để đảm bảo rằng trang được tải lại
            setTimeout(() => {
              window.location.reload(); // Refresh lại trang nếu cần thiết
            }, 500);
          } catch (logoutError) {
            console.error("Lỗi khi đăng xuất:", logoutError.message);
          }
        }
      } else {
        console.error("Lỗi kiểm tra trạng thái:", error.message);
      }
    }
  };

  return { checkStatus };
};

export default useCheckUserStatus;
