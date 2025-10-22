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
    if (mainLoginForm) {
        const loginButton = mainLoginForm.querySelector('.login-button');
        const loadingSpinner = mainLoginForm.querySelector('.loading-spinner');

        if (loginButton && loadingSpinner) {
            mainLoginForm.addEventListener('submit', function (event) {
                event.preventDefault();

                loginButton.disabled = true;
                loginButton.style.opacity = '0.7';
                loadingSpinner.style.display = 'block';

                setTimeout(() => {
                    alert('Simulated login attempt.');
                    loginButton.disabled = false;
                    loginButton.style.opacity = '1';
                    loadingSpinner.style.display = 'none';
                }, 2000);
            });
        }
    }

    // --- Forgot Password Modal Logic ---
    const forgotPasswordLink = document.querySelector('.forgot-password-link');
    if (forgotPasswordLink) {
        const forgotPasswordModalOverlay = document.getElementById('forgotPasswordModalOverlay');
        const closeForgotPasswordModalBtn = document.getElementById('closeForgotPasswordModal');
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        const modalSendingAnimation = document.querySelector('.modal-sending-animation');
        const modalConfirmationMessage = document.querySelector('.modal-confirmation-message');

        if (forgotPasswordModalOverlay && closeForgotPasswordModalBtn && forgotPasswordForm) {
            forgotPasswordLink.addEventListener('click', (event) => {
                event.preventDefault();
                forgotPasswordModalOverlay.classList.add('active');
                forgotPasswordForm.style.display = 'block';
                modalSendingAnimation.style.display = 'none';
                modalConfirmationMessage.style.display = 'none';
                document.getElementById('forgotEmail').value = '';
            });

            const closeModal = () => forgotPasswordModalOverlay.classList.remove('active');

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
                alert('Welcome to Vault! Your account has been created successfully.');
                // Redirect to the login page after successful creation
                window.location.href = 'login.html';
            }, 2000);
        });
    }
});