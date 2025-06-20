import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.util";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

/* dummy user
{
    "username": "Aryan",
    "password": "aryan1234"
}
*/

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (
      [username, password].some(
        (value) => value === null || value === undefined || value.trim() === ""
      )
    ) {
      return sendErrorResponse(res, 400, "All fields are required", null);
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return sendErrorResponse(res, 400, "User already exists");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return sendSuccessResponse(res, 201, "User registered successfully", user);
  } catch (error) {
    return sendErrorResponse(res, 500, "Something went wrong", error);
  }
};
