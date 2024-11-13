
// Sample chart data (replace with real data in your implementation)
const strengthCtx = document.getElementById('strengthChart').getContext('2d');
new Chart(strengthCtx, {
    type: 'doughnut',
    data: {
        labels: ['Strong', 'Medium', 'Weak'],
        datasets: [{
            data: [65, 25, 10],
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
        }]
    }
});

const ageCtx = document.getElementById('ageChart').getContext('2d');
new Chart(ageCtx, {
    type: 'bar',
    data: {
        labels: ['0-3 months', '3-6 months', '6-12 months', '1+ year'],
        datasets: [{
            label: 'Password Age',
            data: [30, 25, 20, 15],
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