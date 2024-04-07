// Imports Modules
import express from "express"
import database from "./services/database.js"

const router = express()



// GET

router.get("/", async (req, res) => {
    const appointments = await database.getAllAppointments()
    res.status(200).send(appointments)
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    const appointment = await database.getAppointment(id)
    res.status(200).send(appointment)
})



// POST 
router.post("/", async (req, res) => {
    const { title, contents } = req.body
    const appointment = await database.createAppointment(title, contents)
    res.status(201).send(appointment)
})



// ERROR HANDLING
router.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

// Export App
export default router