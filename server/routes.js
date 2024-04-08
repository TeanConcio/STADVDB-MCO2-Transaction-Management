// Imports Modules
import express from "express"
import database from "./services/database.js"

const router = express()



// TEST
router.get("/test", async (req, res) => {
    const test = await database.test()
    console.log("test")
    res.status(200).send(test)
})



// GET

router.get("/appointments", async (req, res) => {
    const appointments = await database.getAllAppointments()
    res.status(200).send(appointments)
})

router.get("/appointments/:apt_id", async (req, res) => {
    const appointment = await database.getAppointment(req.params.apt_id)
    res.status(200).send(appointment)
})

router.get("/ping" , async (req, res) => {
    const status = await database.pingDatabases()
    res.status(200).send(status)
})



// POST 
router.post("/appointments", async (req, res) => {
    const appointment = await database.createAppointment(req.body)
    res.status(200).send(appointment)
})




// UPDATE
router.patch("/appointments/:apt_id", async (req, res) => {
    req.body.apt_id = parseInt(req.params.apt_id)
    const appointment = await database.updateAppointment(req.body)
    res.status(200).send(appointment)
})



// DELETE
router.delete("/appointments/:apt_id", async (req, res) => {
    const appointment = await database.deleteAppointment(parseInt(req.params.apt_id))
    res.status(200).send(appointment)
})



// ERROR HANDLING
router.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

// Export App
export default router