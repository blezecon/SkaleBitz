import nodemailer from "nodemailer";
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
} from "../config/constants.js";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE, // false for 587
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendVerificationEmail(to, link) {
  await transporter.sendMail({
    from: MAIL_FROM, // e.g., Fintech <blezecon@gmail.com>
    to,
    subject: "Verify your email",
    html: `<p>Please verify your email by clicking the link below:</p>
           <p><a href="${link}">${link}</a></p>
           <p>This link will expire in 1 hour.</p>`,
  });
}