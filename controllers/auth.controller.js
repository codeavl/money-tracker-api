import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import Category from '../models/category.model.js';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword, currency: 'INR' });
        await user.save();

        const systemCategories = await Category.find({ isSystem: true });

        const userCategories = systemCategories.map(category => ({
            name: category.name,
            type: category.type,
            icon: category.icon,
            color: category.color,
            userId: user._id,
            isSystem: false,
        }));

        await Category.insertMany(userCategories);

        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, currency: user.currency } });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}