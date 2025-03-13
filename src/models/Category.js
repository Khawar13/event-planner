import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a category name"],
        trim: true,
        maxlength: [50, "Name cannot be more than 50 characters"],
    },
    description: {
        type: String,
        maxlength: [500, "Description cannot be more than 500 characters"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("Category", categorySchema)

