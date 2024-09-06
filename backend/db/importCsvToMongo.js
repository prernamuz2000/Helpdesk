const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require("bcrypt");

const { generateRandomPassword } = require('../utils/utils');
const Userss = require('../models/Userss');



// Function to read CSV and insert data into MongoDB
function convertCsvToJson (csvFilePath){
   

    try {
       // await client.connect();
       // const database = client.db('yourDatabaseName'); // Replace with your database name
       // const collection = database.collection('yourCollectionName'); // Replace with your collection name

        const records = [];
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', async (row) => {
                // Filter and store fields you need
                const { 'First Name': firstName, 'Last Name': lastName, Email, 'Employee id': employeeId, Role } = row;
                const password = firstName+generateRandomPassword(8);

               // const hashedNewPassword = await bcrypt.hash(password, 10);

                // Insert only if Role is 'TPM' or empty
                const roleTrimmed = Role ? Role.trim() : 'Employee';
                console.log('roleTrimmed',roleTrimmed);
                
                if (roleTrimmed) {
                    records.push({
                        empname:firstName+" "+lastName,
                        empid:employeeId,
                        email: Email,
                        password,
                        role: roleTrimmed
                    });
                }
            })
            .on('end', async () => {
                if (records.length > 0) {
                   // await collection.insertMany(records);
                    console.log('CSV data successfully imported into MongoDB.',records);
                    await Userss.insertMany(records);
                } else {
                    console.log('No data to import.');
                }
              
            });
    } catch (err) {
        console.error('Error importing CSV data:', err);
        //await client.close(); // Ensure the connection is closed even on error
    }
}

module.exports = convertCsvToJson;
//now exporting function

