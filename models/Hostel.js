import mongoose, { Mongoose } from "mongoose";

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  latitude: {
    type: String, // Latitude of the office
    required: true,
  },
  longitude: {
    type: String, // Longitude of the office
    required: true,
  },
  Students:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student"
  }],
  radius: {
    type: Number, // Geofence radius in meters
    default: 200,
  },
});

const Hostel = mongoose.model("Hostel", hostelSchema);
export default Hostel;
