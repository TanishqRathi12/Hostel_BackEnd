import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel", // Reference to Hostel schema
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    default: "absent",
  },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
