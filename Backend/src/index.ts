import express from "express";
import path from "path";
import userRoute from "./routes/user.routes";
import authRoute from "./routes/auth.routes";
import documentsRoute from "./routes/documents.routes";
import otpRoute from "./routes/otp.routes";
import tokenRoute from "./routes/token.routes";

import cors from "cors";
import { fileURLToPath } from "url";

const app = express();
const port = 8080;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use((req, res, next) => {
  console.log("tesst.....");
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api", userRoute);
app.use("/api", authRoute);
app.use("/api", documentsRoute);
app.use("/api", otpRoute);
app.use("/api", tokenRoute);

app.listen(port, () => {
  console.log(`[server]: Server running at http://localhost:${port}`);
});

//cold start
app.get("/ping", async (req, res) => {
  res.status(200).json({ message: "pong" });
});
