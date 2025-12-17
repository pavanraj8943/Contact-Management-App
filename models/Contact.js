import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true},
    countryCode: { type: String, required: true},
    phoneNumber: { type: String, required: true, unique: true}},
  { timestamps: true }
);

export default mongoose.model('Contact', ContactSchema);
