import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/airoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

//Database connection
await connectDB()


app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin(origin, callback) {
    const isVercelOrigin = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin || "");
    const isLocalOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/i.test(origin || "");
    if (!origin || allowedOrigins.includes(origin) || isVercelOrigin || isLocalOrigin) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.get("/", (req, res) => res.send("Server is Live....."));
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    aiConfigured: Boolean(process.env.OPENAI_API_KEY),
    dbConfigured: Boolean(process.env.MONGODB_URI),
  });
});
app.use("/api/users", userRouter);
app.use('/api/resumes',resumeRouter);
app.use('/api/ai',aiRouter)



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
