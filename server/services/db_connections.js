import mysql from 'mysql2'

export const central_db = mysql.createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20060,
    user: "dom",
    password: "1234",
    database: "STADVDB-MCO2"
}).promise()

export const luzon_db = mysql.createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20061,
    user: "dom",
    password: "1234",
    database: "STADVDB-MCO2"
}).promise()

export const vismin_db = mysql.createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20062,
    user: "dom",
    password: "1234",
    database: "STADVDB-MCO2"
}).promise()

export default {
    central_db,
    luzon_db,
    vismin_db
}