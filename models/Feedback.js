import mongoose from "mongoose";

const feedBackSchema = new mongoose.Schema({
  FeedBack: {
    type: String,
    required: true,
  },
  Hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel", // Reference to Hostel schema
  },
});

const feedBack = mongoose.model("FeedBack", feedBackSchema);
export default feedBack;
