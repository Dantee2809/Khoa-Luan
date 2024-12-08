import express from "express";
import {
  addAdv,
  deleteAdv,
  getAdv,
  updateAdv,
} from "../Controllers/AdvController.js";

const router = express.Router();

router.get("/", getAdv);
router.post("/", addAdv);
router.put("/:id", updateAdv);
router.delete("/:id", deleteAdv);

export default router;
