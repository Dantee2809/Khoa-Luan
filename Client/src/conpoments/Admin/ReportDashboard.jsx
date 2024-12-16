import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Report.css";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ReportDashboard = () => {
  const [reportData, setReportData] = useState({});
  const [chartData, setChartData] = useState(null); // Dữ liệu biểu đồ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm xử lý khi người dùng chọn loại biểu đồ
  const handleShowChart = (type) => {
    let labels = [];
    let data = [];

    // Xử lý dữ liệu theo loại biểu đồ
    switch (type) {
      case "totalUsers":
        if (reportData.monthlyUsers) {
          labels = reportData.monthlyUsers.map(
            (item) => `${item._id.month}/${item._id.year}`
          );
          data = reportData.monthlyUsers.map((item) => item.count);
        }
        break;

      case "totalIncidents":
        labels = ["Tổng số bài viết"];
        data = [reportData.totalIncidents];
        break;

      case "totalLostItems":
        labels = ["Tổng số vật bị mất"];
        data = [reportData.totalLostItems];
        break;

      case "totalFoundItems":
        labels = ["Tổng số vật tìm thấy"];
        data = [reportData.totalFoundItems];
        break;

      default:
        return;
    }

    // Cập nhật dữ liệu biểu đồ khi chọn loại
    setChartData({
      labels,
      datasets: [
        {
          label: `Biểu đồ ${type}`,
          data,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
        },
      ],
    });
  };

  // Hàm lấy dữ liệu báo cáo
  const fetchReportData = async () => {
    try {
      const response = await axiosInstance.get("/admin/reports");
      setReportData(response.data); // Lưu dữ liệu báo cáo
    } catch (err) {
      setError("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div className="report-dashboard">
      <h2>Thống kê báo cáo</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="report-cards">
            <div className="report-card">
              <button onClick={() => handleShowChart("totalUsers")}>
                Người dùng đăng ký
              </button>
            </div>
            <div className="report-card">
              <button onClick={() => handleShowChart("totalIncidents")}>
                Bài viết đã đăng
              </button>
            </div>
            <div className="report-card">
              <button onClick={() => handleShowChart("totalLostItems")}>
                Vật bị mất
              </button>
            </div>
            <div className="report-card">
              <button onClick={() => handleShowChart("totalFoundItems")}>
                Vật được tìm thấy
              </button>
            </div>
          </div>

          {/* Biểu đồ chỉ hiện khi có dữ liệu */}
          {chartData && (
            <div className="chart-container">
              <Line data={chartData} options={{ responsive: true }} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportDashboard;
