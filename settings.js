document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    if (!profileForm) return;

    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-changes-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const inputs = profileForm.querySelectorAll('input:not([type="file"])');

    let originalValues = {};

    function toggleFormState(isEditing) {
        inputs.forEach(input => {
            input.disabled = !isEditing;
            if (isEditing) {
                // Store original values when starting to edit
                originalValues[input.id] = input.value;
            }
        });

        editBtn.style.display = isEditing ? 'none' : 'block';
        saveBtn.style.display = isEditing ? 'block' : 'none';
        cancelBtn.style.display = isEditing ? 'block' : 'none';
    }

    editBtn.addEventListener('click', () => {
        toggleFormState(true);
    });

    cancelBtn.addEventListener('click', () => {
        // Restore original values on cancel
        inputs.forEach(input => {
            input.value = originalValues[input.id];
        });
        toggleFormState(false);
    });

    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // Simulate saving data
        console.log('Profile changes saved!');
        alert('Profile updated successfully!');
        toggleFormState(false);
    });

    // --- Change Password Form Logic ---
    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-new-password').value;

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match.');
                return;
            }
            alert('Password updated successfully! (Demo)');
            changePasswordForm.reset();
        });
    }

    // --- Account Management & Confirmation Modal Logic ---
    const confirmationModalOverlay = document.getElementById('confirmationModalOverlay');
    if (confirmationModalOverlay) {
        const logoutBtn = document.getElementById('logout-action-btn');
        const deactivateBtn = document.getElementById('deactivate-action-btn');
        const modalTitle = document.getElementById('modal-title');
        const modalText = document.getElementById('modal-text');
        const modalConfirmBtn = document.getElementById('modal-confirm-btn');
        const modalCancelBtn = document.getElementById('modal-cancel-btn');

        let currentAction = null;

        const openModal = (action) => {
            currentAction = action;
            if (action === 'logout') {
                modalTitle.textContent = 'Confirm Logout';
                modalText.textContent = 'Are you sure you want to log out from your account?';
                modalConfirmBtn.textContent = 'Logout';
                modalConfirmBtn.classList.remove('btn-danger');
            } else if (action === 'deactivate') {
                modalTitle.textContent = 'Confirm Deactivation';
                modalText.textContent = 'This will permanently deactivate your account. This action cannot be undone.';
                modalConfirmBtn.textContent = 'Deactivate';
                modalConfirmBtn.classList.add('btn-danger');
            }
            confirmationModalOverlay.classList.add('active');
        };

        const closeModal = () => confirmationModalOverlay.classList.remove('active');

        logoutBtn.addEventListener('click', () => openModal('logout'));
        deactivateBtn.addEventListener('click', () => openModal('deactivate'));
        modalCancelBtn.addEventListener('click', closeModal);
        confirmationModalOverlay.addEventListener('click', (e) => e.target === confirmationModalOverlay && closeModal());

        modalConfirmBtn.addEventListener('click', () => {
            if (currentAction === 'logout') {
                window.location.href = 'login.html';
            } else if (currentAction === 'deactivate') {
                alert('Account deactivated. (Demo)');
                window.location.href = 'login.html';
            }
        });
    }
});