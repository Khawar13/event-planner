import Event from "../models/event.js"
import Category from "../models/Category.js"

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
    try {
        const { name, description, date, category, reminders } = req.body

        // Check if category exists and belongs to user
        const categoryExists = await Category.findOne({
            _id: category,
            user: req.user._id,
        })

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found or not authorized",
            })
        }

        // Create event
        const event = await Event.create({
            name,
            description,
            date,
            category,
            user: req.user._id,
            reminders: reminders || [],
        })

        res.status(201).json({
            success: true,
            data: event,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// @desc    Get all events for a user
// @route   GET /api/events
// @access  Private
export const getEvents = async (req, res) => {
    try {
        const { sort, category } = req.query

        // Build query
        const query = { user: req.user._id }

        // Add category filter if provided
        if (category) {
            query.category = category
        }

        // Build sort options
        let sortOptions = {}

        if (sort === "date") {
            sortOptions = { date: 1 } // Ascending by date
        } else if (sort === "category") {
            sortOptions = { category: 1 } // Ascending by category
        } else if (sort === "reminders") {
            // This will sort by events with upcoming reminders first
            sortOptions = { "reminders.time": 1 }
        } else {
            // Default sort by date
            sortOptions = { date: 1 }
        }

        const events = await Event.find(query).sort(sortOptions).populate("category", "name")

        res.status(200).json({
            success: true,
            count: events.length,
            data: events,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
export const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("category", "name")

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            })
        }

        // Make sure user owns the event
        if (event.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this event",
            })
        }

        res.status(200).json({
            success: true,
            data: event,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id)

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            })
        }

        // Make sure user owns the event
        if (event.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to update this event",
            })
        }

        // If category is being updated, check if it exists and belongs to user
        if (req.body.category) {
            const categoryExists = await Category.findOne({
                _id: req.body.category,
                user: req.user._id,
            })

            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found or not authorized",
                })
            }
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate("category", "name")

        res.status(200).json({
            success: true,
            data: event,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            })
        }

        // Make sure user owns the event
        if (event.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to delete this event",
            })
        }

        await event.deleteOne()

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

// @desc    Add reminder to event
// @route   POST /api/events/:id/reminders
// @access  Private
export const addReminder = async (req, res) => {
    try {
        const { time } = req.body

        if (!time) {
            return res.status(400).json({
                success: false,
                message: "Please provide a reminder time",
            })
        }

        const event = await Event.findById(req.params.id)

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            })
        }

        // Make sure user owns the event
        if (event.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to update this event",
            })
        }

        // Add reminder
        event.reminders.push({ time, sent: false })
        await event.save()

        res.status(200).json({
            success: true,
            data: event,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// @desc    Delete reminder from event
// @route   DELETE /api/events/:id/reminders/:reminderId
// @access  Private
export const deleteReminder = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            })
        }

        // Make sure user owns the event
        if (event.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to update this event",
            })
        }

        // Remove reminder
        event.reminders = event.reminders.filter((reminder) => reminder._id.toString() !== req.params.reminderId)

        await event.save()

        res.status(200).json({
            success: true,
            data: event,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

