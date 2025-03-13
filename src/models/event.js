import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add an event name"],
        trim: true,
        maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
        type: String,
        maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    date: {
        type: Date,
        required: [true, "Please add an event date"],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Please select a category"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reminders: [
        {
            time: {
                type: Date,
                required: true,
            },
            sent: {
                type: Boolean,
                default: false,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("Event", eventSchema)

