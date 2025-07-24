import express from "express";

import { protect } from "../middlewares/auth.middleware.js";
import { 
    createTransaction, 
    getTransactions, 
    getTransactionById, 
    updateTransaction, 
    deleteTransaction 
} from "../controllers/transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.use(protect);

transactionRouter.post("/", createTransaction);
transactionRouter.get("/", getTransactions);
transactionRouter.get("/:id", getTransactionById);
transactionRouter.put("/:id", updateTransaction);
transactionRouter.delete("/:id", deleteTransaction);

export default transactionRouter;