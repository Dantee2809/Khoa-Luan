import express from 'express';
import { isAdmin } from '../Controllers/AdminAuth.js';
import { approvePost, getApprovedPosts, getPendingPosts } from '../Controllers/AdminController.js';
const router = express.Router();

router.post("/approve/:id", isAdmin, approvePost);
router.get("/pendingPost", isAdmin, getPendingPosts);
router.get("/approvePost", isAdmin, getApprovedPosts);


export default router