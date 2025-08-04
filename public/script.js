const API_BASE = '';

// Helper function to display messages
function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${isError ? 'error' : 'success'}`;
    
    // Auto-hide success messages after 5 seconds
    if (!isError) {
        setTimeout(() => {
            element.textContent = '';
            element.className = 'message';
        }, 5000);
    }
}

// Helper function to make API calls
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return { data, status: response.status, ok: response.ok };
    } catch (error) {
        return { 
            data: { error: error.message }, 
            status: 0, 
            ok: false 
        };
    }
}

// Register new user
async function registerUser(formData) {
    const { data, ok } = await makeRequest(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if (ok) {
        showMessage('registrationMessage', 'User registered successfully! 🎉', false);
        document.getElementById('registrationForm').reset();
    } else {
        showMessage('registrationMessage', `Registration failed: ${data.error || 'Unknown error'}`, true);
    }
}

// Fill sample registration data
function fillSampleData() {
    document.getElementById('name').value = 'John Doe';
    document.getElementById('email').value = 'john.doe@example.com';
    document.getElementById('referralCode').value = 'ABC123';
}

// Search user by referral code
async function searchUser() {
    const referralCode = document.getElementById('searchReferralCode').value.trim();
    
    if (!referralCode) {
        showMessage('searchMessage', 'Please enter a referral code', true);
        return;
    }

    // First, load all users
    const { data, ok } = await makeRequest(`${API_BASE}/api/users`);
    
    if (ok && data.users) {
        // Filter users by referral code
        const filteredUsers = data.users.filter(user => 
            user.referralCode.toLowerCase().includes(referralCode.toLowerCase())
        );
        
        if (filteredUsers.length > 0) {
            displayUsers(filteredUsers);
            showMessage('searchMessage', `Found ${filteredUsers.length} user(s) with referral code containing "${referralCode}"`, false);
        } else {
            displayUsers([]);
            showMessage('searchMessage', `No users found with referral code containing "${referralCode}"`, true);
        }
    } else {
        showMessage('searchMessage', `Error loading users: ${data.error || 'Unknown error'}`, true);
    }
}

// Load and display all users
async function loadUsers() {
    const container = document.getElementById('usersContainer');
    if (container) {
        container.innerHTML = '<div class="loading">Loading users...</div>';
    }

    const { data, ok } = await makeRequest(`${API_BASE}/api/users`);
    
    if (ok && data.users) {
        displayUsers(data.users);
    } else {
        if (container) {
            container.innerHTML = '<div class="message error">Error loading users: ' + (data.error || 'Unknown error') + '</div>';
        }
    }
}

// Display users in a grid
function displayUsers(users) {
    const container = document.getElementById('usersContainer');
    if (!container) return;
    
    if (users.length === 0) {
        container.innerHTML = '<div class="message">No users registered yet.</div>';
        return;
    }

    let html = '<div class="users-grid">';
    users.forEach(user => {
        html += `
            <div class="user-card">
                <h4>${user.name}</h4>
                <div class="user-detail">
                    <strong>Email:</strong>
                    <span>${user.email}</span>
                </div>
                <div class="user-detail">
                    <strong>Referral Code:</strong>
                    <span class="badge referral">${user.referralCode}</span>
                </div>
                <div class="user-detail">
                    <strong>Points:</strong>
                    <span class="badge points">${user.points}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

// Clear search results
function clearSearch() {
    document.getElementById('searchReferralCode').value = '';
    loadUsers(); // Reload all users to show the full list
    document.getElementById('searchMessage').textContent = '';
    document.getElementById('searchMessage').className = 'message';
}

// Initialize page-specific functionality
function initializePage() {
    // Registration form handler
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                referralCode: document.getElementById('referralCode').value.trim()
            };

            // Validate required fields
            if (!formData.name || !formData.email) {
                showMessage('registrationMessage', 'Please fill in all required fields', true);
                return;
            }

            // Remove referralCode if empty
            if (!formData.referralCode) {
                delete formData.referralCode;
            }

            registerUser(formData);
        });
    }

    // Load users if on users page
    if (document.getElementById('usersContainer')) {
        loadUsers();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage); 