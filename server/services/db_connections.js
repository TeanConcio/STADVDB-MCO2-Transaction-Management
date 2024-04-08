import mysql from 'mysql2'



// Database Connections

export const central_db = mysql.createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20060,
    user: "dom",
    password: "1234",
    database: "STADVDB-MCO2-Central",
    multipleStatements: true
}).promise()

export const luzon_db = mysql.createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20061,
    user: "dom",
    password: "1234",
    database: "STADVDB-MCO2-Luzon",
    multipleStatements: true
}).promise()

export const vismin_db = mysql.createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20062,
    user: "dom",
    password: "1234",
    database: "STADVDB-MCO2-VisMin",
    multipleStatements: true
}).promise()



// Transaction Functions

export async function executeTransaction (db_pool, isolation_level = "READ COMMITTED", sql, values = null) {

    await db_pool.query(`SET autocommit=0;`)

    await db_pool.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation_level};`)

    await db_pool.query(`START TRANSACTION;`)

    const result = await db_pool.execute(`${sql}`, values)

    await db_pool.query(`COMMIT;`)

    return result;
}


// Export Database Connections

export default {
    central_db,
    luzon_db,
    vismin_db,
    executeTransaction
}