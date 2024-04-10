import mysql from 'mysql2/promise'



// Database Connections

export const central_db = mysql.createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20060,
    user: "dom",
    password: "1234",
    database: "STADVDB-MCO2-Central",
    multipleStatements: true
});

export const luzon_db = mysql.createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20061,
    user: "dom",
    password: "1234",
    database: "STADVDB-MCO2-Luzon",
    multipleStatements: true
});

export const vismin_db = mysql.createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20062,
    user: "dom",
    password: "1234",
    database: "STADVDB-MCO2-VisMin",
    multipleStatements: true
});



// Transaction Functions

export async function beginTransaction (db_pool, isolation_level = "READ COMMITTED") {
    
    await db_pool.query(`SET autocommit=0;`)
    
    await db_pool.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation_level};`)
    
    await db_pool.query(`START TRANSACTION;`)
}

export async function endTransaction (db_pool, verdict = "COMMIT") {

    await db_pool.query(`${verdict};`)
}


// Export Database Connections

export default {
    central_db,
    luzon_db,
    vismin_db,
    beginTransaction,
    endTransaction
}