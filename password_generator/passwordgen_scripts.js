const passwordField     = document.getElementById('password');
const copyBtn           = document.getElementById('copyBtn');
const lengthSlider      = document.getElementById('passwordLength');
const lengthValue       = document.getElementById('lengthValue');
const includeUppercase  = document.getElementById('includeUppercase');
const includeLowercase  = document.getElementById('includeLowercase');
const includeNumbers    = document.getElementById('includeNumbers');
const includeSymbols    = document.getElementById('includeSymbols');
const generateBtn       = document.getElementById('generateBtn');

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

copyBtn.addEventListener('click', async function() {
    try {
        await navigator.clipboard.writeText(passwordField.value);
        
        // Show feedback
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    } catch (err) {
        alert('Failed to copy password');
    }
});

generateBtn.addEventListener('click', generatePassword);

[includeUppercase, includeLowercase, includeNumbers, includeSymbols].forEach(checkbox => {
    checkbox.addEventListener('change', generatePassword);
});

// Functions
function generatePassword() {
    const length = lengthSlider.value;
    const options = {
        uppercase: includeUppercase.checked,
        lowercase: includeLowercase.checked,
        numbers: includeNumbers.checked,
        symbols: includeSymbols.checked
    };

    // Check if at least one option is selected
    if (!Object.values(options).some(option => option)) {
        alert('Please select at least one character type');
        includeLowercase.checked = true;
        return;
    }

    let charSet  = '';
    let password = '';
    
    // Build character set
    if (options.uppercase)  charSet += UPPERCASE;
    if (options.lowercase)  charSet += LOWERCASE;
    if (options.numbers)    charSet += NUMBERS;
    if (options.symbols)    charSet += SYMBOLS;

    // Ensure at least one character from each selected type
    if (options.uppercase)  password += UPPERCASE.charAt(Math.floor(Math.random() * UPPERCASE.length));
    if (options.lowercase)  password += LOWERCASE.charAt(Math.floor(Math.random() * LOWERCASE.length));
    if (options.numbers)    password += NUMBERS.charAt(Math.floor(Math.random() * NUMBERS.length));
    if (options.symbols)    password += SYMBOLS.charAt(Math.floor(Math.random() * SYMBOLS.length));

    // Fill the remaining length with random characters
    while (password.length < length) {
        password += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    passwordField.value = password;
    evaluateStrength(password);
}

function updateLength() {
    lengthValue.textContent = lengthSlider.value;
}

function evaluateStrength(password) {
    let strength = 0;
    const checks = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /\d/.test(password),
        symbols: /[^A-Za-z0-9]/.test(password),
        variety: new Set(password).size > password.length * 0.7 // Check for character variety
    };

    // Add points based on checks
    if (checks.length) strength += 2;
    if (checks.uppercase) strength += 1;
    if (checks.lowercase) strength += 1;
    if (checks.numbers) strength += 1;
    if (checks.symbols) strength += 2;
    if (checks.variety) strength += 1;

    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    if (strength <= 3) {
        strengthBar.style.width = '33%';
        strengthBar.style.backgroundColor = '#ff4444';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#ff4444';
    } else if (strength <= 6) {
        strengthBar.style.width = '66%';
        strengthBar.style.backgroundColor = '#ffaa00';
        strengthText.textContent = 'Medium';
        strengthText.style.color = '#ffaa00';
    } else {
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = '#00cc00';
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#00cc00';
    }
}

// Initialize password generation
generatePassword();