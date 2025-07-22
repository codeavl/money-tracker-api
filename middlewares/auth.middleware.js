import jwt from "jsonwebtoken";

/**
 * Protect routes
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 * @returns {Object} - The user
 */
export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}