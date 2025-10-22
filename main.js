document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('mainNavbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Adjust scroll threshold as needed
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Fade-in on Scroll for Features ---
    const featureItems = document.querySelectorAll('.feature-item');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item must be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    featureItems.forEach(item => {
        observer.observe(item);
    });

    // --- Theme Switcher ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Apply saved theme on load
    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (currentTheme === 'light-mode') {
            themeToggle.checked = true;
        }
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark-mode');
        }
    });

    // --- Onboarding Modal Logic ---
    const openAccountBtns = document.querySelectorAll('.open-account-btn'); // Select all buttons that open the modal
    const onboardingOverlay = document.getElementById('onboardingOverlay');
    const closeOnboardingBtn = document.getElementById('closeOnboardingBtn');

    if (openAccountBtns.length > 0 && onboardingOverlay && closeOnboardingBtn) {
        openAccountBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                onboardingOverlay.classList.add('active');
            });
        });

        // Also handle the hero section's "Create Account" link if it's different
        const heroCreateBtn = document.querySelector('.btn-cta');
        if (heroCreateBtn && heroCreateBtn.classList.contains('open-account-btn')) {
            // This is already covered by the querySelectorAll above
        }

        closeOnboardingBtn.addEventListener('click', () => {
            onboardingOverlay.classList.remove('active');
            // Reset to step 1 for next time
            document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
            document.getElementById('onboarding-step-1').classList.add('active');
            document.querySelectorAll('.progress-step').forEach(p => {
                p.classList.remove('active');
                if (p.dataset.step === '1') {
                    p.classList.add('active');
                }
            });
        });

        // --- Onboarding Step Transitions ---
        const step1 = document.getElementById('onboarding-step-1');
        const step2 = document.getElementById('onboarding-step-2');
        const step3 = document.getElementById('onboarding-step-3');
        const step4 = document.getElementById('onboarding-step-4');

        const continueStep1Btn = document.getElementById('continue-step-1');
        const continueStep2Btn = document.getElementById('continue-step-2');
        const continueStep3Btn = document.getElementById('continue-step-3');
        const continueStep4Btn = document.getElementById('continue-step-4');

        let onboardingData = {}; // Object to store user's choices

        const backToStep1Btn = document.getElementById('back-to-step-1');
        const backToStep2Btn = document.getElementById('back-to-step-2');
        const backToStep3Btn = document.getElementById('back-to-step-3');

        const accountTypeCards = document.querySelectorAll('.account-type-card');
        const progressSteps = document.querySelectorAll('.progress-step');

        function updateProgress(stepNumber) {
            progressSteps.forEach(p => {
                p.classList.toggle('active', p.dataset.step <= stepNumber);
            });
        }

        continueStep1Btn.addEventListener('click', () => {
            onboardingData.name = document.getElementById('onboarding-name').value || 'User';
            // In a real app, you'd also validate the inputs here
            step1.classList.remove('active');
            step2.classList.add('active');
            updateProgress(2);
        });

        backToStep1Btn.addEventListener('click', () => {
            step2.classList.remove('active');
            step1.classList.add('active');
            updateProgress(1);
        });

        backToStep2Btn.addEventListener('click', () => {
            step3.classList.remove('active');
            step2.classList.add('active');
            updateProgress(2);
        });

        backToStep3Btn.addEventListener('click', () => {
            step4.classList.remove('active');
            step3.classList.add('active');
            updateProgress(3);
        });

        accountTypeCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove 'selected' from all cards
                accountTypeCards.forEach(c => c.classList.remove('selected'));
                // Add 'selected' to the clicked card
                card.classList.add('selected');
                // Enable the continue button
                continueStep2Btn.disabled = false;
            });
        });

        if (continueStep2Btn) {
            continueStep2Btn.addEventListener('click', () => {
                if (!continueStep2Btn.disabled) {
                    const selectedType = onboardingData.accountType = document.querySelector('.account-type-card.selected').dataset.accountType;
                    console.log('Selected Account Type:', selectedType);
                    step2.classList.remove('active');
                    step3.classList.add('active');
                    updateProgress(3);
                }
            });
        }

        if (continueStep3Btn) {
            continueStep3Btn.addEventListener('click', () => {
                const password = document.getElementById('onboarding-password').value;
                const confirmPassword = document.getElementById('onboarding-confirm-password').value;
                if (password !== confirmPassword) {
                    alert('Passwords do not match.');
                    return;
                }
                // Transition to OTP step
                step3.classList.remove('active');
                step4.classList.add('active');
                updateProgress(4);
                startOtpTimer();
            });
        }

        // --- Password Strength Meter Logic ---
        const passwordInput = document.getElementById('onboarding-password');
        const strengthBars = document.querySelectorAll('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                const password = passwordInput.value;
                let score = 0;
                let text = '';
                let strengthClass = '';

                if (password.length >= 8) score++;
                if (/[A-Z]/.test(password)) score++;
                if (/[0-9]/.test(password)) score++;
                if (/[^A-Za-z0-9]/.test(password)) score++;

                strengthBars.forEach(bar => bar.className = 'strength-bar');

                if (password.length > 0) {
                    switch (score) {
                        case 1:
                            text = 'Weak';
                            strengthClass = 'weak';
                            strengthBars[0].classList.add('weak');
                            break;
                        case 2:
                            text = 'Medium';
                            strengthClass = 'medium';
                            Array.from(strengthBars).slice(0, 2).forEach(b => b.classList.add('medium'));
                            break;
                        case 3:
                            text = 'Strong';
                            strengthClass = 'strong';
                            Array.from(strengthBars).slice(0, 3).forEach(b => b.classList.add('strong'));
                            break;
                        case 4:
                            text = 'Very Strong';
                            strengthClass = 'strong'; // Use same color as strong
                            strengthBars.forEach(b => b.classList.add('strong'));
                            break;
                    }
                }
                strengthText.textContent = text;
                strengthText.className = `strength-text ${strengthClass}`;
            });
        }

        // --- OTP Timer and Final Step Logic ---
        function startOtpTimer() {
            const timerEl = document.getElementById('otp-timer');
            let timeLeft = 60;
            timerEl.textContent = timeLeft;

            const timerInterval = setInterval(() => {
                timeLeft--;
                timerEl.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    document.querySelector('.otp-timer-text').innerHTML = '<a href="#">Resend Code</a>';
                }
            }, 1000);
        }

        if (continueStep4Btn) {
            continueStep4Btn.addEventListener('click', () => {
                const otp = document.getElementById('onboarding-otp').value;
                if (otp.length !== 6) {
                    alert('Please enter a valid 6-digit OTP.');
                    return;
                }

                // --- Show Final Success Screen ---
                document.getElementById('otp-view').style.display = 'none';
                document.getElementById('final-success-view').style.display = 'block';
                triggerConfetti();

                // Populate final screen with user data
                document.getElementById('final-welcome-message').innerHTML = `Welcome to Vault, ${onboardingData.name}!`;
                document.getElementById('summary-account-type').textContent = onboardingData.accountType.charAt(0).toUpperCase() + onboardingData.accountType.slice(1);
                document.getElementById('summary-status').textContent = 'Verified';
                document.getElementById('summary-balance').textContent = 'Ksh 0.00';

                // Add listener to the final button
                document.getElementById('go-to-dashboard-btn').addEventListener('click', triggerDashboardTransition);
            });
        }

        function triggerConfetti() {
            const container = document.querySelector('.confetti-container');
            if (!container) return;
            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti');
                confetti.style.left = `${Math.random() * 100}vw`;
                confetti.style.animationDelay = `${Math.random() * 2}s`;
                confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                container.appendChild(confetti);
            }
        }

        function triggerDashboardTransition() {
            const overlay = document.getElementById('onboardingOverlay');
            const transitionOverlay = document.getElementById('transitionOverlay');
            
            // Add dynamic content for the animation
            transitionOverlay.innerHTML = `
                <div class="transition-content">
                    <div class="unlock-animation"><i></i></div>
                    <p id="transitionText">Finalizing setup...</p>
                </div>`;

            overlay.classList.remove('active'); // Hide onboarding modal
            transitionOverlay.classList.add('active'); // Show transition

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 3000); // Match animation duration
        }
    }
});