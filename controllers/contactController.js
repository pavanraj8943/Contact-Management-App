import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    const { name, countryCode, phoneNumber } = req.body;

    if (!name || name.trim().length < 4)
      return res.status(400).json({ message: "Name min 4 chars" });

    if (!/^\+\d{1,3}$/.test(countryCode))
      return res.status(400).json({ message: "Invalid country code" });

    if (!/^[1-9]\d{9}$/.test(phoneNumber))
      return res.status(400).json({ message: "Invalid phone number" });

    const contact = await Contact.create({
      name: name.trim(),
      countryCode,
      phoneNumber,
    });

    res.status(201).json(contact);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Contact already exists"
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const getAllContacts = async (_, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
};

export const getContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ message: "Not found" });
  res.json(contact);
};

export const updateContact = async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(contact);
};

export const deleteContact = async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
