// Imports Modules
import express from "express"
import database from "./services/database.js"
import testdb from "./services/test_db.js"

// What is this???
//import { rotateAndSkewTextRadiansAndTranslate } from "pdf-lib"

const router = express()



// TEST
router.get("/test", async (req, res) => {
    const test = await database.test()
    console.log("test")
    res.status(200).send(test)
})

router.get("/readtest", async (req, res) => {
    const test = await testdb.test_TwoReads()
    res.status(200).send(test)
})

router.get("/updatetest", async (req, res) => {
    const test = await testdb.test_UpdateintoRead();
    res.status(200).send(test)
})

router.get("/doubleupdatetest", async (req, res) => {
    const test = await testdb.test_TwoUpdates();
    res.status(200).send(test)
})

router.get("/loginsert", async (req, res) => {
    const test = await testdb.test_TwoInsertions();
    res.status(200).send(test)
})



// GET
router.get("/ping" , async (req, res) => {
    const status = await database.pingDatabases()
    res.status(200).send(status)
})

router.get("/reports/:sleep", async (req, res) => {
    const reports = await database.getReports(req.params.sleep)
    res.status(200).send(reports)
})

router.get("/appointments/:apt_id/:sleep", async (req, res) => {
    const appointment = await database.getAppointment(req.params.apt_id, req.params.sleep)
    res.status(200).send(appointment)
})

router.get("/appointments/:sleep", async (req, res) => {
    const appointments = await database.getAllAppointments(req.params.sleep)
    res.status(200).send(appointments)
})

router.get("/unlock", async (req, res) => {
    const unlock = await database.unlockTables()
    res.status(200)
})



// POST 
router.post("/appointments/search/:sleep", async (req, res) => {
    const appointments = await database.searchAppointments(req.body, req.params.sleep)
    res.status(200).send(appointments)
})

router.post("/appointments/:sleep", async (req, res) => {
    const appointment = await database.createAppointment(req.body, req.params.sleep)
    res.status(200).send(appointment)
})




// UPDATE
router.patch("/appointments/:apt_id/:sleep", async (req, res) => {
    req.body.apt_id = parseInt(req.params.apt_id)
    const appointment = await database.updateAppointment(req.body, req.params.sleep)
    res.status(200).send(appointment)
})



// DELETE
router.delete("/appointments/:apt_id/:sleep", async (req, res) => {
    const appointment = await database.deleteAppointment(parseInt(req.params.apt_id), req.params.sleep)
    res.status(200).send(appointment)
})



// ERROR HANDLING
router.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

// Export App
export default router