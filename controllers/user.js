import jwt from "jsonwebtoken";
import Attendance from "../models/attendance.js";
import Student from "../models/Student.js";
import { userSigninSchema, userSignupSchema } from "../validation/schema.js";
import Hostel from "../models/Hostel.js";
import toggleStatus from "./Toggle.js";
import feedBack from "../models/Feedback.js";
import RoomMateMatch from "../models/RoomMate.js";

export const signinHandler = async (req, res) => {
  const userPayload = req.body;
  const isValid = userSigninSchema.safeParse(userPayload);

  if (!isValid.success) {
    res.json({ message: "Invalid Information" });
    return;
  }
  console.log(userPayload);
  const student = await Student.findOne({
    email: userPayload.email,
    password: userPayload.password,
  });

  if (student) {
    const token = await jwt.sign({ student }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Student signed in.",
      student: student,
      token: token,
    });
  } else {
    res.status(200).json({
      message: "Student does not exist.",
      student: null,
      token: null,
    });
  }
};

export const signupHandler = async (req, res) => {
  const userPayload = req.body;
  const isValid = userSignupSchema.safeParse(userPayload);

  if (!isValid.success) {
    res.json({ message: "Invalid Information" });
    return;
  }

  const studentExists = await Student.findOne({
    email: userPayload.email,
  });

  if (!studentExists) {
    const student = await Student.create({
      name: userPayload.name,
      email: userPayload.email,
      phone: userPayload.phone,
      password: userPayload.password,
    });

    res.status(200).json({
      message: "Student created.",
      student: student,
    });
  } else {
    res.status(200).json({
      message: "Student exists.",
      student: null,
    });
  }
};

export const joinHostelHandler = async (req, res) => {
  const { stId, HostelId } = req.body;

  try {
    const checkStudent = await Student.findById(stId)
      .select("Hostel")
      .populate("Hostel", "name");

    if (!checkStudent.Hostel) {
      await Student.updateOne(
        { _id: stId },
        {
          Hostel: HostelId,
        }
      );

      await Hostel.updateOne(
        { _id: HostelId },
        {
          $push: { Students: stId },
        }
      );

      // Fetch the updated student record with the populated hostel name
      const updatedStudent = await Student.findById(stId).populate(
        "Hostel",
        "name"
      );

      res.status(200).json({
        message: "Student Added in the Hostel Successfully",
        student: updatedStudent,
      });
    } else {
      res.status(400).json({ message: "Student Already in the Hostel" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getAttendanceByStIdHandler = async (req, res) => {
  const stId = req.params.stId;
  try {
    const attendance = await Attendance.find({ Student: stId });
    res.status(200).json(attendance);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const markAttendanceHandler = async (req, res) => {
  const { Student: StudentID, marking_time, latitude, longitude } = req.body;

  try {
    const student = await Student.findById(StudentID).select("name Hostel");
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    if (!student.Hostel) {
      return res
        .status(400)
        .json({ error: "Student is not assigned to any hostel" });
    }

    // Convert marking_time to UTC
    const date = new Date(marking_time);
    const startOfDayUTC = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const endOfDayUTC = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    const marked = await Attendance.findOne({
      Student: StudentID,
      marking_time: { $gte: startOfDayUTC, $lt: endOfDayUTC },
    });

    if (marked) {
      return res
        .status(400)
        .json({ message: "Attendance Already Marked for Today" });
    }

    // Mark attendance in UTC time
    const attendance = await Attendance.create({
      Student: StudentID,
      Student_Name: student.name, // Store the student's name
      marking_time: date, // Store the exact marking time
      latitude,
      longitude,
    });

    await toggleStatus(StudentID);

    return res.status(200).json({
      attendance,
      message: "Attendance marked successfully.",
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const postFeedbackHandler = async (req, res) => {
  const { message } = req.body; // Feedback message from the request body
  const stId = req.params.stId; // Student ID from the URL parameter

  try {
    const student = await Student.findById(stId);
    if (!student) {
      return res.status(404).json({ message: "User Not Found" });
    }
    console.log(student);
    const Feedback = await feedBack.create({
      FeedBack: message,
      Hostel: student.Hostel,
    });

    return res.status(200).json({
      Feedback,
      message: "Feedback posted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const CreateRoomMateProfile = async (req, res) => {
  const { StudentId, budget, lifestyle, location, hobbies } = req.body;
  
  try {
    // Step 1: Find the student to get the Hostel ID
    const student = await Student.findById(StudentId); 
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Step 2: Extract Hostel ID from student
    const { Hostel } = student;

    // Step 3: Check if the RoomMateMatch already exists for this student
    let roomMate = await RoomMateMatch.findOne({ StudentId });
    
    if (roomMate) {
      // If the RoomMateMatch already exists, update it
      roomMate = await RoomMateMatch.findOneAndUpdate(
        { StudentId },
        { budget, lifestyle, location, hobbies, Hostel }, // Add Hostel to the update
        { new: true }
      );
      return res.status(200).json({ message: "Room Profile Updated successfully", roomMate });
    }

    // Step 4: If the RoomMateMatch doesn't exist, create a new one
    let createRoomMate = await RoomMateMatch.create({
      StudentId,
      budget,
      lifestyle,
      location,
      hobbies,
      Hostel // Add Hostel to the new RoomMate profile
    });

    return res.status(200).json({ message: "Room Profile Created Successfully", createRoomMate });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


export const getManualAttendanceByEmpIdHandler = async (req, res) => {
  const empId = req.params.empId;
  try {
    const manualAttendance = await ManualAttendance.find({ employeeID: empId });
    res.status(200).json(manualAttendance);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// export const markManualAttendanceHandler = async (req, res) => {
//   const {
//     Student,
//     marking_time,
//     latitude,
//     longitude,
//     isManual,
//     suggested_location,
//   } = req.body;

//   try {
//     const attendance = await Attendance.create({
//       employeeID,
//       checkin_time,
//       checkout_time,
//       latitude,
//       longitude,
//       total_hours,
//       isManual,
//       suggested_location,
//     });

//     res
//       .status(200)
//       .json({
//         attendance: attendance,
//         message: "Attendance marked successfully.",
//       });
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// };
