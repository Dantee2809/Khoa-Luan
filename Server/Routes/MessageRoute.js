import express from "express";
import {
  getContacts,
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../Controllers/MessageController.js";
import { protectRoute } from "../middleware/auth_middleware.js";

const router = express.Router();

//router.post('/', addMessage)
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/contacts", protectRoute, getContacts);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.get("/contacts", protectRoute, getContacts);

export default router;
