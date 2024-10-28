const passwordField     = document.getElementById('password');
const copyBtn           = document.getElementById('copyBtn');
const lengthSlider      = document.getElementById('passwordLength');
const lengthValue       = document.getElementById('lengthValue');
const strengthIndicator = document.getElementById('strengthIndicator');
const strengthImage     = document.getElementById('strengthImage');

const includeUppercase  = document.getElementById('includeUppercase');
const includeLowercase  = document.getElementById('includeLowercase');
const includeNumbers    = document.getElementById('includeNumbers');
const includeSymbols    = document.getElementById('includeSymbols');

// Character sets for generating password
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS   = '0123456789';
const SYMBOLS   = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Event listener for the password length slider (automatically generates password)
lengthSlider.addEventListener('input', function() {
    updateLength();
    generatePassword(); // Automatically generates password when the slider is moved
});

// Event listener for copying password to clipboard
copyBtn.addEventListener('click', function() {
    passwordField.select();
    document.execCommand('copy');
    alert('Password copied to clipboard!'); // Notif when password is copied
});

// Function to generate random password
function generatePassword() {
    const length = lengthSlider.value;
    const includeUppercaseChecked = includeUppercase.checked;
    const includeLowercaseChecked = includeLowercase.checked;
    const includeNumbersChecked   = includeNumbers.checked;
    const includeSymbolsChecked   = includeSymbols.checked;

    let charSet = '';
    if (includeUppercaseChecked) charSet += UPPERCASE;
    if (includeLowercaseChecked) charSet += LOWERCASE;
    if (includeNumbersChecked)   charSet += NUMBERS;
    if (includeSymbolsChecked)   charSet += SYMBOLS;

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    passwordField.value = password;
    evaluateStrength(password); // Update the password strength
}

// Function to update the length displayed next to the slider
function updateLength() {
    lengthValue.textContent = lengthSlider.value;
}

// Event listener for the dropdown buttons (show/hide additional options)
document.querySelectorAll('.dropdown-btn').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
        let content = button.nextElementSibling;
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
});

// Function to evaluate the strength of the password and update the UI
function evaluateStrength(password) {
    let strength = 0;

    // Password length factors heavily into strength
    if (password.length >= 8 && password.length <= 12) strength += 1;
    else if (password.length > 12) strength += 2;

    // Strength increases based on character variety
    if (/[A-Z]/.test(password))         strength++; // Uppercase
    if (/[a-z]/.test(password))         strength++; // Lowercase
    if (/\d/.test(password))            strength++; // Numbers
    if (/[^A-Za-z0-9]/.test(password))  strength++; // Symbols

    // Ensure more accurate strength detection
    if (strength <= 2) {
        strengthIndicator.textContent = 'Password Strength: Weak';
        strengthImage.src = 'images/weak.png';
    } 

    else if (strength >= 3 && strength <= 4) {
        strengthIndicator.textContent = 'Password Strength: Medium';
        strengthImage.src = 'images/medium.png';
    } 

    else if (strength >= 5) {
        strengthIndicator.textContent = 'Password Strength: Strong';
        strengthImage.src = 'images/strong.png';
    }
}

// Generate initial password on page load
window.onload = function() {
    updateLength(); // Set initial length value
    generatePassword(); // Generate initial password
};

const saveBtn = document.getElementById('saveBtn');
const savedPasswordsList = document.getElementById('savedPasswordsList');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('savedPassword');
let isEditing = false;
let currentEditEntry = null;
let savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];

// Function to render saved passwords
function renderSavedPasswords() {
    savedPasswordsList.innerHTML = '';
    savedPasswords.forEach((entry, index) => {
        const passwordEntry = document.createElement('div');
        passwordEntry.classList.add('saved-password');

        passwordEntry.innerHTML = `
            <span>
                <div class="email">Label: ${entry.email}</div>
                <div class="password">Password: ${entry.password}</div>
            </span>
            <div class="button-container">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Add edit functionality
        passwordEntry.querySelector('.edit-btn').addEventListener('click', function () {
            isEditing = true;
            currentEditEntry = index;
            emailInput.value = entry.email;
            passwordInput.value = entry.password;
            saveBtn.textContent = 'Update'; // Change button text to 'Update'
        });

        // Add delete functionality
        passwordEntry.querySelector('.delete-btn').addEventListener('click', function () {
            savedPasswords.splice(index, 1);
            updateLocalStorage();
            renderSavedPasswords();
        });

        savedPasswordsList.appendChild(passwordEntry);
    });
}

// Function to update localStorage
function updateLocalStorage() {
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
}

saveBtn.addEventListener('click', function () {
    const email = emailInput.value;
    const password = passwordInput.value; // Get the password from user input, not the generated password

    if (email && password) {
        if (isEditing) {
            // Update the existing entry if editing
            savedPasswords[currentEditEntry] = { email, password };
            isEditing = false;
            currentEditEntry = null;
            saveBtn.textContent = 'Save'; // Change button back to 'Save'
        } else {
            // Add a new password entry
            savedPasswords.push({ email, password });
        }

        // Update localStorage and re-render the list
        updateLocalStorage();
        renderSavedPasswords();

        // Clear input fields
        emailInput.value = '';
        passwordInput.value = '';
    } else {
        alert('Please enter both a label and a password.');
    }
});

// Initial render of saved passwords when the page loads
document.addEventListener('DOMContentLoaded', renderSavedPasswords);
