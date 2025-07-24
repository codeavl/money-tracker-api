import Category from "../models/category.model.js";
import Transaction from "../models/transaction.model.js";

/**
 * Create a new category for a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The created category
 */
export const createCategory = async (req, res) => {
    try {
        const { name, type, icon, color } = req.body;

        if (!name || !type) {
            return res.status(400).json({ message: "Name and type are required" });
        }

        if(!["income", "expense"].includes(type)) {
            return res.status(400).json({ message: "Type must be either income or expense" });
        }

        const category = await Category.create({
            userId: req.user._id,
            name,
            type,
            color,
            icon: icon || "default-icon",
            isSystem: false,
        });

        return res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        if(error.code === 11000) {
            return res.status(409).json({ message: "Category already exists" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Get all categories for a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The categories
 */
export const getCategories = async (req, res) => {
    try {
        const { type, search } = req.query;

        const query = { userId: req.user._id, isSystem: false };

        if(type) query.type = type;

        if(search) query.name = { $regex: search, $options: "i" };

        const categories = await Category.find(query).sort({ createdAt: -1 });

        return res.status(200).json({ categories });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Get a category by id for a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The category
 */
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findOne({ _id: id, userId: req.user._id, isSystem: false });

        if(!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({ category });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Update a category by id for a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The updated category
 */
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, icon, color } = req.body;

        const category = await Category.findOne({ _id: id, userId: req.user._id, isSystem: false });

        if(!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if(type && !["income", "expense"].includes(type)) {
            return res.status(400).json({ message: "Type must be either income or expense" });
        }

        category.name = name || category.name;
        category.type = type || category.type;
        category.icon = icon || category.icon;
        category.color = color || category.color;

        await category.save();

        return res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Delete a category by id for a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The deleted category
 */
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findOne({ _id: id, userId: req.user._id, isSystem: false });

        if(!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const transactions = await Transaction.countDocuments({ userId: req.user._id, category: id });
        if(transactions > 0) {
            return res.status(400).json({ message: "Cannot delete category with associated transactions" });
        }
        await Category.deleteOne({ _id: id, userId: req.user._id, isSystem: false });

        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}