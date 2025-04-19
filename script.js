// Initialize EmailJS
(function() {
    emailjs.init({
        publicKey: "ff8S5IoEa7C_lSKM4",
    });
})();

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !phone || !message) {
            showErrorPopup('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showErrorPopup('Please enter a valid email address');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            showErrorPopup('Please enter a valid 10-digit phone number');
            return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = 'Sending...';
        submitButton.disabled = true;
        
        // Prepare email parameters
        const templateParams = {
            title: "JMD Construction",
            user_name: name,
            user_email: email,
            user_phone: phone,
            message: message
        };
        
        // Send email
        emailjs.send("service_gsp25fa", "template_pa6eq2v", templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showThankYouPopup();
                contactForm.reset();
            })
            .catch(function(error) {
                console.error('EmailJS Error:', error);
                let errorMessage = 'Failed to send message. ';
                
                if (error.status === 400) {
                    errorMessage += 'Please check your email address and try again.';
                } else if (error.status === 401) {
                    errorMessage += 'Authentication error. Please contact the website administrator.';
                } else if (error.status === 429) {
                    errorMessage += 'Too many requests. Please try again later.';
                } else {
                    errorMessage += 'Please try again later or contact us directly at +91 8103976671.';
                }
                
                showErrorPopup(errorMessage);
            })
            .finally(function() {
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
    });
});

// Show thank you popup
function showThankYouPopup() {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    popup.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all">
            <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Thank You!</h3>
                <p class="text-gray-600 mb-4">Your message has been sent successfully. We will get back to you soon.</p>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
}

// Show error popup
function showErrorPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    popup.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all">
            <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Error</h3>
                <p class="text-gray-600 mb-4">${message}</p>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
} 