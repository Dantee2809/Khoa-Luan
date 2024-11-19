import express from 'express';
import isAdmin from '../Controllers/AdminAuth.js'
import { approvePost, getPendingPosts } from '../Controllers/AdminController.js';
const router = express.Router();

router.post("/approve/:id", isAdmin, approvePost);
router.get("/pending", isAdmin, getPendingPosts);

export default router