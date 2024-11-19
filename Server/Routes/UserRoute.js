import express from 'express';
import { deleteUser, followUser, getUser, getUsers, updateUser } from '../Controllers/UserController.js';

const router = express.Router();

router.get('/getUser/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.put('/:id/follow', followUser)
router.get('/getUsers', getUsers)

export default router