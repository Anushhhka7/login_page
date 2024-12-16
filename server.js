const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const port = 3000;

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Check if the 'users' table exists, and create it if it doesn't
db.run(
    `CREATE TABLE IF NOT EXISTS users (
        username TEXT UNIQUE, 
        password TEXT
    )`,
    (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Database setup complete.');
        }
    }
);

// Route for the homepage
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Login System</h1>
        <form action="/register" method="post">
            <h2>Register</h2>
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Register</button>
        </form>
        <form action="/login" method="post">
            <h2>Login</h2>
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
    `);
});

// Route for user registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, password],
        (err) => {
            if (err) {
                console.error('Error during registration:', err.message);
                res.send('Username already exists. Please try a different one.');
            } else {
                res.send('Registration successful! You can now log in.');
            }
        }
    );
});

// Route for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(
        `SELECT * FROM users WHERE username = ? AND password = ?`,
        [username, password],
        (err, row) => {
            if (err) {
                console.error('Error during login:', err.message);
                res.send('An error occurred during login. Please try again.');
            } else if (row) {
                res.send(`Welcome, ${username}! Login successful.`);
            } else {
                res.send('Invalid username or password. Please try again.');
            }
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
