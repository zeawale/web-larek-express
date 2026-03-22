import { Router } from 'express';
import {
  getProducts,
  createProduct,
  getProductById,
} from '../controllers/product';
import { createProductValidation } from '../middlewares/validation';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProductValidation, createProduct);

export default router;
