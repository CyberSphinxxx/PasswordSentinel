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
        strengthImage.src = '/images/weak.png';
    } 
    else if (strength >= 3 && strength <= 4) {
        strengthIndicator.textContent = 'Password Strength: Medium';
        strengthImage.src = '/images/medium.png';
    } 
    else if (strength >= 5) {
        strengthIndicator.textContent = 'Password Strength: Strong';
        strengthImage.src = '/images/strong.png';
    }
}

// Initialize password generation
generatePassword();