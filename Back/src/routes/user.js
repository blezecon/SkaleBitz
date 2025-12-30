import { Router } from "express";
import authRequired from "../middleware/authRequired.js";
import { getProfile, updateProfile, verifyEmailChange } from "../controllers/userController.js";

const router = Router();

router.get("/me", authRequired, getProfile);
router.put("/me", authRequired, updateProfile);
router.get("/verify-email-change", verifyEmailChange);

export default router;