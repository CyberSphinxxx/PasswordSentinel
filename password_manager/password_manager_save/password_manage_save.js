// Get form elements
const form              = document.getElementById('savePasswordForm');
const passwordInput     = document.getElementById('password');
const strengthIndicator = document.getElementById('strengthIndicator');
const successMessage    = document.getElementById('successMessage');
const errorMessage      = document.getElementById('errorMessage');

// Clear invalid localStorage data on page load
function clearInvalidLocalStorage() {
    try {
        JSON.parse(localStorage.getItem('savedPasswords'));
    } catch (error) {
        console.warn('Invalid data in localStorage. Clearing savedPasswords.');
        localStorage.removeItem('savedPasswords');
    }
}
clearInvalidLocalStorage();

// Password strength evaluation function
function evaluatePasswordStrength(password) {
    let strength = 0;
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /\d/.test(password),
        symbols: /[^A-Za-z0-9]/.test(password)
    };

    strength += checks.length ? 1 : 0;
    strength += checks.uppercase ? 1 : 0;
    strength += checks.lowercase ? 1 : 0;
    strength += checks.numbers ? 1 : 0;
    strength += checks.symbols ? 1 : 0;

    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
}

// Update strength indicator as user types
passwordInput.addEventListener('input', function() {
    const strength = evaluatePasswordStrength(this.value);
    strengthIndicator.textContent = `Password Strength: ${strength}`;
    strengthIndicator.className = `strength-indicator strength-${strength.toLowerCase()}`;
});

// Encrypt data function
async function encryptData(data) {
    const jsonData = JSON.stringify(data);
    const encodedData = btoa(jsonData); // Base64 encoding
    return encodedData;
}

// Handle form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const passwordData = {
        label: document.getElementById('label').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        dateAdded: new Date().toISOString()
    };

    try {
        // Encrypt password data
        const encryptedData = await encryptData(passwordData);

        // Get existing passwords from localStorage
        let savedPasswords;
        try {
            savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
        } catch (parseError) {
            console.error('Error parsing saved passwords:', parseError);
            savedPasswords = [];
        }

        // Ensure savedPasswords is an array
        if (!Array.isArray(savedPasswords)) {
            savedPasswords = [];
        }

        // Add new encrypted data to the array
        savedPasswords.push(encryptedData);

        // Save updated array back to localStorage
        localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));

        successMessage.style.display = 'block';
        errorMessage.style.display   = 'none';
        setTimeout(() => {
            clearForm();
        }, 2000)
    } catch (error) {
        errorMessage.textContent     = 'Error saving password: ' + error.message;
        errorMessage.style.display   = 'block';
        successMessage.style.display = 'none';
    }
});

// Clear form function
function clearForm() {
    document.getElementById('label').value    = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    strengthIndicator.textContent = '';
    errorMessage.style.display    = 'none';
}