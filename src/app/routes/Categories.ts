import { Router } from "express";
import { deleteCategories, deleteCategory, getCategories, getCategory, postCategory, updateCategory } from "../controllers/Categories";
const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.delete('/:id', deleteCategory);
router.delete('/:', deleteCategories);
router.post('/', postCategory);
router.patch('/:id', updateCategory);

export default router;