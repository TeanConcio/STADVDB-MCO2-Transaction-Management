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

            // If both central_db and luzon_db are online
            if (serverStatuses.central_db_status && 
                serverStatuses.luzon_db_status) {

                await beginTransaction(central_db, "READ COMMITTED");
                await beginTransaction(luzon_db, "READ COMMITTED");

                // Get the latest log_id from both databases
                [rows] = await central_db.execute(`
                    SELECT log_id
                    FROM luzon_log
                    ORDER BY log_id DESC
                    LIMIT 1;
                `);
                var central_l_log = rows[0];
                [rows] = await luzon_db.execute(`
                    SELECT log_id
                    FROM luzon_log
                    ORDER BY log_id DESC
                    LIMIT 1; 
                `);
                var luzon_l_log = rows[0];

                await endTransaction(central_db, "COMMIT");
                await endTransaction(luzon_db, "COMMIT");

                // If the latest log_id from both databases are not the same
                if (luzon_l_log.log_id !== central_l_log.log_id) {
                    // Lock the tables
                    await central_db.execute(`LOCK TABLES appointments WRITE, luzon_log WRITE, vismin_log WRITE;`);
                    await luzon_db.execute(`LOCK TABLES appointments WRITE, luzon_log WRITE;`);
                    // Begin transactions
                    await beginTransaction(central_db, "SERIALIZABLE");
                    await beginTransaction(luzon_db, "SERIALIZABLE");

                    // Check which database has the latest log_id
                    var updated_db;
                    var updated_log_id;
                    var outdated_db;
                    var outdated_log_id;
                    if (luzon_l_log.log_id > central_l_log.log_id) {
                        updated_db = luzon_db;
                        updated_log_id = luzon_l_log.log_id;
                        outdated_db = central_db;
                        outdated_log_id = central_l_log.log_id;
                    }
                    else {
                        updated_db = central_db;
                        updated_log_id = central_l_log.log_id;
                        outdated_db = luzon_db;
                        outdated_log_id = luzon_l_log.log_id;
                    }
                        
                    // Copy the logs from updated_db that are not in outdated_db
                    const last_log_id = await copyLogToLog(updated_db, updated_log_id, outdated_db, outdated_log_id);

                    // If logs are not successfully copied
                    if (last_log_id.error) {
                        console.log('ERROR: logs are not successfully copied.')
                        // End transactions
                        await endTransaction(central_db, "ROLLBACK");
                        await endTransaction(luzon_db, "ROLLBACK");
                        // Unlocks the tables
                        await central_db.execute(`UNLOCK TABLES;`);
                        await luzon_db.execute(`UNLOCK TABLES;`);
                        return { error: last_log_id.error }
                    }

                    // Apply the logs to the appointments table in central_db
                    for (let log_id = outdated_log_id + 1; log_id <= last_log_id; log_id++) {
                        [rows] = await applyLogToAppointments(outdated_db, log_id, "luzon");

                        // If logs are not successfully applied
                        if (rows.error) {
                            console.log('ERROR: logs are not successfully applied.')
                            // End transactions
                            await endTransaction(central_db, "ROLLBACK");
                            await endTransaction(luzon_db, "ROLLBACK");
                            // Unlocks the tables
                            await central_db.execute(`UNLOCK TABLES;`);
                            await luzon_db.execute(`UNLOCK TABLES;`);
                            return { error: rows.error }
                        }
                    }

                    // Get the latest log_id from both databases
                    [rows] = await central_db.execute(`
                        SELECT log_id
                        FROM luzon_log
                        ORDER BY log_id DESC
                        LIMIT 1;
                    `);
                    central_l_log = rows[0];
                    [rows] = await luzon_db.execute(`
                        SELECT log_id
                        FROM luzon_log
                        ORDER BY log_id DESC
                        LIMIT 1; 
                    `);
                    luzon_l_log = rows[0];

                    // If the latest log_id from both databases are not the same
                    if (luzon_l_log.log_id !== central_l_log.log_id) {
                        // End transactions
                        await endTransaction(central_db, "ROLLBACK");
                        await endTransaction(luzon_db, "ROLLBACK");
                        // Unlocks the tables
                        await central_db.execute(`UNLOCK TABLES;`);
                        await luzon_db.execute(`UNLOCK TABLES;`);
                        return console.log('ERROR: logs are not successfully applied.')
                    }

                    // End transactions
                    await endTransaction(central_db, "COMMIT");
                    await endTransaction(luzon_db, "COMMIT");
                    // Unlocks the tables
                    await central_db.execute(`UNLOCK TABLES;`);
                    await luzon_db.execute(`UNLOCK TABLES;`);
                } 
                else {
                    console.log('SYNCHRONIZED DATABASES: server_db and luzon_db have the latest logs.')
                }
            } else {
                //only one is online
                console.log('SINGLE CASE: Only one database is currently online for usage.')
            }
        }
        
        // If the list of databases includes vismin_db
        if (listOfDBs.includes("vismin_db")){
            
            // If both central_db and vismin_db are online
            if (serverStatuses.central_db_status && 
                serverStatuses.vismin_db_status) {

                await beginTransaction(central_db, "READ COMMITTED");
                await beginTransaction(vismin_db, "READ COMMITTED");

                // Get the latest log_id from both databases
                [rows] = await central_db.execute(`
                    SELECT log_id
                    FROM vismin_log
                    ORDER BY log_id DESC
                    LIMIT 1;
                `);
                var central_l_log = rows[0];
                [rows] = await vismin_db.execute(`
                    SELECT log_id
                    FROM vismin_log
                    ORDER BY log_id DESC
                    LIMIT 1; 
                `);
                var vismin_l_log = rows[0];

                await endTransaction(central_db, "COMMIT");
                await endTransaction(vismin_db, "COMMIT");

                // If the latest log_id from both databases are not the same
                if (vismin_l_log.log_id !== central_l_log.log_id) {
                    // Lock the tables
                    await central_db.execute(`LOCK TABLES appointments WRITE, luzon_log WRITE, vismin_log WRITE;`);
                    await vismin_db.execute(`LOCK TABLES appointments WRITE, vismin_log WRITE;`);
                    // Begin transactions
                    await beginTransaction(central_db, "SERIALIZABLE");
                    await beginTransaction(vismin_db, "SERIALIZABLE");

                    // Check which database has the latest log_id
                    var updated_db;
                    var updated_log_id;
                    var outdated_db;
                    var outdated_log_id;
                    if (vismin_l_log.log_id > central_l_log.log_id) {
                        updated_db = vismin_db;
                        updated_log_id = vismin_l_log.log_id;
                        outdated_db = central_db;
                        outdated_log_id = central_l_log.log_id;
                    }
                    else {
                        updated_db = central_db;
                        updated_log_id = central_l_log.log_id;
                        outdated_db = vismin_db;
                        outdated_log_id = vismin_l_log.log_id;
                    }
                        
                    // Copy the logs from updated_db that are not in outdated_db
                    const last_log_id = await copyLogToLog(updated_db, updated_log_id, outdated_db, outdated_log_id);

                    // If logs are not successfully copied
                    if (last_log_id.error) {
                        console.log('ERROR: logs are not successfully copied.')
                        // End transactions
                        await endTransaction(central_db, "ROLLBACK");
                        await endTransaction(vismin_db, "ROLLBACK");
                        // Unlocks the tables
                        await central_db.execute(`UNLOCK TABLES;`);
                        await vismin_db.execute(`UNLOCK TABLES;`);
                        return { error: last_log_id.error }
                    }

                    // Apply the logs to the appointments table in central_db
                    for (let log_id = outdated_log_id + 1; log_id <= last_log_id; log_id++) {
                        [rows] = await applyLogToAppointments(outdated_db, log_id, "vismin");

                        // If logs are not successfully applied
                        if (rows.error) {
                            console.log('ERROR: logs are not successfully applied.')
                            // End transactions
                            await endTransaction(central_db, "ROLLBACK");
                            await endTransaction(vismin_db, "ROLLBACK");
                            // Unlocks the tables
                            await central_db.execute(`UNLOCK TABLES;`);
                            await vismin_db.execute(`UNLOCK TABLES;`);
                            return { error: rows.error }
                        }
                    }

                    // Get the latest log_id from both databases
                    [rows] = await central_db.execute(`
                        SELECT log_id
                        FROM vismin_log
                        ORDER BY log_id DESC
                        LIMIT 1;
                    `);
                    central_l_log = rows[0];
                    [rows] = await vismin_db.execute(`
                        SELECT log_id
                        FROM vismin_log
                        ORDER BY log_id DESC
                        LIMIT 1; 
                    `);
                    vismin_l_log = rows[0];

                    // If the latest log_id from both databases are not the same
                    if (vismin_l_log.log_id !== central_l_log.log_id) {
                        // End transactions
                        await endTransaction(central_db, "ROLLBACK");
                        await endTransaction(vismin_db, "ROLLBACK");
                        // Unlocks the tables
                        await central_db.execute(`UNLOCK TABLES;`);
                        await vismin_db.execute(`UNLOCK TABLES;`);
                        return console.log('ERROR: logs are not successfully applied.')
                    }

                    // End transactions
                    await endTransaction(central_db, "COMMIT");
                    await endTransaction(vismin_db, "COMMIT");
                    // Unlocks the tables
                    await central_db.execute(`UNLOCK TABLES;`);
                    await vismin_db.execute(`UNLOCK TABLES;`);
                } 
                else {
                    console.log('SYNCHRONIZED DATABASES: server_db and vismin_db have the latest logs.')
                }

            } else {
                //only one is online
                console.log('SINGLE CASE: Only one database is currently online for usage.')
            }
        }
    }

    return { message: "Replication successful." }
}



// Copy Log data from one database to another
async function copyLogToLog(source_connection, source_last_log_id, dest_connection, dest_last_log_id) {

    var rows = []

    try {
        // Get the logs from the source database that are not in the destination database
        [rows] = await source_connection.execute(`
            SELECT *
            FROM luzon_log
            WHERE log_id > ?;
        `, [dest_last_log_id]);
        const logs = rows;

        // Copy the logs from the source database to the destination database
        for (let log of logs) {
            [rows] = await dest_connection.execute(`
                INSERT INTO luzon_log
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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
                [row] = await db_connection.execute(`
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
                break;

            // Update the appointment in the database
            case "UPDATE":
                [row] = await db_connection.execute(`
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
                break;

            // Delete the appointment from the database
            case "DELETE":
                [row] = await db_connection.execute(`
                    DELETE FROM appointments
                    WHERE apt_id = ?;
                `, [appointment.apt_id]);
                break;
            }
        
            return row.insertId
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