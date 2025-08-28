import { Router } from "express";
import { register, login, dashboard, getAllUsers } from "../controllers/user.controller";
import authenticationMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/dashboard", authenticationMiddleware, dashboard);
router.get("/users", getAllUsers);

export default router;
