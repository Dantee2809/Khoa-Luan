import express from 'express';
import { authUser, deleteUser, followUser, getUser, getUsers, updateUser } from '../Controllers/UserController.js';
import authenticateToken from '../Controllers/UserAuth.js';

const router = express.Router();

router.get('/getUser/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.put('/:id/follow', followUser)
router.get('/getUsers', getUsers)
router.get('/get-user-info', authenticateToken , authUser)

export default router