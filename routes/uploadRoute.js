import express from "express";
import processFile from "../middleware/upload.js";
import { uploadFile, getAllFiles } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/upload", processFile.single("file"), uploadFile);
router.get("/files", getAllFiles);
export default router;
