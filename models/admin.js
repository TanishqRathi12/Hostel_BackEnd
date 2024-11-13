import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  College: {
    type: String,
    required: true,
  },
  Hostels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel", // Many-to-Many relationship with offices
    },
  ],
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
