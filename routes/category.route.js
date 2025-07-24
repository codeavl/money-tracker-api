import express from "express";

import { protect } from "../middlewares/auth.middleware.js";
import { 
    createCategory, 
    getCategories, 
    getCategoryById,
    updateCategory, 
    deleteCategory 
} from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.use(protect);

categoryRouter.post("/", createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;