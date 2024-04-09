import mysql from 'mysql2'

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



// Test router
export async function test() {

    let rows = [];

    // Try central_db first
    try {
        await beginTransaction(central_db, "READ COMMITTED");
        let [rows] = await central_db.execute(`
            SELECT apt_id
            FROM appointments
            WHERE 
                apt_id % 2 = 1 AND
                island_group = 'Luzon'
            ORDER BY apt_id DESC
            LIMIT 1;
        `);
        await endTransaction(central_db);

        return rows[0];
    }
    catch (err) {
        console.error(err);
        return {error: err};
    }
}



// Ping all databases
export async function pingDatabases(db_list = ['central_db', 'luzon_db', 'vismin_db']) {

    let {
        central_db_status, 
        luzon_db_status, 
        vismin_db_status
    } = {central_db_status: false, luzon_db_status: false, vismin_db_status: false};

    if (db_list.includes('central_db')) {
        try {
            await central_db.execute(`SELECT 1;`)
            central_db_status = true
        } catch (err) {
            console.error('Failed to ping central_db: ', err)
        }
    }

    if (db_list.includes('luzon_db')) {
        try {
            await luzon_db.execute(`SELECT 1;`)
            luzon_db_status = true
        } catch (err) {
            console.error('Failed to ping luzon_db: ', err)
        }
    }

    if (db_list.includes('vismin_db')) {
        try {
            await vismin_db.execute(`SELECT 1;`)
            vismin_db_status = true
        } catch (err) {
            console.error('Failed to ping vismin_db: ', err)
        }
    }

    return {
        central_db_status,
        luzon_db_status,
        vismin_db_status
    }
}



// Get Reports
export async function getReports() {

    /* List of Reports:
        - Total Number of appointments
        - List of Clinics
        - Count of appointments marked as "Complete"
        - Average age of patients
        - Most popular doctor specialty with count
        - Count of appointments in each island group
    */

    // Get database connection status
    const db_status = await pingDatabases();

    let report = {};

    if (db_status.central_db_status) {
        try {

            // TODO: Replicate central_db Here
            const replication = await replicateDatabases();
            if (replication.error)
                return replication;

            var rows = [];

            await beginTransaction(central_db, "READ COMMITTED");

            // Get total number of appointments
            [rows] = await central_db.execute(`
                SELECT COUNT(*) AS total_appointments
                FROM appointments;
            `);
            report.total_appointments = rows[0].total_appointments;

            // Get list of clinics
            [rows] = await central_db.execute(`
                SELECT DISTINCT clinic_name
                FROM appointments;
            `);
            report.clinics = rows.map(row => row.clinic_name);

            // Get count of appointments marked as "Complete"
            [rows] = await central_db.execute(`
                SELECT COUNT(*) AS complete_appointments
                FROM appointments
                WHERE appointment_status = 'Complete';
            `);
            report.complete_appointments = rows[0].complete_appointments;

            // Get average age of patients
            [rows] = await central_db.execute(`
                SELECT AVG(patient_age) AS avg_patient_age
                FROM appointments;
            `);
            report.avg_patient_age = rows[0].avg_patient_age;
            report.avg_patient_age = Math.round(report.avg_patient_age * 100) / 100;

            // Get most popular doctor specialty with count
            [rows] = await central_db.execute(`
                SELECT doctor_specialty, COUNT(*) AS count
                FROM appointments
                GROUP BY doctor_specialty
                ORDER BY count DESC
                LIMIT 1;
            `);
            report.most_popular_doctor_specialty = rows[0].doctor_specialty;
            report.most_popular_doctor_specialty_count = rows[0].count;

            // Get count of appointments in Luzon
            [rows] = await central_db.execute(`
                SELECT COUNT(*) AS luzon_appointments
                FROM appointments
                WHERE island_group = 'Luzon';
            `);
            report.luzon_appointments = rows[0].luzon_appointments;

            // Get count of appointments in Visayas
            [rows] = await central_db.execute(`
                SELECT COUNT(*) AS visayas_appointments
                FROM appointments
                WHERE island_group = 'Visayas';
            `);
            report.visayas_appointments = rows[0].visayas_appointments;

            // Get count of appointments in Mindanao
            [rows] = await central_db.execute(`
                SELECT COUNT(*) AS mindanao_appointments
                FROM appointments
                WHERE island_group = 'Mindanao';
            `);
            report.mindanao_appointments = rows[0].mindanao_appointments;

            await endTransaction(central_db);

            return report;

        } catch (err) {
            await endTransaction(central_db, "ROLLBACK");
            console.error('Failed to query central_db: ', err);
            return {error: "Failed to query central_db"};
        }
    }

    // If central_db is down, try luzon_db and vismin_db
    if (db_status.luzon_db_status && db_status.vismin_db_status) {

        try {

            //TODO: Replicate luzon_db and vismin_db Here
            const replication = await replicateDatabases();
            if (replication.error)
                return replication;

            var lz_rows = [];
            var vm_rows = [];

            await beginTransaction(luzon_db, "READ COMMITTED");
            await beginTransaction(vismin_db, "READ COMMITTED");

            // Get total number of appointments
            [lz_rows] = await luzon_db.execute(`
                SELECT COUNT(*) AS total_appointments
                FROM appointments;
            `);
            [vm_rows] = await vismin_db.execute(`
                SELECT COUNT(*) AS total_appointments
                FROM appointments;
            `);
            report.total_appointments = lz_rows[0].total_appointments + vm_rows[0].total_appointments;

            // Get list of clinics
            [lz_rows] = await luzon_db.execute(`
                SELECT DISTINCT clinic_name
                FROM appointments;
            `);
            [vm_rows] = await vismin_db.execute(`
                SELECT DISTINCT clinic_name
                FROM appointments;
            `);
            report.clinics = [...lz_rows.map(row => row.clinic_name), ...vm_rows.map(row => row.clinic_name)];

            // Get count of appointments marked as "Complete"
            [lz_rows] = await luzon_db.execute(`
                SELECT COUNT(*) AS complete_appointments
                FROM appointments
                WHERE appointment_status = 'Complete';
            `);
            [vm_rows] = await vismin_db.execute(`
                SELECT COUNT(*) AS complete_appointments
                FROM appointments
                WHERE appointment_status = 'Complete';
            `);
            report.complete_appointments = lz_rows[0].complete_appointments + vm_rows[0].complete_appointments;

            // Get average age of patients
            [lz_rows] = await luzon_db.execute(`
                SELECT AVG(patient_age) AS avg_patient_age
                FROM appointments;
            `);
            [vm_rows] = await vismin_db.execute(`
                SELECT AVG(patient_age) AS avg_patient_age
                FROM appointments;
            `);
            report.avg_patient_age = (lz_rows[0].avg_patient_age + vm_rows[0].avg_patient_age) / 2;
            report.avg_patient_age = Math.round(report.avg_patient_age * 100) / 100;

            // Get most popular doctor specialty with count
            [lz_rows] = await luzon_db.execute(`
                SELECT doctor_specialty, COUNT(*) AS count
                FROM appointments
                GROUP BY doctor_specialty
            `);
            [vm_rows] = await vismin_db.execute(`
                SELECT doctor_specialty, COUNT(*) AS count
                FROM appointments
                GROUP BY doctor_specialty
            `);
            const specialties = [...lz_rows, ...vm_rows];
            const specialty_count = specialties.reduce((acc, row) => {
                acc[row.doctor_specialty] = (acc[row.doctor_specialty] || 0) + row.count;
                return acc;
            }, {});
            const most_popular_specialty = Object.keys(specialty_count).reduce((a, b) => specialty_count[a] > specialty_count[b] ? a : b);
            report.most_popular_doctor_specialty = most_popular_specialty;
            report.most_popular_doctor_specialty_count = specialty_count[most_popular_specialty];

            // Get count of appointments in Luzon
            [lz_rows] = await luzon_db.execute(`
                SELECT COUNT(*) AS luzon_appointments
                FROM appointments
                WHERE island_group = 'Luzon';
            `);
            report.luzon_appointments = lz_rows[0].luzon_appointments;

            // Get count of appointments in Visayas
            [vm_rows] = await vismin_db.execute(`
                SELECT COUNT(*) AS visayas_appointments
                FROM appointments
                WHERE island_group = 'Visayas';
            `);
            report.visayas_appointments = vm_rows[0].visayas_appointments;

            // Get count of appointments in Mindanao
            [vm_rows] = await vismin_db.execute(`
                SELECT COUNT(*) AS mindanao_appointments
                FROM appointments
                WHERE island_group = 'Mindanao';
            `);
            report.mindanao_appointments = vm_rows[0].mindanao_appointments;

            await endTransaction(luzon_db);
            await endTransaction(vismin_db);

            return report;

        } catch (err) {
            await endTransaction(luzon_db, "ROLLBACK");
            await endTransaction(vismin_db, "ROLLBACK");
            console.error('Failed to query luzon_db or vismin_db: ', err);
            return {error: "Failed to query luzon_db or vismin_db"};
        }
    }

    return {error: "More than 1 database is down"};
}




