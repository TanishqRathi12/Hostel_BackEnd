import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRouter from "./routes/user/index.js";
import adminRouter from "./routes/admin/index.js";
import mongoose from "mongoose";
import cron from "node-cron"
import checkAbsentStudentsForToday from "./Service/cron-job.js"
import Student from "./models/Student.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"));

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.post("/hello", (req, res) => {
  return res.send("Hi!");
});

cron.schedule("0 0 * * *", async () => {
  try {
    // Reset the status of all students to "absent"
    await Student.updateMany({}, { status: "absent" });
    console.log("Reset student statuses to 'absent' at 12:00 AM");
  } catch (error) {
    console.error("Error resetting student statuses: ", error);
  }
});

cron.schedule('0 0 * * *', async () => {
  console.log("Running Absent Student Check...");
  try {
      await checkAbsentStudentsForToday();
  } catch (error) {
      console.error("Error during Absent Student check: ", error.message);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
export default app;
