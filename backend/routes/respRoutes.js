import express from 'express';
import {
  createResponsible,
  getAllResponsibles,
  getResponsibleById,
  updateResponsible,
  deleteResponsible,
} from '../controllers/RespController.js';

const router = express.Router();

router.post('/', createResponsible);
router.get('/', getAllResponsibles);
router.get('/:id', getResponsibleById);
router.put('/:id', updateResponsible);
router.delete('/:id', deleteResponsible);

export default router;
