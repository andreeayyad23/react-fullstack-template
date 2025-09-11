import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/mongoose.config";
import authRoutes from "./routes/auth.route";
import familyRoutes from "./routes/family.route";
import i18n from "./config/i18n";
import middleware from "i18next-http-middleware";

dotenv.config();

export const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(middleware.handle(i18n));
app.use(express.urlencoded({ extended: true }));

// Mount all auth routes under /api/v1/auth
app.use("/api/v1/auth", authRoutes);

// Mount all family routes under /api/v1/family  <-- Add this
app.use("/api/v1/family", familyRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    message: req.t("server_running"),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: req.t ? req.t("route_not_found") : "Route not found"
  });
});


app.listen(port, () => console.log(`Server listening on port ${port}`));