// Get appointment by ID
export async function getAppointment(apt_id) {

    let rows = [];

    // Try central_db first
    try {

        // TODO: Replicate central_db Here
        const replication = await replicateDatabases();
        if (replication.error)
            return replication;

        await beginTransaction(central_db, "READ COMMITTED");
        [rows] = await central_db.execute(`
            SELECT * 
            FROM appointments
            WHERE apt_id = ?;
        `, [apt_id])
        await endTransaction(central_db);

        if (!rows.length) {
            return {error: "Appointment does not exist in central_db"};
        }

        return rows[0];
    } 

    // If central_db fails, check if the appointment is in luzon_db or vismin_db
    catch (err) {
        console.error('Failed to query central_db: ', err);

        // Appointment in Luzon
        if (apt_id % 2 == 1) {
            try {

                // TODO: Replicate luzon_db Here
                const replication = await replicateDatabases();
                if (replication.error)
                    return replication;

                await beginTransaction(luzon_db, "READ COMMITTED");
                [rows] = await luzon_db.execute(`
                    SELECT *
                    FROM appointments
                    WHERE apt_id = ?;
                `, [apt_id])
                await endTransaction(luzon_db);

                if (!rows.length) {
                    return {error: "Appointment does not exist in luzon_db"};
                }

                return rows[0];
            } catch (err) {
                console.error('Failed to query luzon_db: ', err);
                return {error: "Failed to query luzon_db"};
            }
        }

        // Appointment in Visayas Mindanao
        else {
            try {

                // TODO: Replicate vismin_db Here
                const replication = await replicateDatabases();
                if (replication.error)
                    return replication;

                await beginTransaction(vismin_db, "READ COMMITTED");
                [rows] = await vismin_db.execute(`
                    SELECT *
                    FROM appointments
                    WHERE apt_id = ?;
                `, [apt_id])
                await endTransaction(vismin_db);

                if (!rows.length) {
                    return {error: "Appointment does not exist in vismin_db"};
                }

                return rows[0];
            } catch (err) {
                console.error('Failed to query vismin_db: ', err);
                return {error: "Failed to query vismin_db"};
            }
        }
    }
}



