import mongoose from "mongoose";

const roommateSchema = new mongoose.Schema({
  StudentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  budget: { type: Number, required: true },
  location: { type: String, required: true },
  lifestyle: {
    nightOwl: { type: Boolean, required: true },
    cleanlinessLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
  },
  hobbies: [String],
  Hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },
  createdAt: { type: Date, default: Date.now },
});

const RoomMate = mongoose.model("RoomMate", roommateSchema);

export default RoomMate;
