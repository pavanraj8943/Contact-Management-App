import express from 'express';
import {
  createContact,
  getAllContacts,
  getContact,
  updateContact,
  deleteContact,
  searchContact
} from '../controllers/contactController.js';

const router = express.Router();

router.get('/search', searchContact);
router.get('/', getAllContacts);          
router.post('/', createContact);
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;
