import { Router } from "express";
import { addFund, payAnotherUser } from "../controllers/transaction.controller";
import { autheticate } from "../middleware/auth.middleware";

const transactionRouter = Router();

transactionRouter.route("/fund").post(autheticate, addFund);
transactionRouter.route("/pay").post(autheticate, payAnotherUser);

export const transactionRoute = transactionRouter;
