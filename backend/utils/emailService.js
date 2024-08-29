import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendSetupEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: text,
      headers: {
        'X-Priority': '1',
        'Importance': 'High',
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
