import mysql from 'mysql2'

// Import Database Connections
import {
    central_db,
    luzon_db,
    vismin_db
} from './db_connections.js'



export async function getAppointment(id) {
    const [rows] = await pool.execute(`
        SELECT * 
        FROM appointments
        WHERE id = ?
    ;`, [id])

    return rows[0]
}

// Get all appointments
export async function getAllAppointments() {
    let rows = [];

    try {
        [rows] = await central_db.execute(`
            SET autocommit=0;
            SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
            START TRANSACTION;

            SELECT * 
            FROM appointments;

            COMMIT;
        `)
    } catch (err) {
        console.error('Failed to query central_db: ', err);

        // If central_db fails, try luzon_db and vismin_db
        try {
            const [luzonRows] = await luzon_db.execute(`
                SET autocommit=0;
                SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
                START TRANSACTION;

                SELECT * 
                FROM appointments;

                COMMIT;
            `);

            const [visminRows] = await vismin_db.execute(`
                SET autocommit=0;
                SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
                START TRANSACTION;

                SELECT * 
                FROM appointments;

                COMMIT;
            `);

            // Merge the results
            rows = [...luzonRows, ...visminRows];
        } catch (err) {
            console.error('Failed to query luzon_db or vismin_db: ', err);
            // Handle error...
        }
    }

    return rows;
}



export async function createAppointment(title, contents) {
    const [result] = await pool.execute(`
        INSERT INTO appointments (title, contents)
        VALUES (?, ?)
    ;`, [title, contents])

    const id = result.insertId

    // If need to return the created appointment
    // return getAppointment(id)

    return id
}



// Export Functions
export default {
    getAppointment,
    getAllAppointments,
    createAppointment
}