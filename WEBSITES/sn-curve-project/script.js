// Material properties for S-N curves
const materialData = {
    steel: {
        name: "Steel",
        enduranceLimit: 250, // MPa
        fatigueStrength: 400, // MPa at 10^6 cycles
        ultimateStrength: 600, // MPa
        color: '#FF6B6B',
        // S-N curve parameters (log-log relationship)
        snCurve: [
            { stress: 600, cycles: 1000 },
            { stress: 500, cycles: 10000 },
            { stress: 400, cycles: 100000 },
            { stress: 350, cycles: 500000 },
            { stress: 300, cycles: 1000000 },
            { stress: 250, cycles: 10000000 }, // Endurance limit
            { stress: 250, cycles: 100000000 }
        ]
    },
    aluminum: {
        name: "Aluminum",
        enduranceLimit: null, // No true endurance limit
        fatigueStrength: 150, // MPa at 10^6 cycles
        ultimateStrength: 300, // MPa
        color: '#4ECDC4',
        snCurve: [
            { stress: 300, cycles: 1000 },
            { stress: 250, cycles: 10000 },
            { stress: 200, cycles: 100000 },
            { stress: 150, cycles: 1000000 },
            { stress: 120, cycles: 10000000 },
            { stress: 100, cycles: 100000000 }
        ]
    },
    titanium: {
        name: "Titanium",
        enduranceLimit: 350, // MPa
        fatigueStrength: 500, // MPa at 10^6 cycles
        ultimateStrength: 800, // MPa
        color: '#45B7D1',
        snCurve: [
            { stress: 800, cycles: 1000 },
            { stress: 650, cycles: 10000 },
            { stress: 550, cycles: 100000 },
            { stress: 500, cycles: 1000000 },
            { stress: 400, cycles: 10000000 },
            { stress: 350, cycles: 100000000 }, // Endurance limit
            { stress: 350, cycles: 1000000000 }
        ]
    },
    composite: {
        name: "Composite",
        enduranceLimit: null, // Varies by composition
        fatigueStrength: 200, // MPa at 10^6 cycles
        ultimateStrength: 400, // MPa
        color: '#96CEB4',
        snCurve: [
            { stress: 400, cycles: 1000 },
            { stress: 300, cycles: 10000 },
            { stress: 250, cycles: 100000 },
            { stress: 200, cycles: 1000000 },
            { stress: 150, cycles: 10000000 },
            { stress: 120, cycles: 100000000 }
        ]
    }
};

let snChart;
let currentMaterial = 'steel';
let currentStressPoint = 200;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeChart();
    updateChart();
    updateStressPoint();
});

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update chart if switching to visualization tab
    if (tabName === 'visualization') {
        setTimeout(() => {
            if (snChart) {
                snChart.resize();
            }
        }, 100);
    }
}

