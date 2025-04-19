import express from "express";
import processFile from "../middleware/upload.js";
import { uploadFile } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/upload", processFile.single("file"), uploadFile);

export default router;
