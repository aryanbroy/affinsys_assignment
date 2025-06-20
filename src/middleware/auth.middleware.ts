import { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "../utils/response.util";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const autheticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendErrorResponse(res, 401, "Unauthorized");
  }

  const auth = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const [username, password] = auth;

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!user) {
    return sendErrorResponse(res, 401, "Unauthorized user");
  }

  const hashedPassword = user.password;
  const isPasswordValid = bcrypt.compareSync(password, hashedPassword);

  if (!isPasswordValid) {
    return sendErrorResponse(res, 401, "Invalid authentication header");
  }

  next();
};
