import mysql from 'mysql2'

// Import Database Connections
import {
    central_db,
    luzon_db,
    vismin_db,
    beginTransaction,
    endTransaction
} from './db_connections.js'
import database from "./database.js"


// Please check function I made below

// async function dbReplication(listOfUpdates) {
//     //iterate over the listOfUpdates
//     for (let index = 0; index < listOfUpdates.length; index++) {
//         //iterate over the arrays inside and do an execute statement
//         //Steps:
//         //- Get the operation
//         //- Apply the operation
//     }
// }



//Replication Functions
export async function replicateDatabases(listOfDBs = ["central_db", "luzon_db", "vismin_db"]) {

    // Ping the related databases
    const serverStatuses = await database.pingDatabases(listOfDBs);

    console.log(`Server statuses: ${JSON.stringify(serverStatuses)}`)

    console.log(`Replicating databases: ${listOfDBs}`)

    var rows = []

    // If the list of databases includes central_db
    if (listOfDBs.includes("central_db")) {

        // If the list of databases includes luzon_db
        if (listOfDBs.includes("luzon_db")){

            console.log('Checking central_db and luzon_db for logs')

            // If both central_db and luzon_db are online
            if (serverStatuses.central_db_status && 
                serverStatuses.luzon_db_status) {

                try {
                    await beginTransaction(central_db, "READ COMMITTED");
                    await beginTransaction(luzon_db, "READ COMMITTED");

                    // Get the latest log_id from both databases
                    [rows] = await central_db.execute(`
                        SELECT log_id
                        FROM luzon_log
                        ORDER BY log_id DESC
                        LIMIT 1;
                    `);
                    var central_vm_log_id;
                    if (rows.length === 0) {
                        central_vm_log_id = 0;
                    } else {
                        central_vm_log_id = rows[0].log_id;
                    }
                    [rows] = await luzon_db.execute(`
                        SELECT log_id
                        FROM luzon_log
                        ORDER BY log_id DESC
                        LIMIT 1;
                    `);
                    var luzon_vm_log_id;
                    if (rows.length === 0) {
                        luzon_vm_log_id = 0;
                    } else {
                        luzon_vm_log_id = rows[0].log_id;
                    }

                    await endTransaction(central_db, "COMMIT");
                    await endTransaction(luzon_db, "COMMIT");
                }
                catch (error) {
                    // End transactions
                    await endTransaction(central_db, "ROLLBACK");
                    await endTransaction(luzon_db, "ROLLBACK");
                    console.log(error)
                    return console.log('ERROR: logs are not successfully applied.')
                }

                // If the latest log_id from both databases are not the same
                if (luzon_vm_log_id !== central_vm_log_id) {

                    try {

                        // Lock the tables
                        await central_db.query(`LOCK TABLES appointments WRITE, luzon_log WRITE, vismin_log WRITE;`);
                        await luzon_db.query(`LOCK TABLES appointments WRITE, luzon_log WRITE;`);
                        // Begin transactions
                        await beginTransaction(central_db, "SERIALIZABLE");
                        await beginTransaction(luzon_db, "SERIALIZABLE");

                        // Check which database has the latest log_id
                        var updated_db;
                        var updated_log_id;
                        var outdated_db;
                        var outdated_log_id;
                        if (luzon_vm_log_id > central_vm_log_id) {
                            console.log(`central_db (${central_vm_log_id}) is behind luzon_db(${luzon_vm_log_id})`)
                            updated_db = luzon_db;
                            updated_log_id = luzon_vm_log_id;
                            outdated_db = central_db;
                            outdated_log_id = central_vm_log_id;
                        }
                        else {
                            console.log(`luzon_db (${luzon_vm_log_id}) is behind central_db(${central_vm_log_id})`)
                            updated_db = central_db;
                            updated_log_id = central_vm_log_id;
                            outdated_db = luzon_db;
                            outdated_log_id = luzon_vm_log_id;
                        }
                            
                        // Copy the logs from updated_db that are not in outdated_db
                        console.log(`Copying ${updated_log_id - outdated_log_id} logs`)
                        const last_log_id = await copyLogToLog(updated_db, updated_log_id, outdated_db, outdated_log_id, "luzon");

                        // If logs are not successfully copied
                        if (last_log_id.error) {
                            console.log('ERROR: logs are not successfully copied.')
                            // End transactions
                            await endTransaction(central_db, "ROLLBACK");
                            await endTransaction(luzon_db, "ROLLBACK");
                            // Unlocks the tables
                            await central_db.query(`UNLOCK TABLES;`);
                            await luzon_db.query(`UNLOCK TABLES;`);
                            return { error: last_log_id.error }
                        }

                        // Apply the logs to the appointments table in central_db
                        console.log(`Applying logs from ${outdated_log_id + 1} to ${last_log_id}`)
                        for (let log_id = outdated_log_id + 1; log_id <= last_log_id; log_id++) {
                            const appointment = await applyLogToAppointments(outdated_db, log_id, "luzon");

                            // If logs are not successfully applied
                            if (appointment.error) {
                                console.log('ERROR: logs are not successfully applied.')
                                // End transactions
                                await endTransaction(central_db, "ROLLBACK");
                                await endTransaction(luzon_db, "ROLLBACK");
                                // Unlocks the tables
                                await central_db.query(`UNLOCK TABLES;`);
                                await luzon_db.query(`UNLOCK TABLES;`);
                                return { error: appointment.error }
                            }
                        }

                        // Get the latest log_id from both databases
                        [rows] = await central_db.execute(`
                            SELECT log_id
                            FROM luzon_log
                            ORDER BY log_id DESC
                            LIMIT 1;
                        `);
                        var central_vm_log_id;
                        if (rows.length === 0) {
                            central_vm_log_id = 0;
                        } else {
                            central_vm_log_id = rows[0].log_id;
                        }
                        [rows] = await luzon_db.execute(`
                            SELECT log_id
                            FROM luzon_log
                            ORDER BY log_id DESC
                            LIMIT 1;
                        `);
                        var luzon_vm_log_id;
                        if (rows.length === 0) {
                            luzon_vm_log_id = 0;
                        } else {
                            luzon_vm_log_id = rows[0].log_id;
                        }

                        // If the latest log_id from both databases are not the same
                        if (luzon_vm_log_id !== central_vm_log_id) {
                            // End transactions
                            await endTransaction(central_db, "ROLLBACK");
                            await endTransaction(luzon_db, "ROLLBACK");
                            // Unlocks the tables
                            await central_db.query(`UNLOCK TABLES;`);
                            await luzon_db.query(`UNLOCK TABLES;`);
                            return console.log('ERROR: logs are not successfully applied.')
                        }

                        // End transactions
                        await endTransaction(central_db, "COMMIT");
                        await endTransaction(luzon_db, "COMMIT");
                        // Unlocks the tables
                        await central_db.query(`UNLOCK TABLES;`);
                        await luzon_db.query(`UNLOCK TABLES;`);

                        console.log('VisMin Replication successful.')
                    }
                    catch (error) {
                        // End transactions
                        await endTransaction(central_db, "ROLLBACK");
                        await endTransaction(luzon_db, "ROLLBACK");
                        // Unlocks the tables
                        await central_db.query(`UNLOCK TABLES;`);
                        await luzon_db.query(`UNLOCK TABLES;`);
                        console.log(error)
                        return console.log('ERROR: logs are not successfully applied.')
                    }
                } 
                else {
                    console.log('SYNCHRONIZED DATABASES: central_db and luzon_db have the latest logs.')
                }
            } else {
                //only one is online
                console.log('UNAVAILABLE CASE: One of the databases is currently unavailable. Cannot perform synchronization.')
            }
        }
        
        // If the list of databases includes vismin_db
        if (listOfDBs.includes("vismin_db")){

            console.log('Checking central_db and vismin_db for logs')
            
            // If both central_db and vismin_db are online
            if (serverStatuses.central_db_status && 
                serverStatuses.vismin_db_status) {

                try {
                    await beginTransaction(central_db, "READ COMMITTED");
                    await beginTransaction(vismin_db, "READ COMMITTED");

                    // Get the latest log_id from both databases
                    [rows] = await central_db.execute(`
                        SELECT log_id
                        FROM vismin_log
                        ORDER BY log_id DESC
                        LIMIT 1;
                    `);
                    var central_vm_log_id;
                    if (rows.length === 0) {
                        central_vm_log_id = 0;
                    } else {
                        central_vm_log_id = rows[0].log_id;
                    }
                    [rows] = await vismin_db.execute(`
                        SELECT log_id
                        FROM vismin_log
                        ORDER BY log_id DESC
                        LIMIT 1;
                    `);
                    var vismin_vm_log_id;
                    if (rows.length === 0) {
                        vismin_vm_log_id = 0;
                    } else {
                        vismin_vm_log_id = rows[0].log_id;
                    }

                    await endTransaction(central_db, "COMMIT");
                    await endTransaction(vismin_db, "COMMIT");
                }
                catch (error) {
                    // End transactions
                    await endTransaction(central_db, "ROLLBACK");
                    await endTransaction(vismin_db, "ROLLBACK");
                    console.log(error)
                    return console.log('ERROR: logs are not successfully applied.')
                }

                // If the latest log_id from both databases are not the same
                if (vismin_vm_log_id !== central_vm_log_id) {

                    try {

                        // Lock the tables
                        await central_db.query(`LOCK TABLES appointments WRITE, luzon_log WRITE, vismin_log WRITE;`);
                        await vismin_db.query(`LOCK TABLES appointments WRITE, vismin_log WRITE;`);
                        // Begin transactions
                        await beginTransaction(central_db, "SERIALIZABLE");
                        await beginTransaction(vismin_db, "SERIALIZABLE");

                        // Check which database has the latest log_id
                        var updated_db;
                        var updated_log_id;
                        var outdated_db;
                        var outdated_log_id;
                        if (vismin_vm_log_id > central_vm_log_id) {
                            console.log(`central_db (${central_vm_log_id}) is behind vismin_db(${vismin_vm_log_id})`)
                            updated_db = vismin_db;
                            updated_log_id = vismin_vm_log_id;
                            outdated_db = central_db;
                            outdated_log_id = central_vm_log_id;
                        }
                        else {
                            console.log(`vismin_db (${vismin_vm_log_id}) is behind central_db(${central_vm_log_id})`)
                            updated_db = central_db;
                            updated_log_id = central_vm_log_id;
                            outdated_db = vismin_db;
                            outdated_log_id = vismin_vm_log_id;
                        }
                            
                        // Copy the logs from updated_db that are not in outdated_db
                        console.log(`Copying ${updated_log_id - outdated_log_id} logs`)
                        const last_log_id = await copyLogToLog(updated_db, updated_log_id, outdated_db, outdated_log_id, "vismin");

                        // If logs are not successfully copied
                        if (last_log_id.error) {
                            console.log('ERROR: logs are not successfully copied.')
                            // End transactions
                            await endTransaction(central_db, "ROLLBACK");
                            await endTransaction(vismin_db, "ROLLBACK");
                            // Unlocks the tables
                            await central_db.query(`UNLOCK TABLES;`);
                            await vismin_db.query(`UNLOCK TABLES;`);
                            return { error: last_log_id.error }
                        }

                        // Apply the logs to the appointments table in central_db
                        console.log(`Applying logs from ${outdated_log_id + 1} to ${last_log_id}`)
                        for (let log_id = outdated_log_id + 1; log_id <= last_log_id; log_id++) {
                            const appointment = await applyLogToAppointments(outdated_db, log_id, "vismin");

                            // If logs are not successfully applied
                            if (appointment.error) {
                                console.log('ERROR: logs are not successfully applied.')
                                // End transactions
                                await endTransaction(central_db, "ROLLBACK");
                                await endTransaction(vismin_db, "ROLLBACK");
                                // Unlocks the tables
                                await central_db.query(`UNLOCK TABLES;`);
                                await vismin_db.query(`UNLOCK TABLES;`);
                                return { error: appointment.error }
                            }
                        }

                        // Get the latest log_id from both databases
                        [rows] = await central_db.execute(`
                            SELECT log_id
                            FROM vismin_log
                            ORDER BY log_id DESC
                            LIMIT 1;
                        `);
                        var central_vm_log_id;
                        if (rows.length === 0) {
                            central_vm_log_id = 0;
                        } else {
                            central_vm_log_id = rows[0].log_id;
                        }
                        [rows] = await vismin_db.execute(`
                            SELECT log_id
                            FROM vismin_log
                            ORDER BY log_id DESC
                            LIMIT 1;
                        `);
                        var vismin_vm_log_id;
                        if (rows.length === 0) {
                            vismin_vm_log_id = 0;
                        } else {
                            vismin_vm_log_id = rows[0].log_id;
                        }

                        // If the latest log_id from both databases are not the same
                        if (vismin_vm_log_id !== central_vm_log_id) {
                            // End transactions
                            await endTransaction(central_db, "ROLLBACK");
                            await endTransaction(vismin_db, "ROLLBACK");
                            // Unlocks the tables
                            await central_db.query(`UNLOCK TABLES;`);
                            await vismin_db.query(`UNLOCK TABLES;`);
                            return console.log('ERROR: logs are not successfully applied.')
                        }

                        // End transactions
                        await endTransaction(central_db, "COMMIT");
                        await endTransaction(vismin_db, "COMMIT");
                        // Unlocks the tables
                        await central_db.query(`UNLOCK TABLES;`);
                        await vismin_db.query(`UNLOCK TABLES;`);

                        console.log('VisMin Replication successful.')
                    }
                    catch (error) {
                        // End transactions
                        await endTransaction(central_db, "ROLLBACK");
                        await endTransaction(vismin_db, "ROLLBACK");
                        // Unlocks the tables
                        await central_db.query(`UNLOCK TABLES;`);
                        await vismin_db.query(`UNLOCK TABLES;`);
                        console.log(error)
                        return console.log('ERROR: logs are not successfully applied.')
                    }
                } 
                else {
                    console.log('SYNCHRONIZED DATABASES: central_db and vismin_db have the latest logs.')
                }
            } else {
                //only one is online
                console.log('UNAVAILABLE CASE: One of the databases is currently unavailable. Cannot perform synchronization.')
            }
        }
    }

    return { message: "Replication successful." }
}



