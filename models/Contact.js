import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,   
    trim: true
  },
  countryCode: String,
  phoneNumber: String
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
