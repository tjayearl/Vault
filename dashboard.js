document.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Greeting and Last Login
    const greetingElement = document.getElementById('greeting');
    const lastLoginElement = document.getElementById('last-login-timestamp');

    function setGreeting() {
        const hour = new Date().getHours();
        let greetingText;
        if (hour < 12) {
            greetingText = "Good morning, Tjay 👋";
        } else if (hour < 18) {
            greetingText = "Good afternoon, Tjay 👋";
        } else {
            greetingText = "Good evening, Tjay 👋";
        }
        greetingElement.textContent = greetingText;
    }

    function setLastLogin() {
        // In a real app, this date would come from a server/API
        const lastLoginDate = new Date(); 
        lastLoginDate.setDate(lastLoginDate.getDate() - 1); // Simulate yesterday
        lastLoginDate.setHours(10, 30, 0);

        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        lastLoginElement.textContent = lastLoginDate.toLocaleDateString('en-US', options);
    }

    setGreeting();
    setLastLogin();


    // 2. Animated Count-Up for Balance
    const balanceAmountElement = document.getElementById('balance-amount');
    const finalBalance = 30631.25; // Target balance

    function animateCountUp(element, startValue, endValue) {
        const duration = 1500; // 1.5 seconds
        const startTime = performance.now();

        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                element.textContent = `$${endValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                return;
            }

            const progress = elapsedTime / duration;
            const currentValue = startValue + (endValue - startValue) * progress;
            element.textContent = `$${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    animateCountUp(balanceAmountElement, 0, finalBalance);


    // 3. Chart.js Pie Chart for Expenses
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Groceries', 'Utilities', 'Rent', 'Entertainment', 'Transport'],
            datasets: [{
                label: 'Expenses',
                data: [450, 220, 1200, 310, 180],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',  // Pink
                    'rgba(54, 162, 235, 0.8)',  // Blue
                    'rgba(255, 206, 86, 0.8)',  // Yellow
                    'rgba(75, 192, 192, 0.8)',  // Cyan
                    'rgba(153, 102, 255, 0.8)'  // Purple
                ],
                borderColor: 'rgba(255, 255, 255, 0.7)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' } }
        }
    });

    // 4. Chart.js Line Chart for Spending Trends
    const trendsCtx = document.getElementById('spendingTrendsChart').getContext('2d');
    const spendingTrendsChart = new Chart(trendsCtx, {
        type: 'line',
        data: {
            labels: ['June', 'July', 'August', 'September', 'October'],
            datasets: [{
                label: 'Monthly Spending',
                data: [850, 920, 780, 1100, 950],
                backgroundColor: 'rgba(255, 0, 127, 0.2)',
                borderColor: 'rgba(255, 0, 127, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) { return '$' + value; }
                    }
                }
            }
        }
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
            // When unchecking, explicitly set to dark-mode in case the default is ever changed
            localStorage.setItem('theme', 'dark-mode');
        }
    });

    // --- Mobile Sidebar Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
    }

    if (menuToggle && sidebar && sidebarOverlay) {
        menuToggle.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // --- Pay Bills Modal Logic ---
    const payBillsAction = document.getElementById('pay-bills-action');
    const payBillsModalOverlay = document.getElementById('payBillsModalOverlay');
    const closePayBillsModalBtn = document.getElementById('closePayBillsModal');
    const payBillsForm = document.getElementById('pay-bills-form');
    const payAnotherBillBtn = document.getElementById('pay-another-bill-btn');

    if (payBillsAction && payBillsModalOverlay) {
        const formView = document.getElementById('pay-bills-form-view');
        const successView = document.getElementById('pay-bills-success-view');

        const openModal = () => payBillsModalOverlay.classList.add('active');
        const closeModal = () => payBillsModalOverlay.classList.remove('active');

        payBillsAction.addEventListener('click', openModal);
        closePayBillsModalBtn.addEventListener('click', closeModal);
        payBillsModalOverlay.addEventListener('click', (e) => {
            if (e.target === payBillsModalOverlay) closeModal();
        });

        // Handle schedule toggle
        const scheduleToggle = document.getElementById('schedule-toggle');
        const scheduleDateGroup = document.getElementById('schedule-date-group');
        scheduleToggle.addEventListener('change', function() {
            if (this.checked) {
                scheduleDateGroup.style.display = 'block';
            } else {
                scheduleDateGroup.style.display = 'none';
            }
        });

        // Handle recent bill tags
        document.querySelectorAll('.bill-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.getElementById('bill-type').value = tag.dataset.biller;
                document.getElementById('bill-ref').value = tag.dataset.ref;
                document.getElementById('bill-amount').value = tag.dataset.amount;
            });
        });

        // Handle form submission
        payBillsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const payBtn = document.getElementById('pay-bill-btn');
            const btnText = payBtn.querySelector('.btn-text');
            const btnSpinner = payBtn.querySelector('.btn-spinner');

            // Show spinner
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';
            payBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                const biller = document.getElementById('bill-type').value;
                const amount = document.getElementById('bill-amount').value;
                const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();

                document.getElementById('success-summary-text').textContent = `✅ Bill paid successfully — KSh ${parseFloat(amount).toLocaleString()} to ${biller}.`;
                document.getElementById('success-ref-text').textContent = `Reference: #VAULT${randomId}`;

                // Switch to success view
                formView.style.display = 'none';
                successView.style.display = 'block';

                // Reset button
                btnText.style.display = 'inline-block';
                btnSpinner.style.display = 'none';
                payBtn.disabled = false;
            }, 2000);
        });

        // Handle "Pay Another Bill"
        payAnotherBillBtn.addEventListener('click', () => {
            successView.style.display = 'none';
            formView.style.display = 'block';
            payBillsForm.reset();
        });
    }

    // --- Deposit Modal Logic ---
    const depositAction = document.getElementById('deposit-action');
    const depositModalOverlay = document.getElementById('depositModalOverlay');
    const closeDepositModalBtn = document.getElementById('closeDepositModal');
    const depositForm = document.getElementById('deposit-form');
    const makeAnotherDepositBtn = document.getElementById('make-another-deposit-btn');

    if (depositAction && depositModalOverlay) {
        const formView = document.getElementById('deposit-form-view');
        const successView = document.getElementById('deposit-success-view');

        const openModal = () => depositModalOverlay.classList.add('active');
        const closeModal = () => depositModalOverlay.classList.remove('active');

        depositAction.addEventListener('click', openModal);
        closeDepositModalBtn.addEventListener('click', closeModal);
        depositModalOverlay.addEventListener('click', (e) => {
            if (e.target === depositModalOverlay) closeModal();
        });

        // Handle connected account buttons
        document.querySelectorAll('.account-item').forEach(item => {
            item.addEventListener('click', () => {
                document.getElementById('deposit-method').value = item.dataset.method;
                // You could also pre-fill notes, e.g., `Deposit from ${item.dataset.source}`
            });
        });

        // Handle form submission
        depositForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const confirmBtn = document.getElementById('confirm-deposit-btn');
            const btnText = confirmBtn.querySelector('.btn-text');
            const btnSpinner = confirmBtn.querySelector('.btn-spinner');

            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';
            confirmBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                const amount = parseFloat(document.getElementById('deposit-amount').value);
                document.getElementById('deposit-success-summary').textContent = `✅ Deposit Successful — KSh ${amount.toLocaleString()} added to your Vault balance.`;

                // Real-time balance update
                const currentBalanceText = balanceAmountElement.textContent.replace(/[^0-9.-]+/g, "");
                const currentBalance = parseFloat(currentBalanceText);
                const newBalance = currentBalance + amount;
                animateCountUp(balanceAmountElement, currentBalance, newBalance);

                formView.style.display = 'none';
                successView.style.display = 'block';

                btnText.style.display = 'inline-block';
                btnSpinner.style.display = 'none';
                confirmBtn.disabled = false;
            }, 2000);
        });

        // Handle "Make Another Deposit"
        makeAnotherDepositBtn.addEventListener('click', () => {
            successView.style.display = 'none';
            formView.style.display = 'block';
            depositForm.reset();
        });
    }

    // --- Withdraw Modal Logic ---
    const withdrawAction = document.getElementById('withdraw-action');
    const withdrawModalOverlay = document.getElementById('withdrawModalOverlay');
    const closeWithdrawModalBtn = document.getElementById('closeWithdrawModal');
    const withdrawForm = document.getElementById('withdraw-form');
    const makeAnotherWithdrawalBtn = document.getElementById('make-another-withdrawal-btn');

    if (withdrawAction && withdrawModalOverlay) {
        const formView = document.getElementById('withdraw-form-view');
        const successView = document.getElementById('withdraw-success-view');
        const amountInput = document.getElementById('withdraw-amount');
        const amountError = document.getElementById('withdraw-amount-error');
        const fromAccountSelect = document.getElementById('withdraw-from');
        const toDestinationSelect = document.getElementById('withdraw-to');
        const withdrawAllBtn = document.getElementById('withdraw-all-btn');
        const processingTimeEl = document.getElementById('processing-time');

        const accountBalances = {
            checking: 5450.75,
            savings: 25180.50,
        };

        const openModal = () => withdrawModalOverlay.classList.add('active');
        const closeModal = () => {
            withdrawModalOverlay.classList.remove('active');
            withdrawForm.reset();
            amountError.textContent = '';
            processingTimeEl.textContent = '--';
        };

        withdrawAction.addEventListener('click', openModal);
        closeWithdrawModalBtn.addEventListener('click', closeModal);
        withdrawModalOverlay.addEventListener('click', (e) => {
            if (e.target === withdrawModalOverlay) closeModal();
        });

        // "Withdraw All" button logic
        withdrawAllBtn.addEventListener('click', () => {
            const selectedAccount = fromAccountSelect.value;
            amountInput.value = accountBalances[selectedAccount];
        });

        // Update processing time based on destination
        toDestinationSelect.addEventListener('change', () => {
            const destination = toDestinationSelect.value;
            const processingTimes = {
                'mpesa': 'Instant',
                'equity': '1-2 hours',
                'pickup': '30 minutes',
                '': '--'
            };
            processingTimeEl.textContent = processingTimes[destination] || 'N/A';
        });
        fromAccountSelect.addEventListener('change', () => {
            amountInput.value = ''; // Clear amount when source changes
        });

        // Handle form submission
        withdrawForm.addEventListener('submit', (e) => {
            e.preventDefault();
            amountError.textContent = ''; // Clear previous errors

            const amount = parseFloat(amountInput.value);
            const selectedAccount = fromAccountSelect.value;
            const currentBalance = accountBalances[selectedAccount];

            // Balance Validation
            if (isNaN(amount) || amount <= 0) {
                amountError.textContent = 'Please enter a valid amount.';
                return;
            }
            if (amount > currentBalance) {
                amountError.textContent = '⚠️ Insufficient funds — please check your balance.';
                return;
            }

            const confirmBtn = document.getElementById('confirm-withdraw-btn');
            const btnText = confirmBtn.querySelector('.btn-text');
            const btnSpinner = confirmBtn.querySelector('.btn-spinner');

            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';
            confirmBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                const destination = document.getElementById('withdraw-to').options[document.getElementById('withdraw-to').selectedIndex].text;
                document.getElementById('withdraw-success-summary').textContent = `✅ Withdrawal Successful — KSh ${amount.toLocaleString()} sent to ${destination}.`;

                // Real-time balance update
                const currentBalanceText = balanceAmountElement.textContent.replace(/[^0-9.-]+/g, "");
                const currentBalance = parseFloat(currentBalanceText);
                const newBalance = currentBalance - amount;
                animateCountUp(balanceAmountElement, currentBalance, newBalance);

                formView.style.display = 'none';
                successView.style.display = 'block';

                btnText.style.display = 'inline-block';
                btnSpinner.style.display = 'none';
                confirmBtn.disabled = false;
            }, 2000);
        });

        makeAnotherWithdrawalBtn.addEventListener('click', () => {
            successView.style.display = 'none';
            formView.style.display = 'block';
            withdrawForm.reset();
        });
    }
});