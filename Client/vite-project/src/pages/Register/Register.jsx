// client/src/components/Register.js
import React, { useState } from 'react';
function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    livein: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userRegister(formData);
      alert("Đăng ký thành công!");
    } catch (error) {
      alert("Username đã tồn tại hoặc có lỗi xảy ra");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đăng Ký</h2>
      <input type="text" name="username" value={formData.password} placeholder="Username" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} required />
      <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} required />
      <input type="text" name="livein" placeholder="Nơi ở" onChange={handleChange} />
      <button type="submit">Đăng Ký</button>
    </form>
  );
}

export default Register;
