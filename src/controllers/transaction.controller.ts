import { Request, Response } from "express";

export const transactionController = async (req: Request, res: Response) => {
  res.send("Transaction controller");
};
