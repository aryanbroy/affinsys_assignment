import { NextFunction, request, Request, Response } from "express";
import { sendErrorResponse } from "../utils/response.util";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { CustomRequest } from "../utils/authenticate.util";

export const autheticate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendErrorResponse(res, 401, "Invalid auth header");
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

    req.user = user;
    next();
  } catch (error) {
    sendErrorResponse(
      res,
      500,
      "Internal server error, Error authenticating",
      error
    );
  }
};
