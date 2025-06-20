import { Router } from "express";
import { transactionController } from "../controllers/transaction.controller";
import { autheticate } from "../middleware/auth.middleware";

const transactionRouter = Router();

transactionRouter.route("/fund").post(autheticate, transactionController);

export const transactionRoute = transactionRouter;
