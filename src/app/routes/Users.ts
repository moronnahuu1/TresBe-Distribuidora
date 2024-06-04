import { Router } from "express";
import { deleteUser, deleteUsers, getUser, getUsers, postUser, updateUser } from "../controllers/Users";
const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.delete('/:', deleteUsers);
router.post('/', postUser);
router.patch('/:id', updateUser);

export default router;