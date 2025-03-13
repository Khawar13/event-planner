import jwt from "jsonwebtoken"
import User from "../models/user.js"

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Check if user exists
        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            })
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        })

        if (user) {
            res.status(201).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token: generateToken(user._id),
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid user data",
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check for user email
        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            })
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            })
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token: generateToken(user._id),
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        if (user) {
            res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            })
        } else {
            res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

