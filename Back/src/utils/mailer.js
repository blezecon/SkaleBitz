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

export async function sendEmailChangeVerification(currentEmail, nextEmail, link) {
  const message = {
    from: MAIL_FROM,
    subject: "Confirm your email change",
    html: `<p>We received a request to change your email.</p>
           <p>Click the link below to confirm the change:</p>
           <p><a href="${link}">${link}</a></p>
           <p>If you didn't request this, please ignore.</p>`,
  };

  // Notify both current and next email for security
  await Promise.all([
    transporter.sendMail({ ...message, to: currentEmail }),
    transporter.sendMail({ ...message, to: nextEmail }),
  ]);
}

export async function sendPasswordResetEmail(to, link) {
  await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject: "Reset your password",
    html: `<p>You requested to reset your password.</p>
           <p>Use the secure link below to set a new password:</p>
           <p><a href="${link}">${link}</a></p>
           <p>This link will expire in 1 hour. If you didn't request this, you can ignore this email.</p>`,
  });
}