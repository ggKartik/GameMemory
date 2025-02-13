const mongoose = require("mongoose");

// Get the connection string from environment variables
const cluster = process.env.db;

mongoose.connect(cluster)
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

module.exports = mongoose;
