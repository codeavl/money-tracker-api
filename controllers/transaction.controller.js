import Transaction from "../models/transaction.model.js";

/**
 * Create a new transaction
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The created transaction
 */
export const createTransaction = async (req, res) => {
    try {
        const { type, amount, category, note, date } = req.body;

        const newTransaction = await Transaction.create({
            userId: req.user.id,
            type,
            amount,
            category,
            note,
            date,
        });

        await newTransaction.save();

        res.status(201).json({ message: "Transaction created successfully", transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Get all transactions for a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The transactions
 */
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });

        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Get a transaction by id for a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The transaction
 */
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Update a transaction by id for a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The updated transaction
 */
export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, amount, category, note, date } = req.body;

        const transaction = await Transaction.findByIdAndUpdate(id, { type, amount, category, note, date }, { new: true });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction updated successfully", transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Delete a transaction by id for a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The deleted transaction
 */
export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findByIdAndDelete(id);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
