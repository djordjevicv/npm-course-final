//GLOBAL VARIABLES

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
let isSecured = false;

const form = document.querySelector('form');
const tbody = document.querySelector('tbody');
const emailInput = document.querySelector('#exampleInputEmail1');
const usernameInput = document.querySelector('#exampleInputUsername1');
const passwordInput = document.querySelector('#exampleInputPassword1');
const secureButton = document.querySelector('#secure');
const h1 = document.querySelector('h1');

const data = [
    {
        email: 'pera@gmail.com', 
        username: 'pera', 
        password: 'pera123'
    },
    {
        email: 'mika@gmail.com', 
        username: 'mika', 
        password: 'mika123'
    },
    {
        email: 'laza123@gmail.com',
        username: 'laza',
        password: 'pera123'
    }
];

//FUNCTIONS

const isFormDataValid = (email, username, password) => {
    if (!(email.toLowerCase().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) ||
            username === '' ||
            password === '') 
        return false;
        
    return true;
}

const clearForm = () => {
    emailInput.value = '';
    usernameInput.value = '';
    passwordInput.value = '';
}

const createAndPopulateTableRow = (index) => {
    const tr = document.createElement("tr");

    const indexField = document.createElement("td");
    indexField.textContent = `${index + 1}`;

    const emailField = document.createElement("td");
    emailField.textContent = data[index].email;

    const usernameField = document.createElement("td");
    usernameField.textContent = data[index].username;

    const passwordField = document.createElement("td");
    passwordField.textContent = data[index].password;

    tr.append(indexField);
    tr.append(usernameField);
    tr.append(emailField);
    tr.append(passwordField);

    return tr;
}

const includesEmail = (data, emailInputValue) => data.some(user => user.email === emailInputValue);
const includesUsername = (data, usernameInputValue) => data.some(user => user.username === usernameInputValue);

//EVENT LISTENERS

form.addEventListener('submit', (e) => {

    e.preventDefault();

    if (e.submitter.id !== 'submitButton')
        return;

    if (!isFormDataValid(emailInput.value, usernameInput.value, passwordInput.value)) {
        alert('invalid data submission');
        return;
    }

    if (includesEmail(data, emailInput.value)) {
        alert('email already exists');
        return;
    }

    if (includesUsername(data, usernameInput.value)) {
        alert('username already exists');
        return;
    }

    let passwordToInsert = isSecured ? 
        bcrypt.hashSync(passwordInput.value, salt) : 
        passwordInput.value;

    data.push({
            email:emailInput.value.trim(),
            username: usernameInput.value.trim(),
            password: passwordToInsert
    });

    const tr = createAndPopulateTableRow(data.length - 1);

    clearForm();

    tbody.append(tr);
});

const handleSecure = () => {

    if(isSecured)
        return;

    isSecured = true;
    h1.textContent = 'Secure mode: On';

    tbody.innerHTML = '';
    data.forEach((user, index) => {
        user.password = bcrypt.hashSync(user.password, salt);
        tbody.append(createAndPopulateTableRow(index,
            user.email,
            user.username,
            user.password
        ))
    })
}

secureButton.addEventListener('click', handleSecure);

data.forEach((user, index) => {
    tbody.append(createAndPopulateTableRow(index));
});

