import express from "express"
import {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    addReminder,
    deleteReminder,
} from "../controllers/eventController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

router.route("/").get(protect, getEvents).post(protect, createEvent)

router.route("/:id").get(protect, getEvent).put(protect, updateEvent).delete(protect, deleteEvent)

router.route("/:id/reminders").post(protect, addReminder)

router.route("/:id/reminders/:reminderId").delete(protect, deleteReminder)

export default router

