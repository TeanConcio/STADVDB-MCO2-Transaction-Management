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

export default {
    test_TwoReads,
    test_UpdateintoRead,
    test_TwoUpdates
}