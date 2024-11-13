// import mongoose from "mongoose";

// const manualAttendanceSchema = new mongoose.Schema({
//   Student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Employee", // Reference to Employee Schema
//     required: true,
//   },
//   marking_time: {
//     type: Date,
//     required: true,
//   },
//   latitude: {
//     type: String,
//     required: true,
//   },
//   longitude: {
//     type: String,
//     required: true,
//   },
//   is_manual: {
//     type: Boolean,
//     default: true, // Indicates manual attendance
//   },
//   suggested_location: {
//     type: String, // This could be a custom location name or suggestion
//     required: true,
//   },
// });

// const ManualAttendance = mongoose.model(
//   "ManualAttendance",
//   manualAttendanceSchema
// );
// export default ManualAttendance;
