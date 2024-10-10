const passwordField     = document.getElementById('password');
const generateBtn       = document.getElementById('generateBtn');
const lengthSlider      = document.getElementById('lengthSlider');
const lengthValue       = document.getElementById('lengthValue');
const strengthIndicator = document.getElementById('strengthIndicator');
const strengthImage     = document.getElementById('strengthImage');

const includeUppercase  = document.getElementById('includeUppercase');
const includeLowercase  = document.getElementById('includeLowercase');
const includeNumbers    = document.getElementById('includeNumbers');
const includeSymbols    = document.getElementById('includeSymbols');

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

generateBtn.addEventListener('click', generatePassword);

function generatePassword() {
    let length = parseInt(lengthSlider.value);
    let charSet = '';
    if (includeUppercase.checked) charSet += UPPERCASE;
    if (includeLowercase.checked) charSet += LOWERCASE;
    if (includeNumbers.checked) charSet += NUMBERS;
    if (includeSymbols.checked) charSet += SYMBOLS;

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
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) {
        strengthIndicator.textContent = 'Password Strength: Weak';
        strengthImage.src = 'weak.jpg'; // Add different images for different strengths
    }
    
    else if (strength === 3 || strength === 4) {
        strengthIndicator.textContent = 'Password Strength: Medium';
        strengthImage.src = 'medium.jpg';
    }
    
    else {
        strengthIndicator.textContent = 'Password Strength: Strong';
        strengthImage.src = 'strong.jpg';
    }
}
