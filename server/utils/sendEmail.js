const nodemailer = require("nodemailer");

const sendEnrollmentEmail = async (toEmail, courseName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Enrollment Successful",
      html: `<p>Hi there,</p>
             <p>You have successfully enrolled in <strong>${courseName}</strong>.</p>
             <p>Happy Learning!</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = sendEnrollmentEmail;
