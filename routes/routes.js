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

router.post('/', createContact);
router.get('/', getAllContacts);
router.get('/search', searchContact); // MUST be before :id
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;
