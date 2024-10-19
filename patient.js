let patientId = 1; // ترقيم المرضى
let patients = [];
let nextId = 1; // معرف خاص لعدم تكرار الـ id حتى بعد الحذف
let editingPatientId = null; // لتخزين معرف المريض أثناء التعديل

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('admissionDate').value = today; // تعيين تاريخ القبول إلى اليوم
    loadPatientsFromLocalStorage(); // تحميل المرضى من التخزين المحلي
});

function loadPatientsFromLocalStorage() {
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
        patients = JSON.parse(storedPatients);
        patients.forEach((patient, index) => addRowToTable(patient, index + 1));
        nextId = patients.length ? Math.max(...patients.map(p => p.id)) + 1 : 1; // تحديث nextId بناءً على أكبر id
    }
}

function addPatient() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const phone = document.getElementById('phone').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const admissionDate = document.getElementById('admissionDate').value;
    const dischargeDate = document.getElementById('dischargeDate').value;
    const maritalStatus = document.getElementById('maritalStatus').value;
    const caseManager = document.getElementById('caseManager').value;
    const medicalDiagnosis = document.getElementById('medicalDiagnosis').value;

    if (!name || !age || !phone || !gender || !admissionDate || !dischargeDate || !maritalStatus || !caseManager || !medicalDiagnosis) {
        alert("Please fill in all fields before adding a patient.");
        return;
    }

    const newPatient = {
        id: nextId++, // استخدام الـ nextId كـ id المريض
        name,
        age,
        phone,
        gender,
        admissionDate,
        dischargeDate,
        maritalStatus,
        caseManager,
        medicalDiagnosis,
        status: 'active'
    };

    if (editingPatientId) { // إذا كنا في وضع التعديل
        // تحديث بيانات المريض القديم
        const patientIndex = patients.findIndex(patient => patient.id === editingPatientId);
        if (patientIndex !== -1) {
            patients[patientIndex] = newPatient; // تحديث البيانات
            editingPatientId = null; // إعادة تعيين معرف التعديل
        }
    } else {
        patients.push(newPatient); // إضافة مريض جديد
    }

    localStorage.setItem('patients', JSON.stringify(patients));
    refreshTable(); // تحديث الجدول
    clearForm();

    // الانتقال إلى صفحة السجل الطبي
    window.location.href = `medicalDiagnosis.html?patientId=${newPatient.id}`;
}

function refreshTable() {
    const tableBody = document.querySelector("#patientTable tbody");
    tableBody.innerHTML = ''; // مسح الجدول الحالي
    patients.forEach((patient, index) => addRowToTable(patient, index + 1)); // إعادة ملء الجدول
}

function goToDiagnosis(id) {
    window.location.href = `medicalDiagnosis.html?patientId=${id}`;
}

function goToNursingCare(id) {
    window.location.href = `nursingCare.html?patientId=${id}`;
}

function addRowToTable(patient, rowIndex) {
    const tableBody = document.querySelector("#patientTable tbody");
    const row = document.createElement("tr");
    row.setAttribute('data-id', patient.id);
    row.innerHTML = `
        <td>${rowIndex}</td>
        <td>${patient.id}</td>
        <td>${patient.name}</td>
        <td>${patient.age}</td>
        <td>${patient.phone}</td>
        <td>${patient.gender}</td>
        <td>${patient.admissionDate}</td>
        <td>${patient.dischargeDate}</td>
        <td>${patient.maritalStatus}</td>
        <td>${patient.caseManager}</td>
        <td>${patient.medicalDiagnosis}</td>
        <td>
            <div class="button-container">
                <button class="deceased" onclick="markDeceased(${patient.id})">Deceased</button>
                <button class="recovered" onclick="markRecovered(${patient.id})">Recovered</button>
                <button class="reset" onclick="resetBackground(${patient.id})">Reset</button>
                <button class="edit" onclick="editPatient(${patient.id})">Edit</button>
                <button class="delete" onclick="confirmDelete(${patient.id})">Delete</button>
                <button class="diagnosis" onclick="goToDiagnosis(${patient.id})">Diagnosis</button>
                <button class="nursingCare" onclick="goToNursingCare(${patient.id})">Nursing Care</button>
            </div>
        </td>
    `;
    tableBody.appendChild(row);
}

function markDeceased(id) {
    const row = document.querySelector(`#patientTable tbody tr[data-id='${id}']`);
    if (row) {
        row.classList.add('highlight-deceased');
    }
}

function markRecovered(id) {
    const row = document.querySelector(`#patientTable tbody tr[data-id='${id}']`);
    if (row) {
        row.classList.add('highlight-recovered');
    }
}

function resetBackground(id) {
    const row = document.querySelector(`#patientTable tbody tr[data-id='${id}']`);
    if (row) {
        row.classList.remove('highlight-deceased', 'highlight-recovered');
    }
}

function confirmDelete(id) {
    const confirmed = confirm("Are you sure you want to delete this patient?");
    if (confirmed) {
        deletePatient(id);
    }
}

function deletePatient(id) {
    patients = patients.filter(patient => patient.id !== id);
    localStorage.setItem('patients', JSON.stringify(patients));
    refreshTable(); // تحديث الجدول بعد الحذف
}

function editPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (patient) {
        document.getElementById('name').value = patient.name;
        document.getElementById('age').value = patient.age;
        document.getElementById('phone').value = patient.phone;
        document.querySelector(`input[name="gender"][value="${patient.gender}"]`).checked = true;
        document.getElementById('admissionDate').value = patient.admissionDate;
        document.getElementById('dischargeDate').value = patient.dischargeDate;
        document.getElementById('maritalStatus').value = patient.maritalStatus;
        document.getElementById('caseManager').value = patient.caseManager;
        document.getElementById('medicalDiagnosis').value = patient.medicalDiagnosis;
        editingPatientId = patient.id; // تعيين معرف المريض للتعديل
    }
}

function searchPatients() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) || 
        patient.id.toString().includes(searchTerm)
    );
    
    // مسح الجدول الحالي
    const tableBody = document.querySelector("#patientTable tbody");
    tableBody.innerHTML = '';
    
    // تحقق من نتائج البحث
    if (filteredPatients.length === 0) {
        displayErrorMessage(true); // إظهار رسالة الخطأ
    } else {
        displayErrorMessage(false); // إخفاء رسالة الخطأ
        filteredPatients.forEach((patient, index) => addRowToTable(patient, index + 1));
    }
}

function resetSearch() {
    document.getElementById('searchInput').value = '';
    refreshTable(patients); // إعادة تعبئة الجدول بجميع المرضى
    displayErrorMessage(false); // إخفاء رسالة الخطأ
}

function displayErrorMessage(show) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = show ? 'block' : 'none'; // عرض أو إخفاء رسالة الخطأ
}


function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('phone').value = '';
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById('admissionDate').value = '';
    document.getElementById('dischargeDate').value = '';
    document.getElementById('maritalStatus').value = '';
    document.getElementById('caseManager').value = '';
    document.getElementById('medicalDiagnosis').value = '';
}
