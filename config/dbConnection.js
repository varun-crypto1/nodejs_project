const mysql = require('mysql'); // or 'mysql2'

const connection = mysql.createConnection({
    host: process.env.DB_HOST, // Ensure this environment variable is set
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message); // Log the error for better debugging
        process.exit(1); // Exit the process if the database connection fails
    }
    console.log('Connected to the database.');
});

module.exports = connection;
