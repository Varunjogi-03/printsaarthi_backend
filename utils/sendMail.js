import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
});

export const sendMail = async (to, subject, text) => {
  await transporter.sendMail({ from: process.env.EMAIL, to, subject, text });
};
