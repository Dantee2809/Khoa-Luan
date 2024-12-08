import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Line } from "react-chartjs-2"; // Sử dụng biểu đồ đường (Line chart)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // Đăng ký PointElement
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./UserList.css";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // Đăng ký PointElement
  Title,
  Tooltip,
  Legend
);

const ReportDashboard = () => {
  const [postsData, setPostsData] = useState([]);
  const [reportData, setReportData] = useState({
    totalUsers: 0,
    totalIncidents: 0,
    totalLostItems: 0,
    totalFoundItems: 0,
  });
  const [lostItemsCount, setLostItemsCount] = useState(null); // Trạng thái lưu số bài viết
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axiosInstance.get("/admin/reports");
        setReportData((prevData) => ({
          ...prevData,
          ...response.data, // Gán dữ liệu báo cáo vào state
        }));
      } catch (err) {
        setError("Failed to load report data");
      } finally {
        setLoading(false); // Đảm bảo loading sẽ được cập nhật sau khi fetch hoàn tất
      }
    };

    fetchReportData();
  }, []);

  // Fetch posts data
  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const response = await axiosInstance.get("/admin/all-posts-by-month");
        setPostsData(response.data);
      } catch (err) {
        setError("Failed to load posts data");
      } finally {
        setLoading(false); // Đảm bảo loading sẽ được cập nhật sau khi fetch hoàn tất
      }
    };

    fetchPostsData();
  }, []);
  // Lấy số bài viết báo mất đồ trong tháng qua
  useEffect(() => {
    const fetchLostItemsCount = async () => {
      try {
        const response = await axiosInstance.get("/admin/lost-items-count"); // Gọi API của bạn
        setLostItemsCount(response.data.lostItemsCount); // Cập nhật số bài viết
      } catch (err) {
        setError("Không thể lấy dữ liệu"); // Cập nhật lỗi nếu có
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    };

    fetchLostItemsCount();
  }, []);
  // Nếu dữ liệu đang tải, hiển thị loading
  if (loading) return <div>Loading...</div>;

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) return <div>{error}</div>;

  // Dữ liệu cho biểu đồ Line (Biểu đồ tăng trưởng theo tháng)
  const chartData = {
    labels: postsData.map((item) => `${item._id.month}/${item._id.year}`), // Label cho mỗi tháng
    datasets: [
      {
        label: "Số bài viết",
        data: postsData.map((item) => item.totalPosts), // Dữ liệu số bài viết
        borderColor: "rgba(75, 192, 192, 1)", // Màu cho đường biểu đồ
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Màu nền cho biểu đồ
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Cấu hình cho biểu đồ Line
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tăng trưởng số bài viết theo tháng",
      },
    },
  };

  return (
    <div className="dashboard-container">
      {/* Biểu đồ tăng trưởng số bài viết theo tháng */}
      <div className="posts-dashboard">
        <h2>Tăng trưởng số bài viết theo tháng</h2>
        <div className="chart-container">
          {/* Hiển thị biểu đồ Line */}
          <Line data={chartData} options={chartOptions} />
        </div>
        <div>Trong tháng này đã tăng lên: {lostItemsCount} bài viết</div>
      </div>

      {/* Thống kê báo cáo */}
      <div className="report-dashboard">
        <h2>Thống kê báo cáo</h2>
        <div className="report-cards">
          <div className="report-card">
            <h3>Người dùng đăng ký</h3>
            <p>{reportData.totalUsers}</p>
          </div>
          <div className="report-card">
            <h3>Vật bị mất cấp</h3>
            <p>{reportData.totalLostItems}</p>
          </div>
          <div className="report-card">
            <h3>Vụ mất cắp</h3>
            <p>{reportData.totalIncidents}</p>
          </div>
          <div className="report-card">
            <h3>Vật được tìm thấy</h3>
            <p>{reportData.totalFoundItems}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;