// Get all appointments
export async function getAllAppointments() {

    let rows = [];

    // Try central_db first
    try {

        //TODO: Replicate central_db Here
        const replication = await replicateDatabases();
        if (replication.error)
            return replication;

        await beginTransaction(central_db, "READ COMMITTED");
        [rows] = await central_db.execute(`
            SELECT * 
            FROM appointments;
        `);
        await endTransaction(central_db);
    } 
    
    // If central_db fails, try luzon_db and vismin_db
    catch (err) {
        console.error('Failed to query central_db: ', err);

        try {

            //TODO: Replicate luzon_db and vismin_db Here
            const replication = await replicateDatabases();
            if (replication.error)
                return replication;

            // Begin transactions
            await beginTransaction(luzon_db, "READ COMMITTED");
            await beginTransaction(vismin_db, "READ COMMITTED");

            const [luzonRows] = await luzon_db.execute(`
                SELECT *
                FROM appointments;
            `);
            
            const [visminRows] = await vismin_db.execute(`
            SELECT *
            FROM appointments;
            `);

            // End transactions
            await endTransaction(luzon_db);
            await endTransaction(vismin_db);

            // Merge the results
            rows = [...luzonRows, ...visminRows];
        } catch (err) {
            console.error('Failed to query luzon_db or vismin_db: ', err);
            return {error: "Failed to query all databases"};
        }
    }

    return rows;
}



// Add appointment operation to luzon_log table
async function addToLuzonLog(operation, db_status, appointment) {

    var rows = [];

    try {
        // Get the latest log_id from central_db and luzon_db
        let central_log_id;
        let luzon_log_id;
        if (db_status.central_db_status) {
            [rows] = await central_db.execute(`
                SELECT log_id
                FROM luzon_log
                ORDER BY log_id DESC
                LIMIT 1;
            `);
            if (!rows.length) {
                central_log_id = 1;
            } else {
                central_log_id = rows[0].log_id;
            }
        }
        if (db_status.luzon_db_status) {
            [rows] = await luzon_db.execute(`
                SELECT log_id
                FROM luzon_log
                ORDER BY log_id DESC
                LIMIT 1;
            `);
            if (!rows.length) {
                luzon_log_id = 1;
            } else {
                luzon_log_id = rows[0].log_id;
            }
        }

        // Throw error if central_db and luzon_db are not in sync
        if (db_status.central_db_status &&
            db_status.luzon_db_status &&
            central_log_id !== luzon_log_id) {
            // End transactions
            await endTransaction(central_db, "ROLLBACK");
            await endTransaction(luzon_db, "ROLLBACK");
            return {error: "Central and Luzon databases' luzon_log tables are not in sync"};
        }

        // Reset auto_increment of luzon_log table in central_db and luzon_db to the latest log_id
        if (db_status.central_db_status) {
            await central_db.execute(`
                ALTER TABLE luzon_log AUTO_INCREMENT = ${central_log_id};
            `);
        }
        if (db_status.luzon_db_status) {
            await luzon_db.execute(`
                ALTER TABLE luzon_log AUTO_INCREMENT = ${luzon_log_id};
            `);
        }

        // Insert appointment into central_db's and luzon_db's luzon_log tables
        if (db_status.central_db_status) {
            [rows] = await central_db.execute(`
                INSERT INTO luzon_log (operation, apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued)
                VALUES ('${operation}', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `, [appointment.apt_id, appointment.patient_name, appointment.patient_age, appointment.doctor_name, appointment.doctor_specialty, appointment.clinic_name, appointment.clinic_city, appointment.island_group, appointment.appointment_date, appointment.appointment_status, appointment.time_queued]);
            central_log_id = rows.insertId;
        }
        if (db_status.luzon_db_status) {
            [rows] = await luzon_db.execute(`
                INSERT INTO luzon_log (operation, apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued)
                VALUES ('${operation}', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `, [appointment.apt_id, appointment.patient_name, appointment.patient_age, appointment.doctor_name, appointment.doctor_specialty, appointment.clinic_name, appointment.clinic_city, appointment.island_group, appointment.appointment_date, appointment.appointment_status, appointment.time_queued]);
            luzon_log_id = rows.insertId;
        }

        // Throw error if central_db and luzon_db are not in sync
        if (db_status.central_db_status && 
            db_status.luzon_db_status && 
            central_log_id !== luzon_log_id) {
            // End transactions
            await endTransaction(central_db, "ROLLBACK");
            await endTransaction(luzon_db, "ROLLBACK");
            return {error: "Central and Luzon databases luzon_log tables are not in sync"};
        }

        return central_log_id;
    }
    catch (err) {
        console.error(err);
        return {error: err};
    }
}



