import nodemailer from 'nodemailer'
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Function to send an absence notification to a student's parent
const sendAbsenceNotification = async (email, studentName, hostelName, absenceDate) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `🚨 Alert: Your child ${studentName} is absent from ${hostelName}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <table style="width: 100%; max-width: 600px; margin: auto; border-collapse: collapse; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <thead>
                        <tr style="background-color: #ff6b6b; color: #fff;">
                            <th style="padding: 20px; text-align: center;">⏳ Absence Notification</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 20px;">
                                <h3 style="color: #ff6b6b; text-align: center;">Notice of Absence</h3>
                                <p>Dear Parent/Guardian,</p>
                                <p>We would like to inform you that your child <strong>${studentName}</strong> was marked absent from <strong>${hostelName}</strong> on <strong>${absenceDate}</strong>. Please reach out if you are aware of this absence or need more information.</p>
                                <div style="text-align: center; margin-top: 20px;">
                                    <p style="color: #555;">For any inquiries, please contact us at the provided contact information or manage your notifications through the school's portal.</p>
                                </div>
                                <p style="font-size: 0.9em; margin-top: 20px;">This is an important notification to keep you informed about your child's status and safety. We appreciate your attention to this matter.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f9f9f9; padding: 20px; text-align: center;">
                                <p style="font-size: 0.85em; color: #777;">If you have any questions, feel free to <a href="${process.env.CONTACT}/contact" style="color: #007bff; text-decoration: none;">contact us</a>.</p>
                                <p style="font-size: 0.85em; color: #777;">Best regards,<br><strong>The Hostel Management Team</strong></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p style="text-align: center; font-size: 0.75em; color: #aaa; margin-top: 20px;">This is an automated message. Please do not reply to this email.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${parentEmail}: ${info.response}`);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error.message);
        throw error;
    }
};

export default sendAbsenceNotification;
