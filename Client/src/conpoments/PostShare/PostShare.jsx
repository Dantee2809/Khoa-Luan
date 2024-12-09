import React, { useEffect, useRef, useState } from "react";
import "./PostShare.css";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";
import axios from "axios";

const PostShare = ({ onPostCreateSuccess }) => {
  // Nhận props callback
  const { authUser } = useAuthStore(); // Lấy thông tin người dùng đăng nhập từ Zustand
  const { createPost, isCreating, createPostSuccess, createPostError } =
    usePostStore(); // Lấy store từ Zustand
  const fileInputRef = useRef(); // Ref để reset input file

  // State quản lý form data
  const [formData, setFormData] = useState({
    userId: authUser?._id || "", // Lấy ID người dùng từ Zustand
    username: authUser?.username || "", // Lấy username từ authUser
    desc: "",
    contact: "",
    location: "", // Sẽ lưu ID của tỉnh thành
    image: null,
    isLost: false,
    isFound: false,
  });

  // State lưu danh sách tỉnh thành
  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

  // Lấy danh sách tỉnh thành từ API khi component được render
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/post/provinces") // URL API tỉnh thành của bạn
      .then((response) => {
        setProvinces(response.data); // Cập nhật danh sách tỉnh thành
        setLoadingProvinces(false); // Dừng loading
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
        setLoadingProvinces(false);
      });
  }, []);

  // Cập nhật formData khi người dùng chọn tỉnh thành
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (e) => {
    setFormData({ ...formData, location: e.target.value }); // Lưu ID vào formData
  };

  // Cập nhật giá trị cho các trường boolean
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
      // Đảm bảo chỉ một checkbox được chọn
      isLost: name === "isLost" ? checked : false,
      isFound: name === "isFound" ? checked : false,
    }));
  };

  // Cập nhật trường ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result }); // Convert image to base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createPost(formData); // Gọi hành động createPost từ store
    if (success) {
      setFormData({
        userId: authUser?._id || "",
        username: authUser?.username || "",
        desc: "",
        contact: "",
        location: "",
        image: null, // Reset ảnh
        isLost: false,
        isFound: false,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input file
      }
      // Gọi callback sau khi tạo bài thành công
      if (onPostCreateSuccess) {
        onPostCreateSuccess(); // Đóng modal
      }
    }
  };

  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        userId: authUser._id,
        username: authUser.username,
      })); // Cập nhật userId và username nếu authUser thay đổi
    }
  }, [authUser]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Mô tả
        </label>
        <textarea
          name="desc"
          value={formData.desc}
          onChange={handleChange}
          className="textarea textarea-bordered w-full p-3 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Viết mô tả..."
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Liên lạc
        </label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          className="input input-bordered w-full p-3 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Số điện thoại"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Địa điểm
        </label>
        <select
          name="location"
          value={formData.location}
          onChange={handleLocationChange}
          className="input input-bordered w-full p-3 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Chọn địa điểm</option>
          {loadingProvinces ? (
            <option disabled>Loading provinces...</option>
          ) : (
            provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Chọn ảnh
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="input input-bordered w-full p-3 rounded-md border-gray-300 shadow-sm focus:outline-none"
        />
      </div>
      <div className="space-x-6 flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isLost"
            checked={formData.isLost}
            onChange={handleCheckboxChange}
            className="checkbox checkbox-primary h-5 w-5 text-blue-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700 font-medium">Mất Đồ</span>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isFound"
            checked={formData.isFound}
            onChange={handleCheckboxChange}
            className="checkbox checkbox-primary h-5 w-5 text-green-600 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
          <span className="ml-2 text-sm text-gray-700 font-medium">
            Đã tìm thấy / Nhặt được
          </span>
        </div>
      </div>

      <button
        type="submit"
        className={`btn w-full p-3 rounded-md bg-blue-200 ${
          isCreating ? "btn-disabled loading" : "btn-primary hover:bg-blue-600"
        }`}
        disabled={isCreating}
      >
        {isCreating ? "Đang tạo bài..." : "Đăng bài"}
      </button>
      {createPostSuccess && (
        <p className="text-green-600 mt-4 text-sm">
          Post created successfully!
        </p>
      )}
      {createPostError && (
        <p className="text-red-600 mt-4 text-sm">Error: {createPostError}</p>
      )}
    </form>
  );
};

export default PostShare;