// Add appointment operation to vismin_log table
async function addToVisMinLog(operation, db_status, appointment) {

    var rows = [];

    try {
        // Get the latest log_id from central_db and vismin_db
        let central_log_id;
        let vismin_log_id;
        if (db_status.central_db_status) {
            [rows] = await central_db.execute(`
                SELECT log_id
                FROM vismin_log
                ORDER BY log_id DESC
                LIMIT 1;
            `);
            if (!rows.length) {
                central_log_id = 1;
            } else {
                central_log_id = rows[0].log_id;
            }
        }
        if (db_status.vismin_db_status) {
            [rows] = await vismin_db.execute(`
                SELECT log_id
                FROM vismin_log
                ORDER BY log_id DESC
                LIMIT 1;
            `);
            if (!rows.length) {
                vismin_log_id = 1;
            } else {
                vismin_log_id = rows[0].log_id;
            }
        }

        // Throw error if central_db and vismin_db are not in sync
        if (db_status.central_db_status &&
            db_status.vismin_db_status &&
            central_log_id !== vismin_log_id) {
            // End transactions
            await endTransaction(central_db, "ROLLBACK");
            await endTransaction(vismin_db, "ROLLBACK");
            return {error: "Central and VisMin databases' vismin_log tables are not in sync"};
        }

        // Reset auto_increment of vismin_log table in central_db and vismin_db to the latest log_id
        if (db_status.central_db_status) {
            await central_db.execute(`
                ALTER TABLE vismin_log AUTO_INCREMENT = ${central_log_id};
            `);
        }
        if (db_status.vismin_db_status) {
            await vismin_db.execute(`
                ALTER TABLE vismin_log AUTO_INCREMENT = ${vismin_log_id};
            `);
        }

        // Insert appointment into central_db's and vismin_db's vismin_log tables
        if (db_status.central_db_status) {
            [rows] = await central_db.execute(`
                INSERT INTO vismin_log (operation, apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued)
                VALUES ('${operation}', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `, [appointment.apt_id, appointment.patient_name, appointment.patient_age, appointment.doctor_name, appointment.doctor_specialty, appointment.clinic_name, appointment.clinic_city, appointment.island_group, appointment.appointment_date, appointment.appointment_status, appointment.time_queued]);
            central_log_id = rows.insertId;
        }
        if (db_status.vismin_db_status) {
            [rows] = await vismin_db.execute(`
                INSERT INTO vismin_log (operation, apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued)
                VALUES ('${operation}', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `, [appointment.apt_id, appointment.patient_name, appointment.patient_age, appointment.doctor_name, appointment.doctor_specialty, appointment.clinic_name, appointment.clinic_city, appointment.island_group, appointment.appointment_date, appointment.appointment_status, appointment.time_queued]);
            vismin_log_id = rows.insertId;
        }

        // Throw error if central_db and vismin_db are not in sync
        if (db_status.central_db_status && 
            db_status.vismin_db_status && 
            central_log_id !== vismin_log_id) {
            // End transactions
            await endTransaction(central_db, "ROLLBACK");
            await endTransaction(vismin_db, "ROLLBACK");
            return {error: "Central and VisMin databases vismin_log tables are not in sync"};
        }

        return central_log_id;
    }
    catch (err) {
        console.error(err);
        return {error: err};
    }
}



