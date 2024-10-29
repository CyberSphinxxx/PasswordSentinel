// DOM Elements
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
const saveBtn           = document.getElementById('saveBtn');
const savedPasswordsList = document.getElementById('savedPasswordsList');
const emailInput        = document.getElementById('email');
const passwordInput     = document.getElementById('savedPassword');

// Character sets for generating password
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS   = '0123456789';
const SYMBOLS   = '!@#$%^&*()_+-=[]{}|;:,.<>?';

let isEditing = false;
let currentEditEntry = null;
let savedPasswords = [];

// Encryption key generation and management
let encryptionKey = null;

async function generateEncryptionKey() {
    const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
    const exportedKey = await window.crypto.subtle.exportKey("raw", key);
    const base64Key = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedKey)));
    localStorage.setItem("encryptionKey", base64Key);
    return key;
}

async function getEncryptionKey() {
    if (encryptionKey) return encryptionKey;
    
    let storedKey = localStorage.getItem("encryptionKey");
    if (storedKey) {
        const keyData = Uint8Array.from(atob(storedKey), c => c.charCodeAt(0));
        encryptionKey = await window.crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    } else {
        encryptionKey = await generateEncryptionKey();
    }
    return encryptionKey;
}

// Encryption and decryption functions
async function encryptData(data) {
    const key = await getEncryptionKey();
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encodedData
    );
    const encryptedArray = new Uint8Array(encryptedData);
    const resultArray = new Uint8Array(iv.length + encryptedArray.length);
    resultArray.set(iv);
    resultArray.set(encryptedArray, iv.length);
    return btoa(String.fromCharCode.apply(null, resultArray));
}

async function decryptData(encryptedData) {
    const key = await getEncryptionKey();
    const dataArray = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = dataArray.slice(0, 12);
    const data = dataArray.slice(12);
    const decryptedData = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
    );
    return JSON.parse(new TextDecoder().decode(decryptedData));
}

// Event listeners
lengthSlider.addEventListener('input', function() {
    updateLength();
    generatePassword();
});

copyBtn.addEventListener('click', function() {
    passwordField.select();
    document.execCommand('copy');
    alert('Password copied to clipboard!');
});

saveBtn.addEventListener('click', async function () {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (email && password) {
        if (isEditing) {
            savedPasswords[currentEditEntry] = { email, password };
            isEditing = false;
            currentEditEntry = null;
            saveBtn.textContent = 'Save';
        } else {
            savedPasswords.push({ email, password });
        }

        await updateLocalStorage();
        renderSavedPasswords();

        emailInput.value = '';
        passwordInput.value = '';
    } else {
        alert('Please enter both a label and a password.');
    }
});

// Functions
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
    evaluateStrength(password);
}

function updateLength() {
    lengthValue.textContent = lengthSlider.value;
}

function evaluateStrength(password) {
    let strength = 0;

    if (password.length >= 8 && password.length <= 12) strength += 1;
    else if (password.length > 12) strength += 2;

    if (/[A-Z]/.test(password))         strength++;
    if (/[a-z]/.test(password))         strength++;
    if (/\d/.test(password))            strength++;
    if (/[^A-Za-z0-9]/.test(password))  strength++;

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

async function updateLocalStorage() {
    const encryptedData = await encryptData(savedPasswords);
    localStorage.setItem('savedPasswords', encryptedData);
}

async function loadSavedPasswords() {
    const encryptedData = localStorage.getItem('savedPasswords');
    if (encryptedData) {
        try {
            savedPasswords = await decryptData(encryptedData);
        } catch (error) {
            console.error('Error decrypting data:', error);
            savedPasswords = [];
        }
    }
    renderSavedPasswords();
}

function renderSavedPasswords() {
    savedPasswordsList.innerHTML = '';
    savedPasswords.forEach((entry, index) => {
        const passwordEntry = document.createElement('div');
        passwordEntry.classList.add('saved-password');

        // Updated HTML structure with proper button container
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

        // Add event listeners for the buttons
        passwordEntry.querySelector('.edit-btn').addEventListener('click', function () {
            isEditing = true;
            currentEditEntry = index;
            emailInput.value = entry.email;
            passwordInput.value = entry.password;
            saveBtn.textContent = 'Update';
        });

        passwordEntry.querySelector('.delete-btn').addEventListener('click', async function () {
            savedPasswords.splice(index, 1);
            await updateLocalStorage();
            renderSavedPasswords();
        });

        savedPasswordsList.appendChild(passwordEntry);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', async function () {
    await loadSavedPasswords();
    generatePassword();
});

document.addEventListener('DOMContentLoaded', function() {
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });
});