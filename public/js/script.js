function addEmployee() {
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;

    fetch('/employee/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            loadEmployees();
        } else {
            alert(data.message);
        }
    });
}

function loadEmployees() {
    fetch('/employee/list').then(response => response.json()).then(data => {
        const employeeList = document.getElementById('employeeList');
        employeeList.innerHTML = '';
        data.forEach(employee => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${employee.name}</strong> - ${employee.role} <button onclick="deleteEmployee('${employee.id}')">Delete</button>`;
            employeeList.appendChild(div);
        });
    });
}

function deleteEmployee(id) {
    fetch(`/employee/delete/${id}`, { method: 'DELETE' }).then(response => response.json()).then(data => {
        if (data.success) {
            loadEmployees();
        } else {
            alert(data.message);
        }
    });
}

document.addEventListener('DOMContentLoaded', loadEmployees);
