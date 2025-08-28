import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/mongoose.config";
import authRoutes from "./routes/auth.route";
import i18n from "./config/i18n";
import middleware from "i18next-http-middleware";
dotenv.config();
export const app: Application = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(middleware.handle(i18n));
app.use(express.urlencoded({ extended: true }));

// Mount all auth routes under /api/v1/auth
app.use("/api/v1/auth", authRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ message: req.t("server_running") });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));