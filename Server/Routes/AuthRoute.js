import express from 'express';
import { registerUser , loginUser, logoutUser, authUser, updateProfile, checkAuth, deleteUser } from '../Controllers/AuthController.js';
import authenticateToken from '../Controllers/UserAuth.js'
import { protectRoute } from '../middleware/auth_middleware.js';
const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/get-user-info',authenticateToken , authUser)
router.put('/update-profile', protectRoute, updateProfile);
router.get('/check', protectRoute, checkAuth);
router.delete("/delete", authenticateToken, deleteUser);

export default router