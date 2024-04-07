import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()



const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.PORT
}).promise()



export async function getAppointment(id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM appointments
        WHERE apptid = ?
    ;`, [id])

    return rows[0]
}

export async function getAllAppointments() {
    const [rows] = await pool.query(`
        SELECT * 
        FROM appointments
    ;`)

    return rows
}



export async function createAppointment(title, contents) {
    const [result] = await pool.query(`
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