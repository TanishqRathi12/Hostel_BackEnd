import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  Student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to Employee Schema
    required: true,
  },
  Student_Name: {
    type: String,
    required:true
  },
  marking_time: {
    type: Date,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
