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

    function animateCountUp(element, endValue) {
        let startValue = 0;
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

    animateCountUp(balanceAmountElement, finalBalance);


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

});