import express from "express";
import {
  getContacts,
  getMessages,
  getUsersForSidebar,
  sendMessage,
  deleteMessage,
} from "../Controllers/MessageController.js";
import { protectRoute } from "../middleware/auth_middleware.js";
import authenticateToken from "../lib/auth.js";

const router = express.Router();

//router.post('/', addMessage)
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/contacts", protectRoute, getContacts);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.get("/contacts", protectRoute, getContacts);
router.delete("/:messageId", deleteMessage);

export default router;
