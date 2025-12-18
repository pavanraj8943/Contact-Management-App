import express from 'express';
import {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,

} from '../controllers/contactController.js';

const router = express.Router();


router.get('/', getAllContacts);          
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;
