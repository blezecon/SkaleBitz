import { Router } from "express";
import { signup, signin, verifyEmail, resendVerification } from "../controllers/authController.js";

const router = Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/verify", verifyEmail);
router.post("/resend-verification", resendVerification);

export default router;