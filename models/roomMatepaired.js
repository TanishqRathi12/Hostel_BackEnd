import mongoose from "mongoose";

const roommatePairSchema = new mongoose.Schema({
  Hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    required: true,
  },
  student1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  student2: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }, // Optional if one student doesn't have a pair
  createdAt: { type: Date, default: Date.now },
});

const RoommatePair = mongoose.model("RoommatePair", roommatePairSchema);

export default RoommatePair;
