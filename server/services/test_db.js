import mysql from 'mysql2/promise'

// Import Database Connections
import {
    central_db,
    luzon_db,
    vismin_db,
    beginTransaction,
    endTransaction
} from './db_connections.js'

// Import Database Replication Functions
import {
    replicateDatabases
} from './replication.js'
import { pingDatabases } from './database.js'
/*
=====================================================================
THIS FILE WILL STRICTTLY CONTAIN FUNCTIONS FOR ATTEMPTING TEST CASES
=====================================================================
    *- these are concurrency tests, single database tests
    *Note: the tests are stricly for testing the nature of the transactions and the database setup
            meaning that in practice this will technically not happen due to the nature of logging.
            There might be some test cases where we try to insert twice into the log
*/
async function readTests(db_pool, isolation_level= "READ COMMITTED", delay) {
    let result = [];
    const connection = await db_pool.getConnection();
    const start = new Date();
    console.log(start.getSeconds());

    try {
        await connection.query(`SET autocommit=0;`);
    
        await connection.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation_level};`);
    
        await connection.query(`START TRANSACTION;`);

        await connection.query(`DO SLEEP(${delay});`);

        [result] = await connection.query(`SELECT * FROM appointments;`);

        await connection.query(`COMMIT;`);
        console.log('Finshed Reading!');
        connection.release();
        
    } catch (error) {
        console.log(error)
        connection.release();
    }
    connection.release();
    return [result];
}


export async function test_TwoReads() {
    const db_status = await pingDatabases();
    var offset = 0;
    
    try {
        if (db_status.central_db_status) {
            const operations = [];
            const numOperations = 1; // Adjust as needed

            // Create and push concurrent query functions
        for (let i = 0; i <= numOperations; i++) {
            operations.push(readTests(central_db, "READ COMMITTED", 5+offset));
            offset = offset+3;
        }
        
            var result = await Promise.all(operations);
            if (result[0] === result[1]) {
                console.log('They\'re the same!');
            }
            console.log(result);
            console.log("got to the last part!");
        }
        if (db_status.luzon_db_status) {
            const operations = [];
            const numOperations = 1; // Adjust as needed

            // Create and push concurrent query functions
        for (let i = 0; i <= numOperations; i++) {
            operations.push(readTests(luzon_db, "READ COMMITTED", 5+offset));
            offset = offset+3;
        }
        
            var result = await Promise.all(operations);
            if (result[0] === result[1]) {
                console.log('They\'re the same!');
            }
            console.log(result);
            console.log("got to the last part!");
        }
        if (db_status.vismin_db_status) {
            const operations = [];
            const numOperations = 1; // Adjust as needed

            // Create and push concurrent query functions
        for (let i = 0; i <= numOperations; i++) {
            operations.push(readTests(vismin_db, "READ COMMITTED", 5+offset));
            offset = offset+3;
        }
        
            var result = await Promise.all(operations);
            if (result[0] === result[1]) {
                console.log('They\'re the same!');
            }
            console.log(result);
            console.log("got to the last part!");
        }
    

    } catch (error) {
        console.log(error);
    }
}

//Update related ones
async function update(db_pool, isolation_level= "READ COMMITTED", delay, id) {
    let result = [];
    const connection = await db_pool.getConnection();
    const start = new Date();
    console.log(start.getSeconds());

    try {
        await connection.query(`SET autocommit=0;`);
    
        await connection.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation_level};`);
    
        await connection.query(`START TRANSACTION;`);

        await connection.query(`DO SLEEP(${delay});`);

        [result] = await connection.query(`UPDATE appointments SET patient_name="testupdate" WHERE apt_id=${id};`);

        await connection.query(`DO SLEEP(${delay});`);

        await connection.query(`COMMIT;`);
        console.log('Update committed.')

        //RESET PORTION 
        await connection.query(`SET autocommit=0;`);
    
        await connection.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation_level};`);
    
        await connection.query(`START TRANSACTION;`);

        [result] = await connection.query(`UPDATE appointments SET patient_name="test" WHERE apt_id=${id};`);

        await connection.query(`COMMIT;`);
        console.log('Rolled back!')
        connection.release();
        
    } catch (error) {
        console.log(error)
        connection.release();
    }
    connection.release();
    return [result];
}


export async function test_UpdateintoRead() {
    const db_status = await pingDatabases();
    
    try {
        if (db_status.central_db_status) {
            const operations = [];
            const numOperations = 0; // Adjust as needed

            // Create and push concurrent query functions
            //Update first UNCOMMITTED then read
            for (let i = 0; i <= numOperations; i++) {
                operations.push(update(central_db, "READ COMMITTED", 2, 35));
                operations.push(readTests(central_db, "READ COMMITTED", 3))
            }
        
            var result = await Promise.all(operations);
            console.log(result);
            console.log(result[1])
            console.log("Central Test is a success!");
        }
        if (db_status.luzon_db_status) {
            const operations = [];
            const numOperations = 0; // Adjust as needed

            // Create and push concurrent query functions
            //Update first UNCOMMITTED then read
            for (let i = 0; i <= numOperations; i++) {
                operations.push(update(luzon_db, "READ COMMITTED", 2, 35));
                operations.push(readTests(luzon_db, "READ COMMITTED", 3))
            }
        
            var result = await Promise.all(operations);
            console.log(result);
            console.log(result[1])
            console.log("Luzon Test is a success!");
        }
        if (db_status.vismin_db_status) {
            const operations = [];
            const numOperations = 0; // Adjust as needed

            // Create and push concurrent query functions
            //Update first UNCOMMITTED then read
            for (let i = 0; i <= numOperations; i++) {
                operations.push(update(vismin_db, "READ COMMITTED", 2, 30));
                operations.push(readTests(vismin_db, "READ COMMITTED", 3))
            }
        
            var result = await Promise.all(operations);
            console.log(result);
            //console.log(result[1])
            console.log("VisMin Test is a success!");
        }

    } catch (error) {
        console.log(error);
    }
}

export async function test_TwoUpdates() {
    const db_status = await pingDatabases();
    
    try {
        if (db_status.central_db_status) {
            const operations = [];
            const numOperations = 0; // Adjust as needed

            // Create and push concurrent query functions
            //Update first UNCOMMITTED then read
            for (let i = 0; i <= numOperations; i++) {
                operations.push(update(central_db, "READ COMMITTED", 2, 35));
                operations.push(update(central_db, "READ COMMITTED", 2, 35));
            }
        
            var result = await Promise.all(operations);
            console.log(result);
            console.log(result[1])
            console.log("Central Test is a success!");
        }
        if (db_status.luzon_db_status) {
            const operations = [];
            const numOperations = 0; // Adjust as needed

            // Create and push concurrent query functions
            //Update first UNCOMMITTED then read
            for (let i = 0; i <= numOperations; i++) {
                operations.push(update(central_db, "READ COMMITTED", 2, 35));
                operations.push(update(central_db, "READ COMMITTED", 2, 35));
            }
        
            var result = await Promise.all(operations);
            console.log(result);
            console.log(result[1])
            console.log("Luzon Test is a success!");
        }
        if (db_status.vismin_db_status) {
            const operations = [];
            const numOperations = 0; // Adjust as needed

            // Create and push concurrent query functions
            //Update first UNCOMMITTED then read
            for (let i = 0; i <= numOperations; i++) {
                operations.push(update(vismin_db, "READ COMMITTED", 2, 30));
                operations.push(update(vismin_db, "READ COMMITTED", 2, 30));
            }
        
            var result = await Promise.all(operations);
            console.log(result);
            //console.log(result[1])
            console.log("VisMin Test is a success!");
        }

    } catch (error) {
        console.log(error);
    }
}

//INSERTS (These will insert into the logs instead so the database doesn't perish)
//I'm referencing addtoXlog function
/*
async function insertintoLog(db_pool1, db_pool2, db_status, isolation_level= "READ COMMITTED", delay, log, operation) {
    var rows = [];
    let result = [];
    const connectionC = await db_pool1.getConnection();
    const connectionR = await db_pool2.getConnection();
    const start = new Date();
    console.log(start.getSeconds());

    let central_log_id;
    let luzon_log_id;
    let vismin_log_id;
    //Note: there isn't any other transaction taking place here, so some of the error catchhers aren'tt needed
    try {
        if (log == "Luzon") {
            if (db_status.central_db_status && db_status.luzon_db_status) {
                [rows] = await connectionC.execute(`
                SELECT log_id
                FROM luzon_log
                ORDER BY log_id DESC
                LIMIT 1;
                `);
                if (!rows.length) {
                    central_log_id = 0;
                } else {
                    central_log_id = rows[0].log_id;
                }

                [rows] = await connectionR.execute(`
                SELECT log_id
                FROM luzon_log
                ORDER BY log_id DESC
                LIMIT 1;
                `);
                if (!rows.length) {
                    luzon_log_id = 0;
                } else {
                    luzon_log_id = rows[0].log_id;
                }

                //compare thier ids
                if (db_status.central_db_status &&
                    db_status.luzon_db_status &&
                    central_log_id !== luzon_log_id) {
                    return {error: "Central and Luzon databases' luzon_log tables are not in sync"};
                }

                //it don't error then we do tthe processes
                if (db_status.central_db_status) {
                    await connectionC.execute(`
                        ALTER TABLE luzon_log AUTO_INCREMENT = ${central_log_id};
                    `);
                }
                if (db_status.luzon_db_status) {
                    await connectionR.execute(`
                        ALTER TABLE luzon_log AUTO_INCREMENT = ${luzon_log_id};
                    `);
                }

                console.log("Adding to Luzon Log");

                // Insert appointment into central_db's and luzon_db's luzon_log tables
                if (db_status.central_db_status) {
                    await connectionC.query();
                    [rows] = await connectionC.execute(`
                        INSERT INTO luzon_log (operation, apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued)
                        VALUES ('${operation}', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                    `, [appointment.apt_id, appointment.patient_name, appointment.patient_age, appointment.doctor_name, appointment.doctor_specialty, appointment.clinic_name, appointment.clinic_city, appointment.island_group, appointment.appointment_date, appointment.appointment_status, appointment.time_queued]);
                    central_log_id = rows.insertId;
                }
                if (db_status.luzon_db_status) {
                    [rows] = await connectionR.execute(`
                        INSERT INTO luzon_log (operation, apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued)
                        VALUES ('${operation}', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                    `, [appointment.apt_id, appointment.patient_name, appointment.patient_age, appointment.doctor_name, appointment.doctor_specialty, appointment.clinic_name, appointment.clinic_city, appointment.island_group, appointment.appointment_date, appointment.appointment_status, appointment.time_queued]);
                    luzon_log_id = rows.inse
                    rtId;
                }
                // Throw error if central_db and luzon_db are not in sync
                if (db_status.central_db_status && 
                    db_status.luzon_db_status && 
                    central_log_id !== luzon_log_id) {
                    // End transactions
                if (db_status.central_db_status)
                    await endTransaction(central_db, "ROLLBACK");
                if (db_status.luzon_db_status)
                    await endTransaction(luzon_db, "ROLLBACK");
                    return {error: "Central and Luzon databases luzon_log tables are not in sync"};
                }

                if (db_status.central_db_status)
                    return {
                        log_id: central_log_id
                    }
        
                if (db_status.luzon_db_status)
                return {
                    log_id: luzon_log_id
                }
            }
            
        } else if (log == "Visayas" || log == "Mindanao") {
            if (db_status.central_db_status && db_status.vismin_db_status) {
                
            }
        }
        
    } catch (error) {
        console.log(error)
        connectionC.release();
        connectionR.release();
    }
    connectionC.release();
    connectionR.release();
    return [result];
}

export async function test_TwoInsertions() {
    const db_status = await pingDatabases();
    
    try {
        if (db_status.central_db_status) {
            const operations = [];
            const numOperations = 0; // Adjust as needed

            // Create and push concurrent query functions
            //Update first UNCOMMITTED then read
            for (let i = 0; i <= numOperations; i++) {
                operations.push(update(central_db, "READ COMMITTED", 2, 35));
                operations.push(update(central_db, "READ COMMITTED", 2, 35));
            }
        
            var result = await Promise.all(operations);
            console.log(result);
            console.log(result[1])
            console.log("Central Test is a success!");
        }
        if (db_status.luzon_db_status) {
            const operations = [];
            const numOperations = 0; // Adjust as needed

            // Create and push concurrent query functions
            //Update first UNCOMMITTED then read
            for (let i = 0; i <= numOperations; i++) {
                operations.push(update(central_db, "READ COMMITTED", 2, 35));
                operations.push(update(central_db, "READ COMMITTED", 2, 35));
            }
        
            var result = await Promise.all(operations);
            console.log(result);
            console.log(result[1])
            console.log("Luzon Test is a success!");
        }
        if (db_status.vismin_db_status) {
            const operations = [];
            const numOperations = 0; // Adjust as needed

            // Create and push concurrent query functions
            //Update first UNCOMMITTED then read
            for (let i = 0; i <= numOperations; i++) {
                operations.push(update(vismin_db, "READ COMMITTED", 2, 30));
                operations.push(update(vismin_db, "READ COMMITTED", 2, 30));
            }
        
            var result = await Promise.all(operations);
            console.log(result);
            //console.log(result[1])
            console.log("VisMin Test is a success!");
        }

    } catch (error) {
        console.log(error);
    }
}
*/
export default {
    test_TwoReads,
    test_UpdateintoRead,
    test_TwoUpdates
}