import express from 'express';
import {
  getDevotionals,
  createDevotional,
  updateDevotional,
  deleteDevotional
} from '../Controllers/devotionalController.js';

const router = express.Router();

router.get('/', getDevotionals);
router.post('/', createDevotional);
router.put('/:id', updateDevotional);
router.delete('/:id', deleteDevotional);

export default router;
