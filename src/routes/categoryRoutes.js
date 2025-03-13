import express from "express"
import {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/categoryController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

router.route("/").get(protect, getCategories).post(protect, createCategory)

router.route("/:id").get(protect, getCategory).put(protect, updateCategory).delete(protect, deleteCategory)

export default router

