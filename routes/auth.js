const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const router = express.Router();

const usersFile = './data/users.json';

// Load users from JSON file
function loadUsers() {
    if (fs.existsSync(usersFile)) {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data);
    } else {
        return [];
    }
}

// Save users to JSON file
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect('/employee');
    } else {
        res.render('login', { message: 'Invalid username or password' });
    }
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    if (users.find(u => u.username === username)) {
        res.render('signup', { message: 'Username already exists' });
    } else {
        const hashedPassword = bcrypt.hashSync(password, 8);
        users.push({ username, password: hashedPassword });
        saveUsers(users);
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
