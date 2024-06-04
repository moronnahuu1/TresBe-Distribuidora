import { Router } from "express";
import { deleteFeature, deleteFeatures, getFeature, getFeatures, postFeature, updateFeature } from "../controllers/Features";
const router = Router();

router.get('/', getFeatures);
router.get('/:id', getFeature);
router.delete('/:id', deleteFeature);
router.delete('/:', deleteFeatures);
router.post('/', postFeature);
router.patch('/:id', updateFeature);

export default router;