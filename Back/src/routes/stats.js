import { Router } from "express";
import { getOverviewStats, getInvestorDashboard } from "../controllers/statsController.js";
import authRequired from "../middleware/authRequired.js";

const router = Router();

router.get("/overview", getOverviewStats);
router.get("/investor-dashboard", authRequired, getInvestorDashboard);

export default router;