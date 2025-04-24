import "dotenv/config";
import ipfs from "../lib/ipfsClient.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

// derive __dirname in ESM‑style
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load the JSON artifact manually instead of via import/assert
const artifactPath = path.resolve(
  __dirname,
  "../truffle/build/contracts/FileStorage.json"
);
const contractArtifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

const CONTRACT_ADDRESS = contractArtifact.networks["17000"].address;
const ABI = contractArtifact.abi;
const PROVIDER_URL = "https://ethereum-holesky.publicnode.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

export const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  try {
    // 1. Read & upload to IPFS
    const filePath = path.resolve(__dirname, "../uploads", req.file.filename);
    if (!fs.existsSync(filePath))
      throw new Error(`File not found: ${filePath}`);

    const buffer = fs.readFileSync(filePath);
    const { path: ipfsHash } = await ipfs.add(buffer);
    const fileSize = buffer.length;
    const description = req.body.description || "No description";
    const userAddress = req.userId; // ensure this is coming from auth
    const tag = req.body.tag || "default";

    console.log("✅ IPFS upload successful:", ipfsHash);

    // 2. Prepare on‑chain tx
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    console.log("⏳ Sending uploadFile() transaction...");
    const tx = await contract.uploadFile(
      ipfsHash,
      description,
      fileSize,
      userAddress,
      tag
    );
    console.log("📬 Transaction submitted, hash:", tx.hash);

    // 3. Wait for mining & parse receipt
    const receipt = await tx.wait();
    console.log("✅ Transaction mined in block", receipt.blockNumber);
    console.log("   ⚙️ Gas used:", receipt.gasUsed.toString());

    // 4. Parse the FileUploaded event
    const parsedEvents = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .filter((e) => e && e.name === "FileUploaded");

    if (parsedEvents.length) {
      const ev = parsedEvents[0];
      console.log("🎉 FileUploaded event args:", ev.args);
      // ev.args.fileId, ev.args.ipfsHash, ev.args.description, etc.
    } else {
      console.warn("⚠️ No FileUploaded event found in receipt");
    }

    // 5. Respond to client
    res.status(200).json({
      message: "📦 File stored on blockchain!",
      ipfsHash,
      txHash: tx.hash,
      explorer: `https://holesky.etherscan.io/tx/${tx.hash}`,
    });
  } catch (err) {
    console.error("❌ uploadFile error:", err);
    res.status(500).send(err.message);
  }
};

export const getAllFiles = async (_req, res) => {
  try {
    // 1. Setup provider + contract (no signing needed for view funcs)
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    // 2. Call getAllFiles()
    const rawFiles = await contract.getAllFiles();

    // 3. Convert BigInts & return
    const files = rawFiles.map((f) => ({
      fileId: Number(f.fileId), // Add if exists in struct
      ipfsHash: f.ipfsHash,
      description: f.description,
      timestamp: Number(f.timestamp) * 1000,
      uploader: f.uploader,
      size: Number(f.size),
      tag: f.tag, // Add if exists in struct
    }));
    res.json(files);
  } catch (err) {
    console.error("getAllFiles error:", err);
    res.status(500).send(err.message);
  }
};
