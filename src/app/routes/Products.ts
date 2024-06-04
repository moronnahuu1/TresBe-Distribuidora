import { Router } from "express";
import { getProducts, getProduct, deleteProduct, postProduct, updateProduct, deleteProducts } from "../controllers/Products";
const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.delete('/:id', deleteProduct);
router.delete('/:', deleteProducts);
router.post('/', postProduct);
router.patch('/:id', updateProduct);

export default router;