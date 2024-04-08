import mysql from 'mysql2'

// Import Database Connections
import {
    central_db,
    luzon_db,
    vismin_db
} from './db_connections.js'
import database from "./database.js"

async function dbReplication(listOfUpdates) {
    //iterate over the listOfUpdates
    for (let index = 0; index < listOfUpdates.length; index++) {
        //iterate over the arrays inside and do an execute statement
        //Steps:
        //- Get the operation
        //- Apply the operation
    }
}

//Replication Functions
export async function replicateDatabases(listOfDBs) {
    //Ping the related databases
    const serverStatuses = database.pingDatabases(listofDBs);

    //per case replication
    if (serverStatuses.contains('central_status')) {
        if (serverStatuses.contains('luzon_status')) {
            //luzon
            //check if both are databases are online
            if (Object.values(serverStatuses).every(item => item === true)) {
                //both are online, therefore check for replication
                const central_l_log = await central_db.execute(`
                    SELECT log_id
                    FROM luzon_log
                    ORDER BY log_id DESC
                    LIMIT 1;
                `);
                const luzon_l_log = await luzon_db.execute(`
                    SELECT log_id
                    FROM luzon_log
                    ORDER BY log_id DESC
                    LIMIT 1; 
                `);

                if (luzon_l_log.log_id === central_l_log.log_id) {
                    //checks if the entries are the same, meaning that they're synchronized
                    return console.log('SYNCHONIZED DATABASES: both databases have the latest logs.')
                } else {
                    //begin replication process 
                    //Check who's later
                    if (luzon_l_log.log_id > central_l_log.log_id) {
                        const update = await luzon_db.execute(`
                        SELECT *
                        FROM luzon_log
                        WHERE log_id > ?; 
                        `, [central_l_log.log_id]);
                        //update central with the new data
                    } else {
                        const update = await central_db.execute(`
                        SELECT *
                        FROM luzon_log
                        WHERE log_id > ?; 
                        `, [luzon_l_log.log_id]);
                        //update luzon with the new data


                    }
                }
            } else {
                //only one is online
                console.log('SINGLE CASE: Only one database is currently online for usage.')
            }
        } else {
            //visayas-mindanao
            if (Object.values(serverStatuses).every(item => item === true)) {
                //both are online, therefore check for replication
            } else {
                //only one is online
                console.log('SINGLE CASE: Only one database is currently online for usage.')
            }
        }
    }
    

};