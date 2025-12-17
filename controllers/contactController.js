import { error } from 'console';
import contact from '../models/Contact.js'

export const createContact = async (req, res) => {
    try {

        const { name, countryCode, phoneNumber } = req.body

        if (!name || !countryCode || !phoneNumber) {
            return res.status(400).json({massage: 'not created' });
        }

        const contact = await Contact.create({
            name,
            countryCode,
            phoneNumber
        });

        res.status(201).json(contact);

    } catch (error) {
        res.status(500).json({ massage: error.massage });
        console.log(error);
        
    }
}
export const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'not found' });
        }
        res.json(contact);

    } catch (error) {
        res.res.status(500).json({ massage: error.massage });
    }
}
export const updateContact = async (req, res) => {
    try {

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(contact);
    } catch (error) {
        res.res.status(500).json({ massage: error.massage });
    }
}

export const deleteContact = async(req , res)=>{
    try {
        
        const contact = await Contact.findByIdAndDelete(req.params.id)
        res.status(200).json({massage: 'contact delete successfull'})

    } catch (error) {
        res.res.status(500).json({ massage: error.massage });
    }
}




