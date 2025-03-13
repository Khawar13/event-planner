import Category from "../models/Category.js"

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body

        // Create category
        const category = await Category.create({
            name,
            description,
            user: req.user._id,
        })

        res.status(201).json({
            success: true,
            data: category,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// @desc    Get all categories for a user
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user._id })

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
export const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            })
        }

        // Make sure user owns the category
        if (category.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this category",
            })
        }

        res.status(200).json({
            success: true,
            data: category,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id)

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            })
        }

        // Make sure user owns the category
        if (category.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to update this category",
            })
        }

        category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })

        res.status(200).json({
            success: true,
            data: category,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            })
        }

        // Make sure user owns the category
        if (category.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to delete this category",
            })
        }

        await category.deleteOne()

        res.status(200).json({
            success: true,
            data: {},
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

