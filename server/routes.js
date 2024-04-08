// Imports Modules
import express from "express"
import database from "./services/database.js"

const router = express()



// GET

router.get("/appointments", async (req, res) => {
    const appointments = await database.getAllAppointments()
    console.log("NO SEARCH")
    res.status(200).send(appointments)
})

router.get("/appointments/:id", async (req, res) => {
    const { id } = req.params
    console.log("SEARCH")
    console.log(id)
    const appointment = await database.getAppointment(id)
    console.log(appointment)
    res.status(200).send(appointment)
})

router.get("/ping" , async (req, res) => {
    const status = await database.pingDatabases()
    res.status(200).send(status)
})



// POST 
router.post("/", async (req, res) => {
    const { title, contents } = req.body
    const appointment = await database.createAppointment(title, contents)
    res.status(201).send(appointment)
})




// UPDATE



// ERROR HANDLING
router.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

// Export App
export default router