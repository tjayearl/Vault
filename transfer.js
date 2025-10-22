document.addEventListener('DOMContentLoaded', () => {
    const step1 = document.getElementById('transfer-form-step1');
    const step2 = document.getElementById('transfer-form-step2');
    const step3 = document.getElementById('transfer-form-step3');

    const progressStep1 = document.getElementById('step-1');
    const progressStep2 = document.getElementById('step-2');
    const progressStep3 = document.getElementById('step-3');

    const nextToStep2Btn = document.getElementById('next-to-step2');
    const backToStep1Btn = document.getElementById('back-to-step1');
    const confirmTransferBtn = document.getElementById('confirm-transfer');

    const reviewDetails = document.getElementById('review-details');

    // Form fields and error elements
    const fromAccountSelect = document.getElementById('from-account');
    const toAccountInput = document.getElementById('to-account');
    const amountInput = document.getElementById('amount');
    const toAccountError = document.getElementById('to-account-error');
    const amountError = document.getElementById('amount-error');
    const remainingBalanceSpan = document.getElementById('remaining-balance');
    
    // PIN Modal Elements
    const pinModalOverlay = document.getElementById('pinModalOverlay');
    const closePinModalBtn = document.getElementById('closePinModal');
    const pinForm = document.getElementById('pinForm');
    const pinModalSummary = document.getElementById('pin-modal-summary');
    const transactionIdElement = document.getElementById('transaction-id');
    const successSummaryDetails = document.getElementById('success-summary-details');
    const makeAnotherTransferBtn = document.getElementById('make-another-transfer');

    if (!step1 || !step2 || !step3) return; // Exit if not on transfer page

    // --- MOCK DATA ---
    const accountBalances = {
        checking: 5450.75,
        savings: 25180.50,
    };

    // --- UX Enhancements ---
    amountInput.addEventListener('input', () => {
        const selectedAccount = fromAccountSelect.value;
        const currentBalance = accountBalances[selectedAccount];
        const transferAmount = parseFloat(amountInput.value) || 0;
        const fee = 1.00;
        const remaining = currentBalance - transferAmount - fee;
        remainingBalanceSpan.textContent = `$${remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    });

    document.querySelectorAll('.recipient-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            // In a real app, you'd have an object mapping names to account numbers
            const recipientData = {
                "John Doe": "1234567890",
                "Landlord": "0987654321",
                "Jane Smith": "1122334455"
            };
            toAccountInput.value = recipientData[tag.textContent] || '';
        });
    });

    nextToStep2Btn.addEventListener('click', () => {
        // --- Validation ---
        let isValid = true;
        toAccountError.textContent = '';
        amountError.textContent = '';

        const transferAmount = parseFloat(amountInput.value);
        const currentBalance = accountBalances[fromAccountSelect.value];

        if (!toAccountInput.value) {
            toAccountError.textContent = 'Recipient account number is required.';
            isValid = false;
        }
        if (isNaN(transferAmount) || transferAmount <= 0) {
            amountError.textContent = 'Please enter a valid amount.';
            isValid = false;
        } else if (transferAmount + 1.00 > currentBalance) { // +1 for fee
            amountError.textContent = 'Insufficient balance for this transfer.';
            isValid = false;
        }

        if (!isValid) return;

        // --- Populate Review Step ---
        const fromAccount = fromAccountSelect.selectedOptions[0].text;
        const toAccount = toAccountInput.value;
        const description = document.getElementById('description').value;

        reviewDetails.innerHTML = `
            <p><span>From:</span> <span>${fromAccount}</span></p>
            <p><span>To:</span> <span>${toAccount}</span></p>
            <p><span>Amount:</span> <span>$${transferAmount.toFixed(2)}</span></p>
            <p><span>Description:</span> <span>${description || 'N/A'}</span></p>
        `;

        step1.classList.remove('active');
        step2.classList.add('active');
        progressStep1.classList.remove('active');
        progressStep2.classList.add('active');
    });

    backToStep1Btn.addEventListener('click', () => {
        step2.classList.remove('active');
        step1.classList.add('active');
        progressStep2.classList.remove('active');
        progressStep1.classList.add('active');
    });

    confirmTransferBtn.addEventListener('click', () => {
        // Show PIN confirmation modal instead of directly transferring
        const amount = amountInput.value;
        const toAccount = toAccountInput.value;
        pinModalSummary.textContent = `You are sending $${parseFloat(amount).toFixed(2)} to account ${toAccount}.`;
        pinModalOverlay.classList.add('active');
    });

    makeAnotherTransferBtn.addEventListener('click', () => {
        // Reset all steps and progress indicators
        step3.classList.remove('active');
        step1.classList.add('active');
        progressStep3.classList.remove('active');
        progressStep1.classList.add('active');

        // Clear form fields
        toAccountInput.value = '';
        amountInput.value = '';
        document.getElementById('description').value = '';

        // Reset error messages and balance info
        toAccountError.textContent = '';
        amountError.textContent = '';
        amountInput.dispatchEvent(new Event('input')); // Trigger balance update
    });

    // --- PIN Modal Logic ---
    if (pinModalOverlay) {
        closePinModalBtn.addEventListener('click', () => {
            pinModalOverlay.classList.remove('active');
        });

        pinModalOverlay.addEventListener('click', (event) => {
            if (event.target === pinModalOverlay) {
                pinModalOverlay.classList.remove('active');
            }
        });

        pinForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const pinCode = document.getElementById('pin-code').value;

            // Basic PIN validation
            if (pinCode.length !== 4 || !/^\d{4}$/.test(pinCode)) {
                alert('Please enter a valid 4-digit PIN.');
                return;
            }

            // Simulate API call after PIN verification
            const authButton = document.getElementById('authorize-btn');
            const btnText = authButton.querySelector('.btn-text');
            const btnSpinner = authButton.querySelector('.btn-spinner');
            
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';
            authButton.disabled = true;

            setTimeout(() => {
                // Generate a random transaction ID
                const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
                transactionIdElement.textContent = `Transaction ID: #VAULT${randomId}`;

                // Populate success summary
                const fromAccount = fromAccountSelect.selectedOptions[0].text;
                const toAccount = toAccountInput.value;
                const amount = amountInput.value;
                successSummaryDetails.innerHTML = `
                    <p><span>From:</span> <span>${fromAccount}</span></p>
                    <p><span>To:</span> <span>${toAccount}</span></p>
                    <p><span>Amount:</span> <span>$${parseFloat(amount).toFixed(2)}</span></p>
                    <p><span>Transaction ID:</span> <span>#VAULT${randomId}</span></p>
                `;

                step2.classList.remove('active');
                step3.classList.add('active');
                progressStep2.classList.remove('active');
                progressStep3.classList.add('active');

                // Reset button and modal
                pinModalOverlay.classList.remove('active');
                btnText.style.display = 'inline-block';
                btnSpinner.style.display = 'none';
                authButton.disabled = false;
                document.getElementById('pin-code').value = '';
            }, 1500);
        });
    }
});