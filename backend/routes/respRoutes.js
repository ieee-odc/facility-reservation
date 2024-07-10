import express from 'express';
import {
  createResponsible,
  getAllResponsibles,
  getResponsibleById,
  updateResponsible,
  deleteResponsible,
} from '../controllers/responsibleController.js';

const router = express.Router();

router.post('/responsible', createResponsible);
router.get('/responsible', getAllResponsibles);
router.get('/responsible/:id', getResponsibleById);
router.put('/responsible/:id', updateResponsible);
router.delete('/responsible/:id', deleteResponsible);

export default router;
