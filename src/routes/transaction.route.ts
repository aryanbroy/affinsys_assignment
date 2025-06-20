import { Router } from "express";
import { addFund } from "../controllers/transaction.controller";
import { autheticate } from "../middleware/auth.middleware";

const transactionRouter = Router();

transactionRouter.route("/fund").post(autheticate, addFund);

export const transactionRoute = transactionRouter;
