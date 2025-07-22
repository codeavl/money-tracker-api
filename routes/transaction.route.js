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

transactionRouter.post("/", protect, createTransaction);
transactionRouter.get("/", protect, getTransactions);
transactionRouter.get("/:id", protect, getTransactionById);
transactionRouter.put("/:id", protect, updateTransaction);
transactionRouter.delete("/:id", protect, deleteTransaction);

export default transactionRouter;