const convertCsvToJson = require("./importCsvToMongo");

async function storeEmployee() {
  const csvFilePath = "./db/Employee.csv"; // Replace with your CSV file path
  const importCsvToMongoDB = "./importCsvToMongo.js";

  try {
    convertCsvToJson(csvFilePath);
    console.log("Import completed");
    // console.log('User Data:', storeUsers); // Access the user data
  } catch (error) {
    console.error("Import failed:", error);
  }
}

module.exports = storeEmployee;
