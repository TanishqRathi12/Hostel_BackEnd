import express from "express";
const router = express.Router();
import {
  signinHandler,
  signupHandler,
  addHostelHandler,
  getHostelsByAdminIdHandler,
  getStudentByHostelIdHandler,
  getAttendanceByStIdHandler,
  getFeedBackByHostelIdHandler,
  getManualAttendanceByStIdHandler,
} from "../../controllers/admin.js";

router.post("/signin", signinHandler);
router.post("/signup", signupHandler);
router.post("/addHostel", addHostelHandler);
router.get("/getHostelsByAdminId/:adminId", getHostelsByAdminIdHandler);
router.get("/getStudentByHostelId/:HostelId", getStudentByHostelIdHandler);
router.get("/getAttendanceByStId/:StId", getAttendanceByStIdHandler);
router.get("/getFeedBackByHostelId/:HostelId",getFeedBackByHostelIdHandler)
//router.get("/getManualAttendanceByStId/:StId", getManualAttendanceByStIdHandler);

export default router;
