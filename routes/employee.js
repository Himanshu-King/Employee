const express = require('express');
const fs = require('fs');
const router = express.Router();

const employeesFile = './data/employees.json';

function loadEmployees() {
    if (fs.existsSync(employeesFile)) {
        const data = fs.readFileSync(employeesFile, 'utf8');
        return JSON.parse(data);
    } else {
        return [];
    }
}

function saveEmployees(employees) {
    fs.writeFileSync(employeesFile, JSON.stringify(employees, null, 2));
}

router.use((req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
});

router.get('/', (req, res) => {
    res.render('employee');
});

router.post('/add', (req, res) => {
    const employees = loadEmployees();
    const newEmployee = {
        id: Date.now().toString(),
        name: req.body.name,
        role: req.body.role
    };
    employees.push(newEmployee);
    saveEmployees(employees);
    res.json({ success: true });
});

router.get('/list', (req, res) => {
    const employees = loadEmployees();
    res.json(employees);
});

router.delete('/delete/:id', (req, res) => {
    let employees = loadEmployees();
    employees = employees.filter(emp => emp.id !== req.params.id);
    saveEmployees(employees);
    res.json({ success: true });
});

module.exports = router;
