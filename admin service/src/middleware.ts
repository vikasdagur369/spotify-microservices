import { NextFunction, Request, Response } from "express";

import axios from "axios";

import dotenv from "dotenv";

dotenv.config();

interface Iuser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  playlist: string[];
}

interface authenticatedRequested extends Request {
  user: Iuser | null;
}

export const isAuth = async (
  req: authenticatedRequested,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      res.status(403).json({ message: "please login !" });
      return;
    }

    const { data } = await axios.get(`${process.env.User_URL}/api/user/v1/me`, {
      headers: { token },
    });

    req.user = data;

    next();
    
  } catch (error) {
    res.status(403).json({ message: "please login !" });
  }
};
