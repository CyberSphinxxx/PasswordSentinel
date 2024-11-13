function getPasswordStrengthCounts() {
    let savedPasswords;
    try {
        savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
    } catch (error) {
        console.error('Error parsing saved passwords:', error);
        savedPasswords = [];
    }

    const strengthCounts = {
        strong: 0,
        medium: 0,
        weak: 0
    };

    savedPasswords.forEach(encryptedPassword => {
        const passwordData = JSON.parse(atob(encryptedPassword)); // Decode the encrypted password data
        const strength = evaluatePasswordStrength(passwordData.password); // Use your strength evaluation function
        if (strength === 'Strong') {
            strengthCounts.strong++;
        } else if (strength === 'Medium') {
            strengthCounts.medium++;
        } else {
            strengthCounts.weak++;
        }
    });

    return strengthCounts;
}

function getPasswordAgeCounts() {
    let savedPasswords;
    try {
        savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
    } catch (error) {
        console.error('Error parsing saved passwords:', error);
        savedPasswords = [];
    }

    const ageCounts = [0, 0, 0, 0]; // Counts for each age category

    savedPasswords.forEach(encryptedPassword => {
        const passwordData = JSON.parse(atob(encryptedPassword)); // Decode the encrypted password data
        const dateAdded = new Date(passwordData.dateAdded);
        const ageInMonths = Math.floor((new Date() - dateAdded) / (1000 * 60 * 60 * 24 * 30));

        if (ageInMonths < 3) {
            ageCounts[0]++;
        } else if (ageInMonths < 6) {
            ageCounts[1]++;
        } else if (ageInMonths < 12) {
            ageCounts[2]++;
        } else {
            ageCounts[3]++;
        }
    });

    return ageCounts;
}

// Fetch the password strength counts
const strengthCounts = getPasswordStrengthCounts();

// Update the strength chart with real data
const strengthCtx = document.getElementById('strengthChart').getContext('2d');
new Chart(strengthCtx, {
    type: 'doughnut',
    data: {
        labels: ['Strong', 'Medium', 'Weak'],
        datasets: [{
            data: [strengthCounts.strong, strengthCounts.medium, strengthCounts.weak],
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
        }]
    }
});

// Fetch the password age counts
const ageCounts = getPasswordAgeCounts();

// Update the age chart with real data
const ageCtx = document.getElementById('ageChart').getContext('2d');
new Chart(ageCtx, {
    type: 'bar',
    data: {
        labels: ['0-3 months', '3-6 months', '6-12 months', '1+ year'],
        datasets: [{
            label: 'Password Age',
            data: ageCounts,
            backgroundColor: '#2196F3'
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});