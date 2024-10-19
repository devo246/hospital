let empId = 1; // To keep track of the employee ID
let employees = []; // Store employees in a global variable
let currentEditId = null; // To track the employee being edited

// Load employees from local storage when the page loads
window.onload = function() {
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    empId = storedEmployees.length ? Math.max(...storedEmployees.map(emp => emp.id)) + 1 : 1;
    employees = storedEmployees;
    storedEmployees.forEach(employee => addRowToTable(employee));
};

function addEmp() {
    // Get values from input fields
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const phone = document.getElementById('phone').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const profession = document.getElementById('profession').value;
    const specialization = document.getElementById('specialization').value;
    const residence = document.getElementById('residence').value;

    // Get the image file
    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];

    // Validate input fields
    if (!name || !age || !phone || !gender || !profession || !specialization || !residence || !imageFile) {
        alert("Please fill in all fields before adding or editing an employee.");
        return; // Exit the function if validation fails
    }

    // If we're editing an existing employee
    if (currentEditId !== null) {
        const employeeIndex = employees.findIndex(emp => emp.id === currentEditId);
        employees[employeeIndex] = {
            id: currentEditId,
            name,
            age,
            phone,
            gender,
            profession,
            specialization,
            residence,
            image: URL.createObjectURL(imageFile) // Create a temporary URL for the uploaded image
        };

        // Update local storage
        localStorage.setItem('employees', JSON.stringify(employees));

        // Refresh the table
        renderTable();

        // Clear the current edit ID
        currentEditId = null;
    } else {
        // Create new employee object
        const employee = {
            id: empId,
            name,
            age,
            phone,
            gender,
            profession,
            specialization,
            residence,
            image: URL.createObjectURL(imageFile) // Create a temporary URL for the uploaded image
        };

        // Save new employee to local storage
        employees.push(employee);
        localStorage.setItem('employees', JSON.stringify(employees));

        addRowToTable(employee); // Add employee to table
        empId++; // Increment the employee ID
    }

    // Clear the input fields after adding or editing
    clearInputFields();
}

function clearInputFields() {
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('phone').value = '';
    document.querySelectorAll('input[name="gender"]').forEach(input => input.checked = false);
    document.getElementById('profession').value = '';
    document.getElementById('specialization').value = '';
    document.getElementById('residence').value = '';
    document.getElementById('image').value = ''; // Clear file input
}

function addRowToTable(employee) {
    const table = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    // Add row number
    const rowCount = table.rows.length;
    newRow.insertCell(0).innerText = rowCount; // Row number
    newRow.insertCell(1).innerText = employee.id;
    newRow.insertCell(2).innerText = employee.name;
    newRow.insertCell(3).innerText = employee.age;
    newRow.insertCell(4).innerText = employee.phone;
    newRow.insertCell(5).innerText = employee.gender;
    newRow.insertCell(6).innerText = employee.profession;
    newRow.insertCell(7).innerText = employee.specialization;
    newRow.insertCell(8).innerText = employee.residence;

    const imgCell = newRow.insertCell(9);
    const imgElement = document.createElement('img');
    imgElement.src = employee.image; // Set the image source
    imgCell.appendChild(imgElement);

    const actionsCell = newRow.insertCell(10);
    actionsCell.classList.add('action-buttons');
    actionsCell.innerHTML = `
        <button onclick="editEmp(${employee.id})">Edit</button>
        <button onclick="deleteEmp(${employee.id})">Delete</button>
    `;
}

function editEmp(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        document.getElementById('name').value = employee.name;
        document.getElementById('age').value = employee.age;
        document.getElementById('phone').value = employee.phone;
        document.querySelector(`input[name="gender"][value="${employee.gender}"]`).checked = true;
        document.getElementById('profession').value = employee.profession;
        document.getElementById('specialization').value = employee.specialization;
        document.getElementById('residence').value = employee.residence;

        // Set the current edit ID to the employee being edited
        currentEditId = id;
    }
}

function deleteEmp(id) {
    const employee = employees.find(emp => emp.id === id);
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
        employees = employees.filter(emp => emp.id !== id);
        localStorage.setItem('employees', JSON.stringify(employees));
        renderTable(); // Refresh the table
    }
}

function renderTable() {
    const table = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear existing rows
    employees.forEach(employee => addRowToTable(employee)); // Re-add rows
}

function searchEmployee() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredEmployees = employees.filter(employee => {
        return employee.name.toLowerCase().includes(searchInput) || employee.id.toString() === searchInput;
    });
    
    const table = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear existing rows
    filteredEmployees.forEach(employee => addRowToTable(employee)); // Add filtered rows

    // Show error message if no employees found
    const errorMessage = document.getElementById('errorMessage');
    if (filteredEmployees.length === 0) {
        errorMessage.style.display = 'block'; // Show error message
    } else {
        errorMessage.style.display = 'none'; // Hide error message
    }
}

function resetSearch() {
    document.getElementById('searchInput').value = ''; // Clear search input
    renderTable(); // Re-render the full table
    document.getElementById('errorMessage').innerHTML=""
}