// Initialize Chart.js
function initializeChart() {
    const ctx = document.getElementById('snChart').getContext('2d');
    
    snChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'S-N Curve (Stress vs. Number of Cycles)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} MPa at ${formatCycles(context.parsed.x)} cycles`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Number of Cycles (N)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCycles(value);
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Stress Amplitude (MPa)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    min: 0,
                    max: 600
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Update chart with selected material
function updateChart() {
    const material = document.getElementById('materialSelect').value;
    currentMaterial = material;
    const materialInfo = materialData[material];
    
    // Update chart data
    snChart.data.datasets = [
        {
            label: `${materialInfo.name} S-N Curve`,
            data: materialInfo.snCurve.map(point => ({
                x: point.cycles,
                y: point.stress
            })),
            borderColor: materialInfo.color,
            backgroundColor: materialInfo.color + '20',
            borderWidth: 3,
            fill: false,
            tension: 0.1
        }
    ];
    
    // Add endurance limit line if material has one
    if (materialInfo.enduranceLimit) {
        snChart.data.datasets.push({
            label: 'Endurance Limit',
            data: [
                { x: 1000000, y: materialInfo.enduranceLimit },
                { x: 100000000, y: materialInfo.enduranceLimit }
            ],
            borderColor: '#FFD93D',
            backgroundColor: '#FFD93D',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
        });
    }
    
    // Update y-axis max based on material
    snChart.options.scales.y.max = Math.max(...materialInfo.snCurve.map(p => p.stress)) + 50;
    
    snChart.update();
    updateStressPoint();
}

// Update stress point on the chart
function updateStressPoint() {
    const stressValue = parseInt(document.getElementById('stressRange').value);
    currentStressPoint = stressValue;
    document.getElementById('stressValue').textContent = stressValue + ' MPa';
    
    // Calculate expected cycles for current stress
    const materialInfo = materialData[currentMaterial];
    const expectedCycles = calculateExpectedCycles(stressValue, materialInfo);
    const region = determineFatigueRegion(expectedCycles);
    
    // Update info panel
    document.getElementById('currentStress').textContent = stressValue;
    document.getElementById('currentCycles').textContent = formatCycles(expectedCycles);
    document.getElementById('currentRegion').textContent = region;
    
    // Update chart with stress point
    updateChartWithStressPoint(stressValue, expectedCycles);
}

// Calculate expected cycles for a given stress
function calculateExpectedCycles(stress, materialInfo) {
    const curve = materialInfo.snCurve;
    
    // Find the two points that bracket the stress value
    for (let i = 0; i < curve.length - 1; i++) {
        if (stress >= curve[i + 1].stress && stress <= curve[i].stress) {
            // Linear interpolation in log-log space
            const logStress1 = Math.log(curve[i].stress);
            const logStress2 = Math.log(curve[i + 1].stress);
            const logCycles1 = Math.log(curve[i].cycles);
            const logCycles2 = Math.log(curve[i + 1].cycles);
            const logStress = Math.log(stress);
            
            const logCycles = logCycles1 + (logCycles2 - logCycles1) * 
                            (logStress - logStress1) / (logStress2 - logStress1);
            
            return Math.exp(logCycles);
        }
    }
    
    // If stress is outside the curve range, extrapolate
    if (stress > curve[0].stress) {
        return curve[0].cycles * Math.pow(curve[0].stress / stress, 3);
    } else {
        return curve[curve.length - 1].cycles * Math.pow(curve[curve.length - 1].stress / stress, 3);
    }
}

// Determine fatigue region based on cycles
function determineFatigueRegion(cycles) {
    if (cycles < 10000) {
        return 'Low Cycle Fatigue';
    } else if (cycles < 1000000) {
        return 'High Cycle Fatigue';
    } else {
        return 'Very High Cycle Fatigue';
    }
}

// Update chart with current stress point
function updateChartWithStressPoint(stress, cycles) {
    // Remove existing stress point dataset
    snChart.data.datasets = snChart.data.datasets.filter(dataset => 
        !dataset.label.includes('Current Stress')
    );
    
    // Add current stress point
    snChart.data.datasets.push({
        label: 'Current Stress Point',
        data: [{ x: cycles, y: stress }],
        borderColor: '#FF4757',
        backgroundColor: '#FF4757',
        borderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
        fill: false
    });
    
    snChart.update();
}

// Format cycles for display
function formatCycles(cycles) {
    if (cycles >= 1000000) {
        return (cycles / 1000000).toFixed(1) + 'M';
    } else if (cycles >= 1000) {
        return (cycles / 1000).toFixed(1) + 'K';
    } else {
        return cycles.toString();
    }
}

// Fatigue life calculator
function calculateFatigueLife() {
    const stress = parseFloat(document.getElementById('calcStress').value);
    const material = document.getElementById('calcMaterial').value;
    const meanStress = parseFloat(document.getElementById('calcMeanStress').value);
    
    if (!stress || stress <= 0) {
        alert('Please enter a valid stress amplitude.');
        return;
    }
    
    const materialInfo = materialData[material];
    let cycles = calculateExpectedCycles(stress, materialInfo);
    
    // Apply mean stress correction (Goodman relationship)
    if (meanStress > 0 && materialInfo.ultimateStrength) {
        const correctedStress = stress / (1 - meanStress / materialInfo.ultimateStrength);
        cycles = calculateExpectedCycles(correctedStress, materialInfo);
    }
    
    const region = determineFatigueRegion(cycles);
    const safetyFactor = calculateSafetyFactor(stress, materialInfo);
    
    // Display results
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = `
        <div class="result-item">
            <strong>Material:</strong> ${materialInfo.name}
        </div>
        <div class="result-item">
            <strong>Stress Amplitude:</strong> ${stress} MPa
        </div>
        <div class="result-item">
            <strong>Mean Stress:</strong> ${meanStress} MPa
        </div>
        <div class="result-item">
            <strong>Expected Fatigue Life:</strong> ${formatCycles(cycles)} cycles
        </div>
        <div class="result-item">
            <strong>Fatigue Region:</strong> ${region}
        </div>
        <div class="result-item">
            <strong>Safety Factor:</strong> ${safetyFactor.toFixed(2)}
        </div>
        ${materialInfo.enduranceLimit ? 
            `<div class="result-item">
                <strong>Endurance Limit:</strong> ${materialInfo.enduranceLimit} MPa
            </div>` : ''
        }
        <div class="result-item">
            <strong>Ultimate Strength:</strong> ${materialInfo.ultimateStrength} MPa
        </div>
    `;
}

// Calculate safety factor
function calculateSafetyFactor(stress, materialInfo) {
    if (materialInfo.enduranceLimit) {
        return materialInfo.enduranceLimit / stress;
    } else {
        return materialInfo.fatigueStrength / stress;
    }
}

// Add some educational tooltips and interactions
function addEducationalFeatures() {
    // Add hover effects for concept cards
    const conceptCards = document.querySelectorAll('.concept-card');
    conceptCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click to highlight on chart
    const canvas = document.getElementById('snChart');
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Convert pixel coordinates to chart coordinates
        const chartArea = snChart.chartArea;
        const xValue = snChart.scales.x.getValueForPixel(x);
        const yValue = snChart.scales.y.getValueForPixel(y);
        
        if (xValue && yValue) {
            // Find closest point on the curve
            const materialInfo = materialData[currentMaterial];
            const closestPoint = findClosestPoint(xValue, yValue, materialInfo.snCurve);
            
            // Update stress range to match closest point
            document.getElementById('stressRange').value = closestPoint.stress;
            updateStressPoint();
        }
    });
}

// Find closest point on S-N curve
function findClosestPoint(x, y, curve) {
    let closest = curve[0];
    let minDistance = Infinity;
    
    curve.forEach(point => {
        const distance = Math.sqrt(
            Math.pow(Math.log(point.cycles) - Math.log(x), 2) +
            Math.pow(point.stress - y, 2)
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            closest = point;
        }
    });
    
    return closest;
}

// Initialize educational features
document.addEventListener('DOMContentLoaded', function() {
    addEducationalFeatures();
});

// Export functions for global access
window.showTab = showTab;
window.updateChart = updateChart;
window.updateStressPoint = updateStressPoint;
window.calculateFatigueLife = calculateFatigueLife; 