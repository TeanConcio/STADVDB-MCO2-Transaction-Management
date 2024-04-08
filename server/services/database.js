import mysql from 'mysql2'

// Import Database Connections
import {
    central_db,
    luzon_db,
    vismin_db,
    executeTransaction
} from './db_connections.js'



// Ping all databases
export async function pingDatabases(db_list = ['central', 'luzon', 'vismin']) {

    let {
        central_status, 
        luzon_status, 
        vismin_status
    } = {central_status: false, luzon_status: false, vismin_status: false};

    if (db_list.includes('central')) {
        try {
            await central_db.execute(`SELECT 1;`)
            central_status = true
        } catch (err) {
            console.error('Failed to ping central_db: ', err)
        }
    }

    if (db_list.includes('luzon')) {
        try {
            await luzon_db.execute(`SELECT 1;`)
            luzon_status = true
        } catch (err) {
            console.error('Failed to ping luzon_db: ', err)
        }
    }

    if (db_list.includes('vismin')) {
        try {
            await vismin_db.execute(`SELECT 1;`)
            vismin_status = true
        } catch (err) {
            console.error('Failed to ping vismin_db: ', err)
        }
    }

    return {
        central_status,
        luzon_status,
        vismin_status
    }
}



export async function getAppointment(id) {

    console.log("Hello from getAppointment()")
    const [rows] = await central_db.execute(`
        SELECT * 
        FROM appointments
        WHERE apt_id = ?
    ;`, [id])

    return rows[0]
}

// Get all appointments
export async function getAllAppointments() {
    let rows = [];

    // Try central_db first
    try {

        [rows] = await executeTransaction(central_db, "READ COMMITTED",`
            SELECT * 
            FROM appointments;
        `)
    } catch (err) {
        console.error('Failed to query central_db: ', err);

        // If central_db fails, try luzon_db and vismin_db
        try {
            const [luzonRows] = await executeTransaction(luzon_db, "READ COMMITTED", `
                SELECT * 
                FROM appointments;
            `);

            const [visminRows] = await executeTransaction(vismin_db, "READ COMMITTED", `
                SELECT *
                FROM appointments;
            `);

            // Merge the results
            rows = [...luzonRows, ...visminRows];
        } catch (err) {
            console.error('Failed to query luzon_db or vismin_db: ', err);
            return {error: "Failed to query all databases"};
        }
    }
    //console.log(rows);
    return rows;
}



export async function createAppointment(appointment) {
    
    
}



export async function deleteAppointment() {
    
    
}



// Export Functions
export default {
    pingDatabases,
    getAppointment,
    getAllAppointments,
    createAppointment
}
