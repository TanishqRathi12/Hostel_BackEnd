import express from "express";
const router = express.Router();
import {
  signinHandler,
  signupHandler,
  joinHostelHandler,
  getAttendanceByStIdHandler,
  markAttendanceHandler,
  postFeedbackHandler,
  CreateRoomMateProfile,
  //getManualAttendanceByEmpIdHandler,
  //markManualAttendanceHandler
} from "../../controllers/User.js";

router.post("/signin", signinHandler);
router.post("/signup", signupHandler);
router.post("/joinHostel", joinHostelHandler);
router.post("/feedback/:stId", postFeedbackHandler )
router.get("/getAttendanceByStId/:stId", getAttendanceByStIdHandler);
router.post("/markAttendance", markAttendanceHandler);
router.post("/CreateRoomMate",CreateRoomMateProfile)
//router.get("/getManualAttendanceByEmpId/:empId", getManualAttendanceByEmpIdHandler);
//router.post("/markManualAttendance", markManualAttendanceHandler)

export default router;
