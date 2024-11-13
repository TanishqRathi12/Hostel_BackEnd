import Student from "../models/Student.js";

export const toggleStatus = async (studentID) => {

  try {
    const student = await Student.findById(studentID);
    if (student) {
      // Toggle the status between "present" and "absent"
      student.status = student.status === "absent" ? "present" : "absent";
      await student.save();
     return;
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default toggleStatus;



