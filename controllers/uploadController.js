import ipfs from "../lib/ipfsClient.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Add this import

// Properly get directory path using fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    // Correctly form the file path using normalized paths
    const filePath = path.resolve(__dirname, "../uploads", req.file.filename);

    console.log("File path:", filePath);

    // Verify file exists before reading
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const result = await ipfs.add(fileBuffer);

    console.log("File uploaded to IPFS:", result.path);

    const metadata = {
      ipfsHash: result.path,
      userId: req.userId,
      timeStamp: Date.now(),
      size: "",
      descrtiptionn: "",
    };

    res.status(200).send({
      message: "File uploaded successfully!",
      filename: req.file.filename,
      ipfsHash: result.path,
    });
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    res.status(500).send(error.message);
  }
};
