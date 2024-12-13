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
import "./UserList.css";

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
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleShowChart = (type) => {
    let labels = [];
    let data = [];

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

  const fetchReportData = async () => {
    try {
      const response = await axiosInstance.get("/admin/reports");
      console.log(response.data); // Kiểm tra dữ liệu từ API
      setReportData(response.data);
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
    <div className="dashboard-container">
      <h2>Thống kê báo cáo</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="report-cards">
            <button onClick={() => handleShowChart("totalUsers")}>
              Người dùng đăng ký
            </button>
            <button onClick={() => handleShowChart("totalIncidents")}>
              Bài viết đã đăng
            </button>
            <button onClick={() => handleShowChart("totalLostItems")}>
              Vật bị mất
            </button>
            <button onClick={() => handleShowChart("totalFoundItems")}>
              Vật được tìm thấy
            </button>
          </div>

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