// Create appointment
export async function createAppointment(appointment) {

    // Get database connection status
    const db_status = await pingDatabases();

    // Set time_queued to current time
    appointment.time_queued = new Date().toISOString().slice(0, 19).replace('T', ' ');

    var rows = [];
    
    // Check if appointment is Luzon or Visayas/Mindanao

    // If appointment is in Luzon
    if (appointment.island_group === "Luzon") {
        try{
            // Begin transactions
            await beginTransaction(central_db, "SERIALIZABLE");
            await beginTransaction(luzon_db, "SERIALIZABLE");

            //TODO: Replicate central_db and luzon_db Here
            const replication = await replicateDatabases();
            if (replication.error)
                return replication;

            // Get latest apt_id that is in Luzon from central_db and luzon_db
            let central_appt_id;
            let luzon_appt_id;
            if (db_status.central_db_status) {
                [rows] = await central_db.execute(`
                    SELECT apt_id
                    FROM appointments
                    WHERE 
                        apt_id % 2 = 1 AND
                        island_group = 'Luzon'
                    ORDER BY apt_id DESC
                    LIMIT 1;
                `);
                if (!rows.length) {
                    central_appt_id = 1;
                } else {
                    central_appt_id = rows[0].apt_id;
                }
            }
            if (db_status.luzon_db_status) {
                [rows] = await luzon_db.execute(`
                    SELECT apt_id
                    FROM appointments
                    WHERE 
                        apt_id % 2 = 1 AND
                        island_group = 'Luzon'
                    ORDER BY apt_id DESC
                    LIMIT 1;
                `);
                if (!rows.length) {
                    luzon_appt_id = 1;
                } else {
                    luzon_appt_id = rows[0].apt_id;
                }
            }

            // Throw error if central_db and luzon_db are not in sync
            if (db_status.central_db_status && 
                db_status.luzon_db_status && 
                central_appt_id !== luzon_appt_id) {
                // End transactions
                await endTransaction(central_db, "ROLLBACK");
                await endTransaction(luzon_db, "ROLLBACK");
                return {error: "Central and Luzon databases' appointment tables are not in sync"};
            }

            // Increment apt_id by 2
            appointment.apt_id = central_appt_id + 2;

            // Add appointment operation to luzon_log table
            const log_id = await addToLuzonLog('INSERT', db_status, appointment);

            // Check if log_id was successfully added to luzon_log table
            if (log_id.error) {
                return log_id;
            }

            // Insert appointment into central_db and luzon_db appointment tables from luzon_log tables
            if (db_status.central_db_status) {
                [rows] = await central_db.execute(`
                    INSERT INTO appointments (apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued)
                    SELECT apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued
                    FROM luzon_log
                    WHERE log_id = ?;
                `, [log_id]);
                central_appt_id = rows.insertId;
            }
            if (db_status.luzon_db_status) {
                [rows] = await luzon_db.execute(`
                    INSERT INTO appointments (apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued)
                    SELECT apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued
                    FROM luzon_log
                    WHERE log_id = ?;
                `, [log_id]);
                luzon_appt_id = rows.insertId;
            }

            // Throw error if central_db and luzon_db are not in sync
            if (db_status.central_db_status && 
                db_status.luzon_db_status && 
                central_appt_id !== luzon_appt_id) {
                // End transactions
                await endTransaction(central_db, "ROLLBACK");
                await endTransaction(luzon_db, "ROLLBACK");
                console.log("Central and Luzon databases' appointment tables are not in sync");
                return {error: "Central and Luzon databases' appointment tables are not in sync"};
            }

            // End transactions
            await endTransaction(central_db);
            await endTransaction(luzon_db);

            return {
                apt_id: appointment.apt_id,
                log_id: log_id
            };
        }
        catch (err) {
            // End transactions
            await endTransaction(central_db, "ROLLBACK");
            await endTransaction(luzon_db, "ROLLBACK");

            console.error(err);
            return {error: err};
        }
    }

    // If appointment is in Visayas/Mindanao
    else {
        try{
            // Begin transactions
            await beginTransaction(central_db, "SERIALIZABLE");
            await beginTransaction(vismin_db, "SERIALIZABLE");

            //TODO: Replicate central_db and vismin_db Here
            const replication = await replicateDatabases();
            if (replication.error)
                return replication;

            // Get latest apt_id that is in VisMin from central_db and vismin_db
            let central_appt_id;
            let vismin_appt_id;
            if (db_status.central_db_status) {
                [rows] = await central_db.execute(`
                    SELECT apt_id
                    FROM appointments
                    WHERE 
                        apt_id % 2 = 0 AND
                        island_group != 'Luzon'
                    ORDER BY apt_id DESC
                    LIMIT 1;
                `);
                if (!rows.length) {
                    central_appt_id = 1;
                } else {
                    central_appt_id = rows[0].apt_id;
                }
            }
            if (db_status.vismin_db_status) {
                [rows] = await vismin_db.execute(`
                    SELECT apt_id
                    FROM appointments
                    WHERE 
                        apt_id % 2 = 0 AND
                        island_group != 'Luzon'
                    ORDER BY apt_id DESC
                    LIMIT 1;
                `);
                if (!rows.length) {
                    vismin_appt_id = 1;
                } else {
                    vismin_appt_id = rows[0].apt_id;
                }
            }

            // Throw error if central_db and vismin_db are not in sync
            if (db_status.central_db_status && 
                db_status.vismin_db_status && 
                central_appt_id !== vismin_appt_id) {
                // End transactions
                await endTransaction(central_db, "ROLLBACK");
                await endTransaction(vismin_db, "ROLLBACK");
                return {error: "Central and VisMin databases' appointment tables are not in sync"};
            }

            // Increment apt_id by 2
            appointment.apt_id = central_appt_id + 2;

            // Add appointment operation to vismin_log table
            const log_id = await addToVisMinLog('INSERT', db_status, appointment);

            // Check if log_id was successfully added to vismin_log table
            if (log_id.error) {
                return log_id;
            }

            // Insert appointment into central_db and vismin_db appointment tables from vismin_log tables
            if (db_status.central_db_status) {
                [rows] = await central_db.execute(`
                    INSERT INTO appointments (apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued)
                    SELECT apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued
                    FROM vismin_log
                    WHERE log_id = ?;
                `, [log_id]);
                central_appt_id = rows.insertId;
            }
            if (db_status.vismin_db_status) {
                [rows] = await vismin_db.execute(`
                    INSERT INTO appointments (apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued)
                    SELECT apt_id, patient_name, patient_age, doctor_name, doctor_specialty, clinic_name, clinic_city, island_group, appointment_date, appointment_status, time_queued
                    FROM vismin_log
                    WHERE log_id = ?;
                `, [log_id]);
                vismin_appt_id = rows.insertId;
            }

            // Throw error if central_db and vismin_db are not in sync
            if (db_status.central_db_status && 
                db_status.vismin_db_status && 
                central_appt_id !== vismin_appt_id) {
                // End transactions
                await endTransaction(central_db, "ROLLBACK");
                await endTransaction(vismin_db, "ROLLBACK");
                console.log("Central and VisMin databases' appointment tables are not in sync");
                return {error: "Central and VisMin databases' appointment tables are not in sync"};
            }

            // End transactions
            await endTransaction(central_db);
            await endTransaction(vismin_db);

            return {
                apt_id: appointment.apt_id,
                log_id: log_id
            };
        }
        catch (err) {
            // End transactions
            await endTransaction(central_db, "ROLLBACK");
            await endTransaction(vismin_db, "ROLLBACK");

            console.error(err);
            return {error: err};
        }
    }
}



