import jwt from "jsonwebtoken";
import Hostels from "../models/Hostel.js";
import Student from "../models/Student.js";
import Admin from "../models/admin.js";
import Attendance from "../models/attendance.js";
import feedBack from "../models/Feedback.js";
import RoommatePair from "../models/roomMatepaired.js";
import RoomMate from "../models/RoomMate.js";
//import ManualAttendance from "../models/manualAttendance.js";
import { adminSigninSchema, adminSignupSchema } from "../validation/schema.js";


export const signinHandler = async (req, res) => {
 
  const adminPayload = req.body;
  
  const isValid = adminSigninSchema.safeParse(adminPayload);

  if (!isValid.success) {
    res.json({ message: "Invalid Information" });
    return;
  }
  console.log(adminPayload)
  const admin = await Admin.findOne({
    email: adminPayload.email,
    password: adminPayload.password,
  });

  if (admin) {
    const token = await jwt.sign({ admin }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Admin signed in.",
      token: token,
    });
  } else {
    res.status(200).json({
      message: "Admin does not exist.",
      admin: null,
      token: null,
    });
  }
};

export const signupHandler = async (req, res) => {
  console.log("In handler")
  const adminPayload = req.body;
  console.log(adminPayload)
  const isValid = adminSignupSchema.safeParse(adminPayload);

  if (!isValid.success) {
    res.json({ message: isValid.error });
    return;
  }
  
  const adminExists = await Admin.findOne({
    email: adminPayload.email,
  });

  if (!adminExists) {
    const admin = await Admin.create({
      name: adminPayload.name,
      email: adminPayload.email,
      phone: adminPayload.phone,
      password: adminPayload.password,
      College: adminPayload.College,
    });

    const token = await jwt.sign({ admin }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Admin created.",
      admin: admin,
      token
    });
  } else {
    res.status(200).json({
      message: "Admin exists.",
      admin: null
    });
  }
};

export const addHostelHandler = async (req, res) => {
 // console.log("here")
  const { adminId, name, longitude, latitude } = req.body;

  try {
    const hostel = await Hostels.create({
      name,
      latitude,
      longitude,
    });

    await Admin.findByIdAndUpdate(
      adminId,
      { $push: { Hostels: hostel._id } },
      { new: true }
    );

    res.status(200).json(hostel);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getHostelsByAdminIdHandler = async (req, res) => {
  const adminId = req.params.adminId;
  try {
    const adminWithHostel = await Admin.findById(adminId).populate("Hostels");
    if (!adminWithHostel) {
      res.status(200).json({ message: "Admin not found." });
      return null;
    }

    res.status(200).json({ Hostels: adminWithHostel.Hostels });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getStudentByHostelIdHandler = async (req, res) => {
  const HostelId = req.params.HostelId;
  try {
    const student = await Student.find({ Hostel: HostelId });

    res.status(200).json(student);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getFeedBackByHostelIdHandler = async (req,res) => {
  const HostelId = req.params.HostelId;
  try {
    const feeBacks = await feedBack.find({Hostel:HostelId})
    res.status(200).json(feeBacks);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

export const getAttendanceByStIdHandler = async (req, res) => {
  const StId = req.params.StId;
  try {
    const attendance = await Attendance.find({ Student: StId });
    res.status(200).json(attendance);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


export const shuffleAndSaveHostelPairs = async (req, res) => {
  try {
    const  hostelId = req.params.HostelId; // Admin provides the hostel ID to shuffle
   // console.log(hostelId)

    // Find all RoomMate profiles for students in the specified hostel
    const roommatesInHostel = await RoomMate.find({ Hostel: hostelId }).populate("StudentId");

    if (roommatesInHostel.length === 0) {
      return res.status(404).json({ message: "No students found in this hostel" });
    }

    // Shuffle logic: Sort RoomMate profiles based on preferences (e.g., budget, cleanliness level)
    roommatesInHostel.sort((a, b) => {
      if (a.budget !== b.budget) {
        return a.budget - b.budget; // Sort by budget (ascending)
      }
      // Further sort by cleanliness level if budgets are the same
      const cleanlinessOrder = { Low: 1, Medium: 2, High: 3 };
      return cleanlinessOrder[a.lifestyle.cleanlinessLevel] - cleanlinessOrder[b.lifestyle.cleanlinessLevel];
    });

    // Create roommate pairs and save them to the RoommatePair model
    let matches = [];
    for (let i = 0; i < roommatesInHostel.length - 1; i += 2) {
      const pair = {
        Hostel: hostelId,
        student1: roommatesInHostel[i].StudentId._id,
        student2: roommatesInHostel[i + 1] ? roommatesInHostel[i + 1].StudentId._id : null, // Null if no pair available
      };
      // Save the pair to the database
      
      const newPair = new RoommatePair(pair);
      await newPair.save();
      // Add the pair to the matches array for the response
      matches.push({
        student1: roommatesInHostel[i].StudentId.name,
        student2: roommatesInHostel[i + 1] ? roommatesInHostel[i + 1].StudentId.name : "No partner found",
      });
    }

    res.status(200).json({
      message: `Roommate pairs created and saved successfully for hostel with ID: ${hostelId}`,
      matches,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPairsByHostelId = async (req,res)=>{
  const HostelId = req.params.HostelId;
  try {
    const pairs = await RoommatePair.find({Hostel:HostelId});
    res.status(200).json(pairs);
  } catch (error) {
    res.status(404).json({message:"Don't Have any generated Pairs"})
  }
}


export const getManualAttendanceByStIdHandler = async (req, res) => {
  const StId = req.params.StId;
  try {
    const manualAttendance = await ManualAttendance.find({ Student: StId });
    res.status(200).json(manualAttendance);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
