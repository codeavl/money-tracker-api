import mongoose from "mongoose";
import dotenv from "dotenv";

import Category from "../models/category.model.js";

dotenv.config();

const systemCategories = [
    { name: 'Salary', type: 'income', icon: 'briefcase', isSystem: true },
    { name: 'Business', type: 'income', icon: 'building', isSystem: true },
    { name: 'Food', type: 'expense', icon: 'utensils', isSystem: true },
    { name: 'Shopping', type: 'expense', icon: 'shopping-cart', isSystem: true },
    { name: 'Rent', type: 'expense', icon: 'home', isSystem: true },
    { name: 'Investment', type: 'income', icon: 'chart-line', isSystem: true },
];

const seedSystemCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Category.deleteMany({ isSystem: true });
        await Category.insertMany(systemCategories);
        console.log('✅ System categories seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}

seedSystemCategories();