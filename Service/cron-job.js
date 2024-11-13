import Student from '../models/Student.js';
import sendAbsenceNotification from './mail.js';

export const checkAbsentStudentsForToday = async () => {
    try {
        const today = new Date();
       
        const startOfWindow = new Date(today.setHours(20, 0, 0, 0)); // 8:00 PM
        const endOfWindow = new Date(today.setHours(21, 0, 0, 0)); // 9:00 PM

        //students who are absent today between 8:00 PM and 9:00 PM or don't have an attendance record for today
        const absentStudents = await Student.find({
            $or: [
                { status: { $not: { $elemMatch: { date: { $gte: startOfWindow, $lt: endOfWindow }, status: 'present' } } } }
            ]
        });

        for (const student of absentStudents) {
            // Send absence notification to the parent's email
            if (student.email) {
                await sendAbsenceNotification(student.email, student.name, student.Hostel,today);
            }
        }

        console.log("Checked for absent students and sent notifications.");
    } catch (error) {
        console.error("Error checking absent students: ", error);
    }
};

export default checkAbsentStudentsForToday;
