import cron from "node-cron"
import Event from "../models/event.js"
import nodemailer from "nodemailer"

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
})

// Function to check for upcoming reminders and send notifications
const checkReminders = async () => {
    try {
        console.log("Checking for reminders...")

        // Get current time
        const now = new Date()

        // Find all events with unsent reminders that are due
        const events = await Event.find({
            "reminders.time": { $lte: now },
            "reminders.sent": false,
        }).populate("user", "email name")

        // Process each event
        for (const event of events) {
            // Get unsent reminders that are due
            const dueReminders = event.reminders.filter((reminder) => reminder.time <= now && !reminder.sent)

            if (dueReminders.length > 0) {
                // Get user email
                const userEmail = event.user.email
                const userName = event.user.name

                // Send email notification
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: userEmail,
                    subject: `Reminder: ${event.name}`,
                    html: `
            <h1>Event Reminder</h1>
            <p>Hello ${userName},</p>
            <p>This is a reminder for your upcoming event:</p>
            <h2>${event.name}</h2>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
            <p><strong>Description:</strong> ${event.description || "No description provided"}</p>
            <p>Thank you for using our Event Reminder System!</p>
          `,
                }

                // Send the email
                try {
                    await transporter.sendMail(mailOptions)
                    console.log(`Reminder sent for event: ${event.name} to ${userEmail}`)

                    // Mark reminders as sent
                    for (const reminder of dueReminders) {
                        reminder.sent = true
                    }

                    // Save the updated event
                    await event.save()
                } catch (error) {
                    console.error(`Failed to send reminder email: ${error.message}`)
                }
            }
        }
    } catch (error) {
        console.error(`Error checking reminders: ${error.message}`)
    }
}

// Start the reminder service
export const startReminderService = () => {
    // Run every minute
    cron.schedule("* * * * *", checkReminders)
    console.log("Reminder service started")
}

