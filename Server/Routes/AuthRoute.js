import express from 'express';
import { registerUser , loginUser, logoutUser, authUser } from '../Controllers/AuthController.js';
import authenticateToken from '../Controllers/UserAuth.js'
const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)
router.get('/get-user-info',authenticateToken , authUser)
export default router