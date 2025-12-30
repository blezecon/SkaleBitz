import { Router } from "express";
import {
  signup,
  signin,
  verifyEmail,
  resendVerification,
  deleteAccount,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";
import authRequired from "../middleware/authRequired.js";

const router = Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/verify", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.delete("/me", authRequired, deleteAccount);

export default router;
