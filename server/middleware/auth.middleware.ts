import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TFunction } from "i18next";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
      };
      t: TFunction;
    }
  }
}

interface JwtPayload {
  id: string;
  name: string;
  iat?: number;
  exp?: number;
}

const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: req.t("unauthorized") });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const { id, name } = decoded;
    req.user = { id, name };
    next();
  } catch (error) {
    res.status(401).json({ message: req.t("unauthorized") });
  }
};

export default authenticationMiddleware;
