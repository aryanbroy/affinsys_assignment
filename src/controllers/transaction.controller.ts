import { Request, Response } from "express";
import { CustomRequest } from "../utils/authenticate.util";
import { prisma } from "../lib/prisma";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.util";

export const addFund = async (req: CustomRequest, res: Response) => {
  try {
    const { amt } = req.body;

    const user = req.user;

    if (!user) {
      return sendErrorResponse(res, 401, "Cannot add funds to undefined user");
    }

    user.balance += amt;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        balance: user.balance,
      },
    });

    sendSuccessResponse(res, 200, "Funds added successfully", {
      balance: user.balance,
    });
  } catch (error) {
    sendErrorResponse(
      res,
      500,
      "Internal server error, Error adding funds",
      error
    );
  }
};
