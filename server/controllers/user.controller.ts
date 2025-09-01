import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
  };
}

interface LoginRequestBody {
  email?: string;
  password?: string;
}

interface RegisterRequestBody {
  username?: string;
  email?: string;
  password?: string;
}

const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "validation_failed",
      errors: { email: "email_password_required" },
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "validation_failed",
        errors: { email: "invalid_credentials" },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "validation_failed",
        errors: { password: "invalid_credentials" },
      });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      message: "login_successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "server_error",
    });
  }
};

const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
): Promise<Response> => {
  const { username, email, password } = req.body;

  const errors: { username?: string; email?: string; password?: string } = {};

  if (!username || typeof username !== "string") {
    errors.username = "username_required";
  } else if (username.trim().length < 3) {
    errors.username = "username_min";
  }

  if (!email || typeof email !== "string") {
    errors.email = "email_required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "email_invalid";
  }

  if (!password || typeof password !== "string" || password.length < 3) {
    errors.password = "password_min";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "validation_failed",
      errors,
    });
  }

  const trimmedEmail = (email as string).trim();
  const trimmedUsername = (username as string).trim();

  try {
    const existingUser = await User.findOne({
      $or: [{ email: trimmedEmail }, { name: trimmedUsername }],
    });

    if (existingUser) {
      if (existingUser.email === trimmedEmail) {
        return res.status(400).json({
          message: "validation_failed",
          errors: { email: "email_exists" },
        });
      }
      if (existingUser.name === trimmedUsername) {
        return res.status(400).json({
          message: "validation_failed",
          errors: { username: "username_taken" },
        });
      }
    }

    const user = new User({
      name: trimmedUsername,
      email: trimmedEmail,
      password,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      message: "registration_successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "server_error",
    });
  }
};

const dashboard = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  const luckyNumber = Math.floor(Math.random() * 100);

  if (!req.user) {
    return res.status(401).json({ message: "unauthorized" });
  }

  return res.status(200).json({
    message: req.t("welcome_message", { name: req.user.name }),
    secret: req.t("lucky_number", { number: luckyNumber }),
  });
};

const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find({}, "-password");
    return res.status(200).json({
      message: "users_retrieved",
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({
      message: "server_error",
    });
  }
};

export { login, register, dashboard, getAllUsers, AuthRequest };
