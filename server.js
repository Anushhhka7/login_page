const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});


// Middleware
app.use(bodyParser.json());
app.use(express.static('.'));

// Create Users Table
db.run('CREATE TABLE users (username TEXT, password TEXT)');

// Register Endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
        if (err) return res.status(500).send('Error registering user.');
        res.send('User registered successfully.');
    });
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err || !row) return res.status(401).send('Invalid username or password.');
        res.send('Login successful.');
    });
});

// Start Server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