// Copy Log data from one database to another
async function copyLogToLog(source_connection, source_last_log_id, dest_connection, dest_last_log_id, mode = "luzon") {

    var rows = []

    try {
        // Get the logs from the source database that are not in the destination database
        [rows] = await source_connection.execute(`
            SELECT *
            FROM ${mode}_log
            WHERE log_id > ?;
        `, [dest_last_log_id]);
        const logs = rows;

        // Copy the logs from the source database to the destination database
        for (let log of logs) {
            [rows] = await dest_connection.execute(`
                INSERT INTO ${mode}_log
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `, [
                log.log_id,
                log.operation,
                log.apt_id,
                log.patient_name,
                log.patient_age,
                log.doctor_name,
                log.doctor_specialty,
                log.clinic_name,
                log.clinic_city,
                log.island_group,
                log.appointment_date,
                log.appointment_status,
                log.time_queued
            ]);
        }

        return rows.insertId
    }
    catch (error) {
        // End transactions
        await endTransaction(source_connection, "ROLLBACK");
        await endTransaction(dest_connection, "ROLLBACK");
        console.log(error)
        return { error: error }
    }
}



// Apply Luzon Log to Appointments Table
async function applyLogToAppointments(db_connection, log_id, mode = "luzon") {
    
    var row = []

    try {
        // Get the log entry from the luzon_log table
        [row] = await db_connection.execute(`
            SELECT *
            FROM ${mode}_log
            WHERE log_id = ?;
        `, [log_id]);
        row = row[0];

        // Create appointment object
        const appointment = {
            apt_id: row.apt_id,
            patient_name: row.patient_name,
            patient_age: row.patient_age,
            doctor_name: row.doctor_name,
            doctor_specialty: row.doctor_specialty,
            clinic_name: row.clinic_name,
            clinic_city: row.clinic_city,
            island_group: row.island_group,
            appointment_date: row.appointment_date,
            appointment_status: row.appointment_status,
            time_queued: row.time_queued
        }

        // Identify the operation
        switch (row.operation) {
            
            // Insert the appointment into the database
            case "INSERT":
                console.log('INSERT')
                row = await db_connection.execute(`
                    INSERT INTO appointments
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                `, [
                    appointment.apt_id,
                    appointment.patient_name,
                    appointment.patient_age,
                    appointment.doctor_name,
                    appointment.doctor_specialty,
                    appointment.clinic_name,
                    appointment.clinic_city,
                    appointment.island_group,
                    appointment.appointment_date,
                    appointment.appointment_status,
                    appointment.time_queued
                ]);
                row = row[0];
                break;

            // Update the appointment in the database
            case "UPDATE":
                console.log('UPDATE')
                row = await db_connection.execute(`
                    UPDATE appointments
                    SET patient_name = ?,
                        patient_age = ?,
                        doctor_name = ?,
                        doctor_specialty = ?,
                        clinic_name = ?,
                        clinic_city = ?,
                        island_group = ?,
                        appointment_date = ?,
                        appointment_status = ?,
                        time_queued = ?
                    WHERE apt_id = ?;
                `, [
                    appointment.patient_name,
                    appointment.patient_age,
                    appointment.doctor_name,
                    appointment.doctor_specialty,
                    appointment.clinic_name,
                    appointment.clinic_city,
                    appointment.island_group,
                    appointment.appointment_date,
                    appointment.appointment_status,
                    appointment.time_queued,
                    appointment.apt_id
                ]);
                row = row[0];
                break;

            // Delete the appointment from the database
            case "DELETE":
                console.log('DELETE')
                row = await db_connection.execute(`
                    DELETE FROM appointments
                    WHERE apt_id = ?;
                `, [appointment.apt_id]);
                row = row[0];
                break;
        }
        
        return {
            insertId: row.insertId
        }
    }
    catch (error) {
        // End transactions
        await endTransaction(db_connection, "ROLLBACK");
        console.log(error)
        return { error: error }
    }
}



// Export Replication Functions
export default {
    replicateDatabases
}