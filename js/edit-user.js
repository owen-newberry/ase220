const token = localStorage.getItem('jwt');
const baseUrl = 'http://localhost:5000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-form');
    const fieldSelect = document.getElementById('field');
    const currentValueGroup = document.getElementById('current-value-group');
    const currentValueInput = document.getElementById('currentValue');
    const currentValueLabel = document.getElementById('current-value-label');
    const newValueGroup = document.getElementById('new-value-group');
    const newValueInput = document.getElementById('newValue');
    const newValueLabel = document.getElementById('new-value-label');
    const statusDiv = document.getElementById('status');
    const deleteBtn = document.getElementById('delete-account');

    fieldSelect.addEventListener('change', () => {
        if (fieldSelect.value) {
            currentValueInput.value = '';
            newValueInput.value = '';
            currentValueLabel.textContent = `Current ${capitalize(fieldSelect.value)}`;
            newValueLabel.textContent = `New ${capitalize(fieldSelect.value)}`;
            newValueInput.type = fieldSelect.value === 'password' ? 'password' : 'text';
            currentValueGroup.classList.remove('d-none');
            newValueGroup.classList.remove('d-none');
        } else {
            currentValueGroup.classList.add('d-none');
            newValueGroup.classList.add('d-none');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const field = fieldSelect.value;
        const currentValue = currentValueInput.value.trim();
        const newValue = newValueInput.value.trim();
    
        if (!field || !currentValue || !newValue) {
            showStatus('Please complete all fields.', 'danger');
            return;
        }
    
        try {
            const verifyResponse = await fetch(`${baseUrl}/verify-${field}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: currentValue })
            });
    
            const verifyData = await verifyResponse.json();
    
            if (!verifyResponse.ok) {
                showStatus(verifyData.error || 'Current value is incorrect.', 'danger');
                return;
            }
    
            const response = await fetch(`${baseUrl}/${field}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: newValue })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                showStatus(`${capitalize(field)} updated successfully!`, 'success');
                form.reset();
                newValueGroup.classList.add('d-none');
            } else {
                showStatus(data.error || 'Update failed.', 'danger');
            }
        } catch (err) {
            showStatus('Server error.', 'danger');
        }
    });
    
    deleteBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    
        try {
            const res = await fetch(`${baseUrl}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const data = await res.json();
    
            if (res.ok) {
                alert('Account deleted.');
                window.location.href = '../auth/index.html';
            } else {
                showStatus(data.error || 'Failed to delete account.', 'danger');
            }
        } catch (err) {
            showStatus('Server error.', 'danger');
        }
    });
    

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `alert alert-${type}`;
        statusDiv.classList.remove('d-none');
    }

    function capitalize(str) {
        return str[0].toUpperCase() + str.slice(1);
    }
});

document.getElementById('back-btn').onclick = () => {
    window.location.href = `../campaign/index.html`;
};