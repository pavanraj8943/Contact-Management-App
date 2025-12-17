import express from 'express';
import { createContact,
        getContact,
        searchContact,
        updateContact,
        deleteContact
 } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', createContact);
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;
