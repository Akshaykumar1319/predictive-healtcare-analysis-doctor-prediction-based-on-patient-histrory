document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predict-form');
    const sections = document.querySelectorAll('.form-section');
    const steps = document.querySelectorAll('.step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    let currentSection = 0;

    // Initialize range value display
    const exerciseRange = document.getElementById('exercise');
    const rangeValue = document.querySelector('.range-value');
    exerciseRange.addEventListener('input', function() {
        rangeValue.textContent = `${this.value} days/week`;
    });

    // Form validation for each section
    function validateSection(sectionIndex) {
        const currentInputs = sections[sectionIndex].querySelectorAll('input, select');
        let isValid = true;
        
        currentInputs.forEach(input => {
            if (input.required && !input.value) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        
        return isValid;
    }

    function updateFormNavigation() {
        // Update steps
        steps.forEach((step, index) => {
            if (index === currentSection) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update sections visibility
        sections.forEach((section, index) => {
            if (index === currentSection) {
                section.classList.add('active');
                section.style.display = 'block';
            } else {
                section.classList.remove('active');
                section.style.display = 'none';
            }
        });

        // Update buttons
        prevBtn.style.display = currentSection === 0 ? 'none' : 'block';
        nextBtn.style.display = currentSection === sections.length - 1 ? 'none' : 'block';
        submitBtn.style.display = currentSection === sections.length - 1 ? 'block' : 'none';
    }

    prevBtn.addEventListener('click', () => {
        if (currentSection > 0) {
            currentSection--;
            updateFormNavigation();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (validateSection(currentSection)) {
            if (currentSection < sections.length - 1) {
                currentSection++;
                updateFormNavigation();
            }
        }
    });

    // Add input validation listeners
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!validateSection(currentSection)) {
            return;
        }

        const loadingHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Analyzing health data...</p>
            </div>
        `;
        document.getElementById('result').innerHTML = loadingHTML;

        let inputData = {
            age: parseInt(document.getElementById('age').value),
            blood_pressure: parseInt(document.getElementById('blood_pressure').value),
            cholesterol: parseInt(document.getElementById('cholesterol').value),
            heart_rate: parseInt(document.getElementById('heart_rate').value),
            smoking: parseInt(document.getElementById('smoking').value),
            alcohol: parseInt(document.getElementById('alcohol').value),
            exercise: parseInt(document.getElementById('exercise').value),
            bmi: parseFloat(document.getElementById('bmi').value),
            diabetes: parseInt(document.getElementById('diabetes').value)
        };

        fetch('/predict', {
            method: 'POST',
            body: JSON.stringify(inputData),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');
            let icon = '';
            let color = '';
            
            switch(data.risk_level) {
                case 'Low Risk':
                    icon = 'fa-check-circle';
                    color = 'var(--success-color)';
                    break;
                case 'Moderate Risk':
                    icon = 'fa-exclamation-triangle';
                    color = 'var(--warning-color)';
                    break;
                case 'High Risk':
                    icon = 'fa-exclamation-circle';
                    color = 'var(--danger-color)';
                    break;
            }
            
            resultDiv.innerHTML = `
                <div class="risk-assessment ${data.risk_level.toLowerCase().replace(' ', '-')}">
                    <div class="assessment-header">
                        <i class="fas ${icon}" style="color: ${color}; font-size: 2rem;"></i>
                        <h2>${data.risk_level}</h2>
                    </div>
                    <div class="assessment-details">
                        <p class="recommendation">${data.doctor_recommendation}</p>
                        <div class="risk-metrics">
                            <div class="metric">
                                <span>Risk Probability</span>
                                <div class="probability-bar">
                                    <div class="probability-fill" style="width: ${data.probability * 100}%"></div>
                                </div>
                                <span>${Math.round(data.probability * 100)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Fetch available doctors based on risk level
            fetch(`/get_doctors?risk_level=${data.risk_level}`)
                .then(response => response.json())
                .then(doctors => {
                    if (doctors.length > 0) {
                        const doctorsList = doctors.map(doctor => `
                            <div class="doctor-card">
                                <div class="doctor-info">
                                    <h3>${doctor.name}</h3>
                                    <p>${doctor.specialty}</p>
                                    <p>${doctor.experience} years experience</p>
                                    <div class="rating">
                                        <span>★ ${doctor.rating}</span>
                                        <span>(${doctor.reviewCount} reviews)</span>
                                    </div>
                                    <p>${doctor.location}</p>
                                    <p class="availability ${doctor.isAvailable ? 'available' : 'unavailable'}">
                                        Next available: ${doctor.nextSlot}
                                    </p>
                                </div>
                                <button class="book-btn" onclick="bookAppointment('${doctor.id}')">
                                    Book Appointment
                                </button>
                            </div>
                        `).join('');
                        
                        resultDiv.innerHTML += `
                            <div class="recommended-doctors">
                                <h3>Recommended Doctors</h3>
                                <div class="doctors-grid">
                                    ${doctorsList}
                                </div>
                            </div>
                        `;
                    }
                });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-times-circle"></i>
                    <p>An error occurred while processing your request. Please try again.</p>
                </div>
            `;
        });
    });

    // Initialize the form navigation
    updateFormNavigation();
});

// Function to handle appointment booking
function bookAppointment(doctorId) {
    // This would be implemented based on your booking system requirements
    alert('Booking functionality will be implemented based on your system requirements.');
}