// Update appointment
export async function updateAppointment(appointment) {

    // Get database connection status
    const db_status = await pingDatabases();

    // Format appointment_date and time_queued
    appointment.appointment_date = appointment.appointment_date.slice(0, 10);
    appointment.time_queued = new Date().toISOString().slice(0, 19).replace('T', ' ');

    var rows = [];
    
    // Check if appointment is Luzon or Visayas/Mindanao

    // If appointment is in Luzon
    if (appointment.island_group === "Luzon") {
        try{
            // Begin transactions
            await beginTransaction(central_db, "SERIALIZABLE");
            await beginTransaction(luzon_db, "SERIALIZABLE");

            //TODO: Replicate central_db and luzon_db Here
            const replication = await replicateDatabases();
            if (replication.error)
                return replication;

            // Check if appointment exists in central_db and luzon_db
            let central_appt_id;
            let luzon_appt_id;
            if (db_status.central_db_status) {
                [rows] = await central_db.execute(`
                    SELECT apt_id
                    FROM appointments
                    WHERE apt_id = ?;
                `, [appointment.apt_id]);
                if (!rows.length) {
                    // End transactions
                    await endTransaction(central_db, "ROLLBACK");
                    await endTransaction(luzon_db, "ROLLBACK");
                    console.log("Appointment does not exist in central_db");
                    return {error: "Appointment does not exist in central_db"};
                }
                central_appt_id = rows[0].apt_id;
            }
            if (db_status.luzon_db_status) {
                [rows] = await luzon_db.execute(`
                    SELECT apt_id
                    FROM appointments
                    WHERE apt_id = ?;
                `, [appointment.apt_id]);
                if (!rows.length) {
                    // End transactions
                    await endTransaction(central_db, "ROLLBACK");
                    await endTransaction(luzon_db, "ROLLBACK");
                    console.log("Appointment does not exist in luzon_db");
                    return {error: "Appointment does not exist in luzon_db"};
                }
                luzon_appt_id = rows[0].apt_id;
            }

            // Throw error if central_db and luzon_db are not in sync
            if (db_status.central_db_status &&
                db_status.luzon_db_status &&
                central_appt_id !== luzon_appt_id) {
                // End transactions
                await endTransaction(central_db, "ROLLBACK");
                await endTransaction(luzon_db, "ROLLBACK");
                console.log("Central and Luzon databases' appointment tables are not in sync");
                return {error: "Central and Luzon databases' appointment tables are not in sync"};
            }

            // Add appointment operation to luzon_log table
            const log_id = await addToLuzonLog('UPDATE', db_status, appointment);

            // Check if log_id was successfully added to luzon_log table
            if (log_id.error) {
                return log_id;
            }

            // UPDATE appointment into central_db and luzon_db appointment tables from luzon_log tables
            if (db_status.central_db_status) {
                [rows] = await central_db.execute(`
                    UPDATE appointments
                    SET patient_name = ?, patient_age = ?, doctor_name = ?, doctor_specialty = ?, clinic_name = ?, clinic_city = ?, island_group = ?, appointment_date = ?, appointment_status = ?, time_queued = ?
                    WHERE apt_id = ?;
                `, [appointment.patient_name, appointment.patient_age, appointment.doctor_name, appointment.doctor_specialty, appointment.clinic_name, appointment.clinic_city, appointment.island_group, appointment.appointment_date, appointment.appointment_status, appointment.time_queued, appointment.apt_id]);
                central_appt_id = rows.insertId;
            }
            if (db_status.luzon_db_status) {
                [rows] = await luzon_db.execute(`
                    UPDATE appointments
                    SET patient_name = ?, patient_age = ?, doctor_name = ?, doctor_specialty = ?, clinic_name = ?, clinic_city = ?, island_group = ?, appointment_date = ?, appointment_status = ?, time_queued = ?
                    WHERE apt_id = ?;
                `, [appointment.patient_name, appointment.patient_age, appointment.doctor_name, appointment.doctor_specialty, appointment.clinic_name, appointment.clinic_city, appointment.island_group, appointment.appointment_date, appointment.appointment_status, appointment.time_queued, appointment.apt_id]);
                luzon_appt_id = rows.insertId;
            }

            // Throw error if central_db and luzon_db are not in sync
            if (db_status.central_db_status && 
                db_status.luzon_db_status && 
                central_appt_id !== luzon_appt_id) {
                // End transactions
                await endTransaction(central_db, "ROLLBACK");
                await endTransaction(luzon_db, "ROLLBACK");
                console.log("Central and Luzon databases' appointment tables are not in sync");
                return {error: "Central and Luzon databases' appointment tables are not in sync"};
            }

            // End transactions
            await endTransaction(central_db);
            await endTransaction(luzon_db);

            return {
                apt_id: appointment.apt_id,
                log_id: log_id
            };
        }
        catch (err) {
            // End transactions
            await endTransaction(central_db, "ROLLBACK");
            await endTransaction(luzon_db, "ROLLBACK");

            console.error(err);
            return {error: err};
        }
    }

    // If appointment is in Visayas/Mindanao
    else {
        try{
            // Begin transactions
            await beginTransaction(central_db, "SERIALIZABLE");
            await beginTransaction(vismin_db, "SERIALIZABLE");

            //TODO: Replicate central_db and vismin_db Here
            const replication = await replicateDatabases();
            if (replication.error)
                return replication;

            // Check if appointment exists in central_db and vismin_db
            let central_appt_id;
            let vismin_appt_id;
            if (db_status.central_db_status) {
                [rows] = await central_db.execute(`
                    SELECT apt_id
                    FROM appointments
                    WHERE apt_id = ?;
                `, [appointment.apt_id]);
                if (!rows.length) {
                    // End transactions
                    await endTransaction(central_db, "ROLLBACK");
                    await endTransaction(vismin_db, "ROLLBACK");
                    console.log("Appointment does not exist in central_db");
                    return {error: "Appointment does not exist in central_db"};
                }
                central_appt_id = rows[0].apt_id;
            }
            if (db_status.vismin_db_status) {
                [rows] = await vismin_db.execute(`
                    SELECT apt_id
                    FROM appointments
                    WHERE apt_id = ?;
                `, [appointment.apt_id]);
                if (!rows.length) {
                    // End transactions
                    await endTransaction(central_db, "ROLLBACK");
                    await endTransaction(vismin_db, "ROLLBACK");
                    console.log("Appointment does not exist in vismin_db");
                    return {error: "Appointment does not exist in vismin_db"};
                }
                vismin_appt_id = rows[0].apt_id;
            }

            // Throw error if central_db and vismin_db are not in sync
            if (db_status.central_db_status &&
                db_status.vismin_db_status &&
                central_appt_id !== vismin_appt_id) {
                // End transactions
                await endTransaction(central_db, "ROLLBACK");
                await endTransaction(vismin_db, "ROLLBACK");
                console.log("Central and VisMin databases' appointment tables are not in sync");
                return {error: "Central and VisMin databases' appointment tables are not in sync"};
            }

            // Add appointment operation to vismin_log table
            const log_id = await addToVisMinLog('UPDATE', db_status, appointment);

            // Check if log_id was successfully added to vismin_log table
            if (log_id.error) {
                return log_id;
            }

            // UPDATE appointment into central_db and vismin_db appointment tables from vismin_log tables
            if (db_status.central_db_status) {
                [rows] = await central_db.execute(`
                    UPDATE appointments
                    SET patient_name = ?, patient_age = ?, doctor_name = ?, doctor_specialty = ?, clinic_name = ?, clinic_city = ?, island_group = ?, appointment_date = ?, appointment_status = ?, time_queued = ?
                    WHERE apt_id = ?;
                `, [appointment.patient_name, appointment.patient_age, appointment.doctor_name, appointment.doctor_specialty, appointment.clinic_name, appointment.clinic_city, appointment.island_group, appointment.appointment_date, appointment.appointment_status, appointment.time_queued, appointment.apt_id]);
                central_appt_id = rows.insertId;
            }
            if (db_status.vismin_db_status) {
                [rows] = await vismin_db.execute(`
                    UPDATE appointments
                    SET patient_name = ?, patient_age = ?, doctor_name = ?, doctor_specialty = ?, clinic_name = ?, clinic_city = ?, island_group = ?, appointment_date = ?, appointment_status = ?, time_queued = ?
                    WHERE apt_id = ?;
                `, [appointment.patient_name, appointment.patient_age, appointment.doctor_name, appointment.doctor_specialty, appointment.clinic_name, appointment.clinic_city, appointment.island_group, appointment.appointment_date, appointment.appointment_status, appointment.time_queued, appointment.apt_id]);
                vismin_appt_id = rows.insertId;
            }

            // Throw error if central_db and vismin_db are not in sync
            if (db_status.central_db_status && 
                db_status.vismin_db_status && 
                central_appt_id !== vismin_appt_id) {
                // End transactions
                await endTransaction(central_db, "ROLLBACK");
                await endTransaction(vismin_db, "ROLLBACK");
                console.log("Central and VisMin databases' appointment tables are not in sync");
                return {error: "Central and VisMin databases' appointment tables are not in sync"};
            }

            // End transactions
            await endTransaction(central_db);
            await endTransaction(vismin_db);

            return {
                apt_id: appointment.apt_id,
                log_id: log_id
            };
        }
        catch (err) {
            // End transactions
            await endTransaction(central_db, "ROLLBACK");
            await endTransaction(vismin_db, "ROLLBACK");

            console.error(err);
            return {error: err};
        }
    }
}



