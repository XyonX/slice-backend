import express from "express"; // ✅ default import
import cors from "cors"; // ✅ import cors
import router from "./routes/uploadRoute.js";

const app = express(); // ✅ lowercase 'express()' is the function
// ✅ enable CORS for requests from localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(router);

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
