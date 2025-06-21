import { Router } from "express";
import {
  addFund,
  checkBalance,
  checkTransactionHistory,
  payAnotherUser,
} from "../controllers/transaction.controller";
import { authenticate } from "../middleware/auth.middleware";

const transactionRouter = Router();

transactionRouter.route("/fund").post(authenticate, addFund);
transactionRouter.route("/pay").post(authenticate, payAnotherUser);
transactionRouter.route("/bal").get(authenticate, checkBalance);
transactionRouter.route("/stmt").get(authenticate, checkTransactionHistory);

export const transactionRoute = transactionRouter;
