document.addEventListener('DOMContentLoaded', () => {
    // --- Common Elements ---
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const loginForm = document.querySelector('#loginForm'); // Assuming login form gets an ID
    const signupForm = document.querySelector('#signupForm');

    // --- Password Toggle Visibility ---
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            // Toggle the type attribute
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle the icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // --- Login Form Submission with Spinner ---
    const mainLoginForm = document.querySelector('.login-box form:not(#signupForm)');
    if (mainLoginForm) { // This block handles the login page form
        mainLoginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            // For demo purposes, we'll just trigger the transition
            triggerTransition("Tjay"); // In a real app, you'd get the user's name
        });
    }

    // --- Transition Logic ---
    function triggerTransition(userName) {
        const transitionOverlay = document.getElementById('transitionOverlay');
        const transitionText = document.getElementById('transitionText');
        const transitionIcon = document.getElementById('transitionIcon');

        if (!transitionOverlay || !transitionText || !transitionIcon) return;

        // 1. Show the transition overlay
        transitionOverlay.classList.add('active');

        // 2. After a delay, change text to "Access Granted"
        setTimeout(() => {
            transitionText.textContent = "Access Granted";
        }, 1500);

        // 3. After another delay, change text to "Welcome Back"
        setTimeout(() => {
            transitionText.textContent = `Welcome back, ${userName}!`;
        }, 2800);

        // 4. After the full animation, redirect to the dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 4000);
    }

    // --- Forgot Password Modal Logic ---
    const forgotPasswordLink = document.querySelector('.forgot-password-link');
    if (forgotPasswordLink) {
        const loginFormContainer = document.getElementById('loginFormContainer');
        const forgotPasswordModalOverlay = document.getElementById('forgotPasswordModalOverlay');
        const closeForgotPasswordModalBtn = document.getElementById('closeForgotPasswordModal');
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        const modalSendingAnimation = document.querySelector('.modal-sending-animation');
        const modalConfirmationMessage = document.querySelector('.modal-confirmation-message');

        if (loginFormContainer && forgotPasswordModalOverlay && closeForgotPasswordModalBtn && forgotPasswordForm) {
            forgotPasswordLink.addEventListener('click', (event) => {
                event.preventDefault();
                loginFormContainer.classList.add('fade-out'); // Fade out login form
                forgotPasswordModalOverlay.classList.add('active');
                forgotPasswordForm.style.display = 'block';
                modalSendingAnimation.style.display = 'none';
                modalConfirmationMessage.style.display = 'none';
                document.getElementById('forgotEmail').value = '';
            });

            const closeModal = () => {
                forgotPasswordModalOverlay.classList.remove('active');
                loginFormContainer.classList.remove('fade-out'); // Fade in login form
            };

            closeForgotPasswordModalBtn.addEventListener('click', closeModal);
            forgotPasswordModalOverlay.addEventListener('click', (event) => {
                if (event.target === forgotPasswordModalOverlay) {
                    closeModal();
                }
            });

            forgotPasswordForm.addEventListener('submit', (event) => {
                event.preventDefault();
                forgotPasswordForm.style.display = 'none';
                modalSendingAnimation.style.display = 'flex';

                setTimeout(() => {
                    modalSendingAnimation.style.display = 'none';
                    modalConfirmationMessage.style.display = 'flex';
                }, 2500);
            });

            const confirmationCloseBtn = modalConfirmationMessage.querySelector('.close-modal-btn');
            if (confirmationCloseBtn) {
                confirmationCloseBtn.addEventListener('click', closeModal);
            }
        }
    }

    // --- Sign Up Form Logic ---
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert("Passwords do not match. Please try again.");
                return; // Stop the submission
            }

            // Simulate account creation
            const signupButton = this.querySelector('.login-button');
            signupButton.disabled = true;
            signupButton.textContent = 'Creating...';

            setTimeout(() => {
                triggerTransition("New User"); // Trigger transition after signup
            }, 1500);
        });
    }
});