// Delete appointment
export async function deleteAppointment(apt_id) {

    // Put the apt_id in appointment object
    const appointment = {
        apt_id: apt_id,
        patient_name: null,
        patient_age: null,
        doctor_name: null,
        doctor_specialty: null,
        clinic_name: null,
        clinic_city: null,
        island_group: null,
        appointment_date: null,
        appointment_status: null,
        time_queued: null
    }
    
    // Get database connection status
    const db_status = await pingDatabases();

    var rows = [];
    
    // Check if appointment is Luzon or Visayas/Mindanao

    // If appointment is in Luzon
    if (apt_id % 2 === 1) {
        try{
            // Begin transactions
            await beginTransaction(central_db, "SERIALIZABLE");
            await beginTransaction(luzon_db, "SERIALIZABLE");

            //TODO: Replicate central_db and luzon_db Here
            const replication = await replicateDatabases();
            if (replication.error)
                return replication;

            // Check if appointment exists in central_db and luzon_db
            let central_appt_id;
            let luzon_appt_id;
            if (db_status.central_db_status) {
                [rows] = await central_db.execute(`
                    SELECT apt_id
                    FROM appointments
                    WHERE apt_id = ?;
                `, [appointment.apt_id]);
                if (!rows.length) {
                    // End transactions
                    await endTransaction(central_db, "ROLLBACK");
                    await endTransaction(luzon_db, "ROLLBACK");
                    console.log("Appointment does not exist in central_db");
                    return {error: "Appointment does not exist in central_db"};
                }
                central_appt_id = rows[0].apt_id;
            }
            if (db_status.luzon_db_status) {
                [rows] = await luzon_db.execute(`
                    SELECT apt_id
                    FROM appointments
                    WHERE apt_id = ?;
                `, [appointment.apt_id]);
                if (!rows.length) {
                    // End transactions
                    await endTransaction(central_db, "ROLLBACK");
                    await endTransaction(luzon_db, "ROLLBACK");
                    console.log("Appointment does not exist in luzon_db");
                    return {error: "Appointment does not exist in luzon_db"};
                }
                luzon_appt_id = rows[0].apt_id;
            }

            // Throw error if central_db and luzon_db are not in sync
            if (db_status.central_db_status &&
                db_status.luzon_db_status &&
                central_appt_id !== luzon_appt_id) {
                // End transactions
                await endTransaction(central_db, "ROLLBACK");
                await endTransaction(luzon_db, "ROLLBACK");
                console.log("Central and Luzon databases' appointment tables are not in sync");
                return {error: "Central and Luzon databases' appointment tables are not in sync"};
            }

            // Add appointment operation to luzon_log table
            const log_id = await addToLuzonLog('DELETE', db_status, appointment);

            // Check if log_id was successfully added to luzon_log table
            if (log_id.error) {
                return log_id;
            }

            // DELETE appointment from central_db and luzon_db appointment tables from luzon_log tables
            if (db_status.central_db_status) {
                [rows] = await central_db.execute(`
                    DELETE FROM appointments
                    WHERE apt_id = ?;
                `, [apt_id]);
                central_appt_id = rows.insertId;
            }
            if (db_status.luzon_db_status) {
                [rows] = await luzon_db.execute(`
                    DELETE FROM appointments
                    WHERE apt_id = ?;
                `, [apt_id]);
                luzon_appt_id = rows.insertId;
            }

            // Throw error if central_db and luzon_db are not in sync
            if (db_status.central_db_status && 
                db_status.luzon_db_status && 
                central_appt_id !== luzon_appt_id) {
                // End transactions
                await endTransaction(central_db, "ROLLBACK");
                await endTransaction(luzon_db, "ROLLBACK");
                console.log("Central and Luzon databases' appointment tables are not in sync");
                return {error: "Central and Luzon databases' appointment tables are not in sync"};
            }

            // End transactions
            await endTransaction(central_db);
            await endTransaction(luzon_db);

            return {
                apt_id: appointment.apt_id,
                log_id: log_id
            };
        }
        catch (err) {
            // End transactions
            await endTransaction(central_db, "ROLLBACK");
            await endTransaction(luzon_db, "ROLLBACK");

            console.error(err);
            return {error: err};
        }
    }

    // If appointment is in Visayas/Mindanao
    else {
        try{
            // Begin transactions
            await beginTransaction(central_db, "SERIALIZABLE");
            await beginTransaction(vismin_db, "SERIALIZABLE");

            //TODO: Replicate central_db and vismin_db Here
            const replication = await replicateDatabases();
            if (replication.error)
                return replication;

            // Check if appointment exists in central_db and vismin_db
            let central_appt_id;
            let vismin_appt_id;
            if (db_status.central_db_status) {
                [rows] = await central_db.execute(`
                    SELECT apt_id
                    FROM appointments
                    WHERE apt_id = ?;
                `, [appointment.apt_id]);
                if (!rows.length) {
                    // End transactions
                    await endTransaction(central_db, "ROLLBACK");
                    await endTransaction(vismin_db, "ROLLBACK");
                    console.log("Appointment does not exist in central_db");
                    return {error: "Appointment does not exist in central_db"};
                }
                central_appt_id = rows[0].apt_id;
            }
            if (db_status.vismin_db_status) {
                [rows] = await vismin_db.execute(`
                    SELECT apt_id
                    FROM appointments
                    WHERE apt_id = ?;
                `, [appointment.apt_id]);
                if (!rows.length) {
                    // End transactions
                    await endTransaction(central_db, "ROLLBACK");
                    await endTransaction(vismin_db, "ROLLBACK");
                    console.log("Appointment does not exist in vismin_db");
                    return {error: "Appointment does not exist in vismin_db"};
                }
                vismin_appt_id = rows[0].apt_id;
            }

            // Throw error if central_db and vismin_db are not in sync
            if (db_status.central_db_status &&
                db_status.vismin_db_status &&
                central_appt_id !== vismin_appt_id) {
                // End transactions
                await endTransaction(central_db, "ROLLBACK");
                await endTransaction(vismin_db, "ROLLBACK");
                console.log("Central and VisMin databases' appointment tables are not in sync");
                return {error: "Central and VisMin databases' appointment tables are not in sync"};
            }

            // Add appointment operation to vismin_log table
            const log_id = await addToVisMinLog('DELETE', db_status, appointment);

            // Check if log_id was successfully added to vismin_log table
            if (log_id.error) {
                return log_id;
            }

            // DELETE appointment from central_db and vismin_db appointment tables from vismin_log tables
            if (db_status.central_db_status) {
                [rows] = await central_db.execute(`
                    DELETE FROM appointments
                    WHERE apt_id = ?;
                `, [apt_id]);
                central_appt_id = rows.insertId;
            }
            if (db_status.vismin_db_status) {
                [rows] = await vismin_db.execute(`
                    DELETE FROM appointments
                    WHERE apt_id = ?;
                `, [apt_id]);
                vismin_appt_id = rows.insertId;
            }

            // Throw error if central_db and vismin_db are not in sync
            if (db_status.central_db_status && 
                db_status.vismin_db_status && 
                central_appt_id !== vismin_appt_id) {
                // End transactions
                await endTransaction(central_db, "ROLLBACK");
                await endTransaction(vismin_db, "ROLLBACK");
                console.log("Central and VisMin databases' appointment tables are not in sync");
                return {error: "Central and VisMin databases' appointment tables are not in sync"};
            }

            // End transactions
            await endTransaction(central_db);
            await endTransaction(vismin_db);

            return {
                apt_id: appointment.apt_id,
                log_id: log_id
            };
        }
        catch (err) {
            // End transactions
            await endTransaction(central_db, "ROLLBACK");
            await endTransaction(vismin_db, "ROLLBACK");

            console.error(err);
            return {error: err};
        }
    }
}



// Export Functions
export default {
    test,
    pingDatabases,
    getReports,
    getAppointment,
    getAllAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
}