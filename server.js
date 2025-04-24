import express from "express";
import cors from "cors";
import router from "./routes/uploadRoute.js";

const app = express();

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "https://slicevault.vercel.app"],
    credentials: true,
  })
);

// Basic test route
app.get("/", (req, res) => {
  res.send("Slice Backend is running");
});

app.use(router);

// ✅ Use env PORT or fallback to 3002
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Slice Backend running on http://localhost:${PORT}`);
});
