import { Router } from "express";
import authRequired from "../middleware/authRequired.js";
import { createDeal, getDeal, investInDeal, listDeals } from "../controllers/dealsController.js";

const router = Router();

router.get("/", authRequired, listDeals);
router.get("/:id", authRequired, getDeal);
router.post("/:id/invest", authRequired, investInDeal);
router.post("/", authRequired, createDeal);

export default router;