import express from 'express';
import { isAdmin } from '../Controllers/AdminAuth.js';
import { approvePost, getApprovedPosts, getPendingPosts, loginAdmin, registerAdmin } from '../Controllers/AdminController.js';
const router = express.Router();

router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.post("/approve/:id", isAdmin, approvePost);
router.get("/pendingPost", isAdmin, getPendingPosts);
router.get("/approvePost", isAdmin, getApprovedPosts);


export default router