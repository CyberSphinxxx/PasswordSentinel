const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('passwordInput');
const checkButton = document.getElementById('checkButton');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.getElementById('strengthText');
const crackTime = document.getElementById('crackTime');
const securityScore = document.getElementById('securityScore');
const feedbackList = document.getElementById('feedbackList');
const suggestionsList = document.getElementById('suggestionsList');

const ENTROPY_THRESHOLDS = {
    VERY_STRONG: 100,
    STRONG: 80,
    MEDIUM: 60,
    WEAK: 40
};

checkButton.addEventListener('click', evaluatePassword);
passwordInput.addEventListener('input', evaluatePassword);


togglePassword.addEventListener('click', function() {
    // Toggle the password visibility
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle the eye icon
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

let debounceTimer;
passwordInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(evaluatePassword, 300); // 300ms delay
});

function evaluatePassword() {
    const password = passwordInput.value.trim();
    if (password.length === 0) {
        resetDisplay();
        return;
    }

    // Calculate password strength and security metrics
    const metrics = calculatePasswordMetrics(password);
    
    // Update UI with results
    updateStrengthIndicator(metrics.strength, metrics.strengthLabel);
    updateCrackTime(metrics.entropy);
    updateSecurityScore(metrics.score);
    updateFeedback(metrics.feedback);
    updateSuggestions(metrics.suggestions);
}

function calculatePasswordMetrics(password) {
    let metrics = {
        strength: 0,
        strengthLabel: '',
        entropy: 0,
        score: 0,
        feedback: [],
        suggestions: []
    };

    // Character set checks
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    
    // Calculate character pool size
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumbers) poolSize += 10;
    if (hasSymbols) poolSize += 33;

    // Calculate entropy
    metrics.entropy = Math.log2(Math.pow(poolSize, password.length));

    // Calculate strength percentage (0-100)
    metrics.strength = Math.min(100, (metrics.entropy / 100) * 100);

    // Determine strength label and score
    if (metrics.entropy >= ENTROPY_THRESHOLDS.VERY_STRONG) {
        metrics.strengthLabel = 'Very Strong';
        metrics.score = 100;
        strengthBar.style.backgroundColor = '#00cc00';
    } else if (metrics.entropy >= ENTROPY_THRESHOLDS.STRONG) {
        metrics.strengthLabel = 'Strong';
        metrics.score = 80;
        strengthBar.style.backgroundColor = '#88cc00';
    } else if (metrics.entropy >= ENTROPY_THRESHOLDS.MEDIUM) {
        metrics.strengthLabel = 'Medium';
        metrics.score = 60;
        strengthBar.style.backgroundColor = '#ffaa00';
    } else if (metrics.entropy >= ENTROPY_THRESHOLDS.WEAK) {
        metrics.strengthLabel = 'Weak';
        metrics.score = 40;
        strengthBar.style.backgroundColor = '#ff7700';
    } else {
        metrics.strengthLabel = 'Very Weak';
        metrics.score = 20;
        strengthBar.style.backgroundColor = '#ff4444';
    }

    // Generate feedback
    metrics.feedback = generateDetailedFeedback(password, {
        hasLower, hasUpper, hasNumbers, hasSymbols
    });

    // Generate suggestions
    metrics.suggestions = generateDetailedSuggestions(password, {
        hasLower, hasUpper, hasNumbers, hasSymbols
    });

    return metrics;
}

function generateDetailedFeedback(password, checks) {
    const feedback = [];

    // Length feedback
    if (password.length < 8) {
        feedback.push('Password is too short (minimum 8 characters recommended)');
    } else if (password.length >= 12) {
        feedback.push('Good password length');
    }

    // Character variety feedback
    let varietyScore = 0;
    if (checks.hasLower) varietyScore++;
    if (checks.hasUpper) varietyScore++;
    if (checks.hasNumbers) varietyScore++;
    if (checks.hasSymbols) varietyScore++;

    feedback.push(`Using ${varietyScore}/4 character types`);

    // Pattern checks
    if (/(.)\1{2,}/.test(password)) {
        feedback.push('Contains repeated characters');
    }
    if (/^[A-Za-z]+$/.test(password)) {
        feedback.push('Contains only letters');
    }
    if (/^[0-9]+$/.test(password)) {
        feedback.push('Contains only numbers');
    }

    return feedback;
}

function generateDetailedSuggestions(password, checks) {
const suggestions = [];

// Check if password meets all criteria for a strong password
const hasAllCharacterTypes = checks.hasLower && checks.hasUpper && 
                            checks.hasNumbers && checks.hasSymbols;
const isLongEnough = password.length >= 12;
const noRepeats = !/(.)\1{2,}/.test(password);

// If password meets all criteria, return a positive message
if (hasAllCharacterTypes && isLongEnough && noRepeats) {
    suggestions.push('Excellent! Your password meets all security requirements. Remember to:');
    suggestions.push('• Store it securely');
    suggestions.push('• Never share it with anyone');
    suggestions.push('• Use unique passwords for different accounts');
    return suggestions;
}

// Otherwise, provide improvement suggestions
if (!checks.hasLower) {
    suggestions.push('Add lowercase letters');
}
if (!checks.hasUpper) {
    suggestions.push('Add uppercase letters');
}
if (!checks.hasNumbers) {
    suggestions.push('Add numbers');
}
if (!checks.hasSymbols) {
    suggestions.push('Add special characters');
}
if (password.length < 12) {
    suggestions.push('Make the password longer (12+ characters recommended)');
}
if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Avoid repeating characters');
}

return suggestions;
}

function updateStrengthIndicator(strength, label) {
    strengthBar.style.width = `${strength}%`;
    strengthText.textContent = `Strength: ${label} (${Math.round(strength)}%)`;
}

function updateCrackTime(entropy) {
    const crackTimeEstimate = estimateCrackTime(entropy);
    crackTime.textContent = `Time to Crack: ${crackTimeEstimate}`;
}

function estimateCrackTime(entropy) {
    // Assuming 1 trillion (10^12) guesses per second for modern hardware
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

function updateSecurityScore(score) {
    securityScore.textContent = `Security Score: ${score}/100`;
}

function updateFeedback(feedback) {
    feedbackList.innerHTML = '';
    feedback.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        feedbackList.appendChild(li);
    });
}

function updateSuggestions(suggestions) {
    suggestionsList.innerHTML = '';
    suggestions.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        suggestionsList.appendChild(li);
    });
}

function resetDisplay() {
    strengthBar.style.width = '0%';
    strengthText.textContent = 'Not checked yet';
    crackTime.textContent = 'Not checked yet';
    securityScore.textContent = ' Not checked yet';
    feedbackList.innerHTML = '';
    suggestionsList.innerHTML = '';
}