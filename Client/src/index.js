import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Thêm BrowserRouter
import App from "./App.js";

const container = document.getElementById("root");
const root = createRoot(container); // Tạo root từ phần tử DOM

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
