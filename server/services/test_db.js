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
    *- these are concurrency tests, central_db will be used
*/
async function readTests(db_pool, isolation_level= "READ COMMITTED", delay) {
    let result = [];
    const connection = await db_pool.getConnection();

    try {
        await connection.query(`SET autocommit=0;`);
    
        await connection.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation_level};`);
    
        await connection.query(`START TRANSACTION;`);

        await connection.query(`DO SLEEP(${delay});`);

        [result] = await connection.query(`SELECT * FROM appointments;`);

        await connection.query(`COMMIT;`);
        connection.release();
        
    } catch (error) {
        console.log(error)
        connection.release();
    }
    connection.release();
    return [result];
}


export async function test_TwoReads() {

    let rows1 = [];
    let rows2 = [];

    const db_status = await pingDatabases();
    
    try {
        if (db_status.central_db_status) {
            const operations = [];
            const numOperations = 1; // Adjust as needed

            // Create and push concurrent query functions
        for (let i = 0; i <= numOperations; i++) {
            operations.push(readTests(central_db, "READ COMMITTED", 5+i));
        }
        
            var result = await Promise.all(operations);
            if (result[0] == result[1]) {
                console.log('They\'re the same!');
            }
            console.log(result);
            console.log("got to the last part!");
        }
    

    } catch (error) {
        console.log(error);
    }
    
}

export default {
    test_TwoReads
}