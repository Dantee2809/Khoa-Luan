import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import Profile from "./pages/Profile/Profile.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Navbar from "./conpoments/Navbar/Navbar.jsx";
import Chat from "./pages/Chat/Chat.jsx";
import DeleteAccount from "./conpoments/ProfileCard/DeleteAccount.jsx";
import AdminDash from "./pages/home/AdminDash.jsx";
import PostDetail from "./conpoments/Post/PostDetail.jsx";
import AdminSidebar from "./pages/home/AdminSidebar.jsx";
import UserList from "./conpoments/Admin/UserList.jsx";
import ForgetPass from "./pages/Auth/ForgetPass.jsx";
import ResetPass from "./pages/Auth/ResetPass.jsx";
import SearchPage from "./conpoments/LogoSearch/SearchPage.jsx";
import RegisterUser from "./pages/Auth/RegisterUser.jsx";
import AdvControl from "./conpoments/Admin/AdvControl.jsx";
import ReportDashboard from "./conpoments/Admin/ReportDashboard.jsx";
import ReportPost from "./conpoments/Admin/ReportPost.jsx";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  // Protected Route Component that checks for authentication
  const ProtectedRoute = ({ children }) => {
    return authUser ? children : <Navigate to="/sign-in" />;
  };
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-layout">
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to="/sign-in" />}
          />
          {/* Đăng nhập, chuyển hướng nếu đã đăng nhập */}
          <Route
            path="/admin-login"
            element={
              !authUser ? <Auth isAdminLogin={true} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/sign-in"
            element={
              !authUser ? <Auth isAdminLogin={false} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminSidebar />
              </ProtectedRoute>
            }
          >
            {/* Trang Dashboard mặc định */}
            <Route path="admin-post" element={<AdminDash />} />{" "}
            <Route path="admin-user" element={<UserList />} />{" "}
            <Route path="admin-report" element={<ReportDashboard />} />{" "}
            <Route path="admin-adv" element={<AdvControl />} />{" "}
            <Route path="admin-message" element={<Chat />} />{" "}
            <Route path="admin-post/:id" element={<PostDetail />} />{" "}
            <Route path="admin-report-post" element={<ReportPost />} />{" "}
            {/* Các route khác có thể thêm ở đây */}
          </Route>
          {/* Các route khác */}
          <Route path="*" element={<div>Lỗi</div>} />
          <Route path="/forget-password" element={<ForgetPass />} />{" "}
          <Route path="/reset-password/:token" element={<ResetPass />} />{" "}
          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/search-results" element={<SearchPage />} />
          <Route
            path="/chatbox"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delete-account"
            element={
              <ProtectedRoute>
                <DeleteAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-up"
            element={!authUser ? <RegisterUser /> : <Navigate to="/" />}
          />
          <Route path="/post/:id" element={<PostDetail />} />{" "}
          {/* Trang chi tiết bài viết */}
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
};

export default App;
