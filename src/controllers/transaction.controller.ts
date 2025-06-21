import { Response } from "express";
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

export const payAnotherUser = async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendErrorResponse(res, 400, "Unauthorized to pay another user");
  }

  const { to, amt } = req.body;

  if (!to || !amt || typeof amt !== "number" || amt <= 0) {
    return sendErrorResponse(res, 400, "All fields must be valid");
  }

  if (to === req.user.username) {
    return sendErrorResponse(res, 400, "Cannot pay yourself");
  }

  const sender = req.user;
  if (sender.balance < amt) {
    return sendErrorResponse(res, 400, "Insufficient balance");
  }

  const receiver = await prisma.user.findFirst({
    where: {
      username: to,
    },
  });
  if (!receiver) {
    return sendErrorResponse(res, 400, "Receiver not found");
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const updatedSender = await tx.user.update({
        where: {
          id: sender.id,
        },
        data: {
          balance: {
            decrement: amt,
          },
        },
      });
      if (updatedSender.balance < 0) {
        throw new Error("Insufficient balance");
      }

      await tx.user.update({
        where: {
          id: receiver.id,
        },
        data: {
          balance: {
            increment: amt,
          },
        },
      });

      await tx.transaction.create({
        data: {
          kind: "PAYMENT",
          amt,
          updated_bal: updatedSender.balance,
          senderId: sender.id,
          toUserId: receiver.id,
        },
      });

      return updatedSender.balance;
    });

    sendSuccessResponse(res, 200, "Payment made successfully", {
      balance: updated,
    });
  } catch (error) {
    console.log("Transaction error: ", error);
    sendErrorResponse(
      res,
      500,
      "Internal server error, Error making payment",
      error
    );
  }
};

export const checkBalance = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendErrorResponse(res, 400, "Unauthorized to check balance");
    }

    let { currency } = req.query;

    if (!currency) {
      currency = "INR";
    }

    let balance = req.user.balance;

    if (currency !== "INR") {
      // perform api operations here
    }

    sendSuccessResponse(res, 200, "Balance successfully checked", {
      balance,
      currency,
    });
  } catch (error) {
    sendErrorResponse(
      res,
      500,
      "Internal server error, Error checking balance",
      error
    );
  }
};

export const checkTransactionHistory = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return sendErrorResponse(
        res,
        400,
        "Unauthorized to check transaction history"
      );
    }

    const senderId = req.user.id;
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            senderId,
          },
          {
            toUserId: senderId,
          },
        ],
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    sendSuccessResponse(res, 200, "Transaction history successfully checked", {
      data: transactions,
    });
  } catch (error) {
    sendErrorResponse(
      res,
      500,
      "Internal server error, Error checking transaction history",
      error
    );
  }
};