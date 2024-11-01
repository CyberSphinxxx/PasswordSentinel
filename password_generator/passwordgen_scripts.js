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
    // Base entropy calculation
    let entropy = 0;
    let poolSize = 0;

    // Character pool calculations
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/\d/.test(password)) poolSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) poolSize += 33;

    entropy = Math.log2(Math.pow(poolSize, password.length));

    // Penalty factors
    const penalties = {
        repeatingChars: /(.)\1{2,}/.test(password) ? 0.8 : 1,
        sequential: /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password) ? 0.8 : 1,
        commonWords: /(password|qwerty|letmein|welcome|123456|admin)/i.test(password) ? 0.6 : 1
    };

    // Apply penalties
    entropy *= Object.values(penalties).reduce((a, b) => a * b, 1);

    // Calculate crack time
    const crackTime = estimateCrackTime(entropy);
    
    // Determine strength rating
    const strengthRating = getStrengthRating(entropy, password.length);

    // Update UI
    updateStrengthUI(strengthRating, crackTime);
}

function estimateCrackTime(entropy) {
    // Modern hardware can try around 1 trillion (10^12) passwords per second
    const guessesPerSecond = 1e12;
    const possibleCombinations = Math.pow(2, entropy);
    const seconds = possibleCombinations / guessesPerSecond / 2; // Divide by 2 for average case

    return formatTime(seconds);
}

function formatTime(seconds) {
    if (seconds < 1) return "Instantly";
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
    if (seconds < 315360000) return `${Math.round(seconds / 31536000)} years`;
    if (seconds < 3153600000) return `${Math.round(seconds / 315360000)} decades`;
    return "Centuries";
}

function getStrengthRating(entropy, length) {
    // Minimum recommended entropy is 60 bits
    if (entropy >= 100 && length >= 12) {
        return {
            label: 'Very Strong',
            score: 100,
            color: '#00cc00'
        };
    } else if (entropy >= 80 && length >= 10) {
        return {
            label: 'Strong',
            score: 80,
            color: '#88cc00'
        };
    } else if (entropy >= 60 && length >= 8) {
        return {
            label: 'Medium',
            score: 60,
            color: '#ffaa00'
        };
    } else if (entropy >= 40) {
        return {
            label: 'Weak',
            score: 40,
            color: '#ff7700'
        };
    } else {
        return {
            label: 'Very Weak',
            score: 20,
            color: '#ff4444'
        };
    }
}

function updateStrengthUI(strengthRating, crackTime) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const crackTimeElement = document.getElementById('crackTimeEstimate');

    // Update strength meter
    strengthBar.style.width = `${strengthRating.score}%`;
    strengthBar.style.backgroundColor = strengthRating.color;
    strengthText.textContent = strengthRating.label;
    strengthText.style.color = strengthRating.color;

    // Update crack time
    crackTimeElement.textContent = `Time to crack: ${crackTime}`;
    crackTimeElement.style.color = getCrackTimeColor(crackTime);
}

function getCrackTimeColor(crackTime) {
    if (crackTime.includes("Instantly") || crackTime.includes("seconds")) {
        return '#ff4444';
    } else if (crackTime.includes("minutes") || crackTime.includes("hours")) {
        return '#ff7700';
    } else if (crackTime.includes("days")) {
        return '#ffaa00';
    } else if (crackTime.includes("months")) {
        return '#88cc00';
    } else {
        return '#00cc00';
    }
}

// Initialize password generation
generatePassword();