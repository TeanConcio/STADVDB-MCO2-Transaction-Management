import mysql from 'mysql2'



// Database Connections

export const central_db = mysql.createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20060,
    user: "dom",
    password: "1234",
    database: "STADVDB-MCO2-Central"
}).promise()

export const luzon_db = mysql.createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20061,
    user: "dom",
    password: "1234",
    database: "STADVDB-MCO2-Luzon"
}).promise()

export const vismin_db = mysql.createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20062,
    user: "dom",
    password: "1234",
    database: "STADVDB-MCO2-VisMin"
}).promise()



// Transaction Functions

export async function executeTransaction (db_pool, isolation_level = "READ COMMITTED", sql, values = null) {

    await db_pool.execute(`SET autocommit=0;`)

    return await db_pool.execute(`SET SESSION TRANSACTION ISOLATION LEVEL ${isolation_level};`)

    return await db_pool.execute(`START TRANSACTION;`)

    return await db_pool.execute(`
            SET autocommit=0;
            SET SESSION TRANSACTION ISOLATION LEVEL ${isolation_level};
            START TRANSACTION;
            ${sql}
            COMMIT;
    `, values)
}


// Export Database Connections

export default {
    central_db,
    luzon_db,
    vismin_db,
    executeTransaction
}