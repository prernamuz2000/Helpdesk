const mongoose = require('mongoose')
require('dotenv').config();

const connectToMongoDB = async () => {
	
	try {
		console.log('db uri',process.env.DB_URI);
		await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017');
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

module.exports =connectToMongoDB
