const passwordField     = document.getElementById('password');
const generateBtn       = document.getElementById('generateBtn');
const lengthSlider      = document.getElementById('lengthSlider');
const lenghtValue       = document.getElementById('lenghtValue');
const strengthIndicator = document.getElementById('strength-indicator');

const includeUppercase  = document.getElementById('includeUppercase');
const includeLowercase   = document.getElementById('includeLowecase');
const includeNumbers    = document.getElementById('includeNumbers');
const includeSymbols    = document.getElementById('includeSymbols');

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_-=+{}[];:<>,.?/';

generateBtn.addEventListener('click', generatePassword);

function generatePassword(){
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
    lenghtValue.textContent = lengthSlider.value;
}

function evaluateStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2){
        strengthIndicator.textContent = 'Password Strength: weak';
        strengthImage.src = 'weak.jpg';
    }

    else if (strength === 3 || strength === 4){
        strengthIndicator.textContent = 'Password Strength: medium';
        strengthImage.src = 'medium.jpg';
    }

    else {
        strengthIndicator.textContent = 'Password Strength: Strong';
        strengthImage.src = 'strong.jpg';
    }
}