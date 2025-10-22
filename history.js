document.addEventListener('DOMContentLoaded', () => {
    const filterType = document.getElementById('filter-type');
    const filterDate = document.getElementById('filter-date');
    const filterStatus = document.getElementById('filter-status');
    const searchInput = document.getElementById('search-input');
    const transactionsTbody = document.getElementById('transactions-tbody');
    const transactionRows = Array.from(transactionsTbody.querySelectorAll('tr:not(.no-results-row)'));
    const noResultsRow = transactionsTbody.querySelector('.no-results-row');
    const exportBtn = document.querySelector('.export-btn');
    const totalInEl = document.getElementById('total-in');
    const totalOutEl = document.getElementById('total-out');
    const historyChartCanvas = document.getElementById('history-trends-chart');

    // --- Initial State Check ---
    if (transactionRows.length === 0) {
        noResultsRow.style.display = '';
        noResultsRow.querySelector('td').textContent = 'No transactions yet. Start by making your first transfer!';
        // Hide filters and other elements if there's no data
        document.querySelector('.filters').style.display = 'none';
        document.querySelector('.history-summary').style.display = 'none';
        document.querySelector('.chart-container-history').style.display = 'none';
        return; // Stop further execution
    }

    // --- Calculate Monthly Totals ---
    function calculateMonthlyTotals() {
        let totalIn = 0;
        let totalOut = 0;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        transactionRows.forEach(row => {
            const rowDate = new Date(row.dataset.date);
            if (rowDate.getMonth() === currentMonth && rowDate.getFullYear() === currentYear) {
                const amountText = row.cells[3].textContent;
                const amount = parseFloat(amountText.replace(/[^0-9.-]+/g, ""));

                if (amount > 0) {
                    totalIn += amount;
                } else {
                    totalOut += amount;
                }
            }
        });

        totalInEl.textContent = `+$${totalIn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        totalOutEl.textContent = `-$${Math.abs(totalOut).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // --- Filter Logic ---
    function filterTransactions() {
        const typeValue = filterType.value;
        const dateValue = filterDate.value;
        const statusValue = filterStatus.value;
        const searchValue = searchInput.value.toLowerCase();

        let visibleCount = 0;

        transactionRows.forEach(row => {
            const type = row.dataset.type;
            const status = row.dataset.status;
            const date = new Date(row.dataset.date);
            const description = row.cells[2].textContent.toLowerCase();
            const amount = row.cells[3].textContent.toLowerCase();

            // Date filter logic
            const today = new Date();
            let dateFilterPassed = true;
            if (dateValue !== 'all') {
                const daysAgo = parseInt(dateValue);
                const filterDate = new Date();
                filterDate.setDate(today.getDate() - daysAgo);
                dateFilterPassed = date >= filterDate;
            }

            // Show/hide logic
            const typeFilterPassed = typeValue === 'all' || type === typeValue;
            const statusFilterPassed = statusValue === 'all' || status === statusValue;
            const searchFilterPassed = searchValue === '' || description.includes(searchValue) || amount.includes(searchValue);

            if (typeFilterPassed && statusFilterPassed && dateFilterPassed && searchFilterPassed) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // Show "no results" message if applicable
        noResultsRow.querySelector('td').textContent = 'No transactions found matching your criteria.';
        noResultsRow.style.display = visibleCount === 0 ? '' : 'none';
    }

    // Add event listeners to all filter controls
    filterType.addEventListener('change', filterTransactions);
    filterDate.addEventListener('change', filterTransactions);
    filterStatus.addEventListener('change', filterTransactions);
    searchInput.addEventListener('input', filterTransactions);

    // Export button functionality (for show)
    exportBtn.addEventListener('click', () => {
        alert('Statement download initiated! (This is a demo feature)');
    });

    // --- Render Chart ---
    function renderHistoryChart() {
        if (!historyChartCanvas) return;
        const ctx = historyChartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['August', 'September', 'October'],
                datasets: [{
                    label: 'Total In',
                    data: [1500, 2800, 3000], // Dummy data
                    backgroundColor: 'rgba(40, 167, 69, 0.6)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                }, {
                    label: 'Total Out',
                    data: [1200, 1900, 495], // Dummy data
                    backgroundColor: 'rgba(220, 53, 69, 0.6)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // --- Initial Calls ---
    calculateMonthlyTotals();
    renderHistoryChart();
});