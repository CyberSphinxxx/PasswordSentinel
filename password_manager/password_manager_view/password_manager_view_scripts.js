function loadPasswords() {
    const passwordList = document.getElementById('passwordList');
    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
    passwordList.innerHTML = '';

    savedPasswords.forEach((encryptedData, index) => {
        try {
            const decryptedData = atob(encryptedData);
            const passwordObject = JSON.parse(decryptedData);

            const passwordListItem = document.createElement('li');
            passwordListItem.className = 'password-list-item';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'password-content';
            contentDiv.innerHTML = `
                <div class="password-info" id="password-info-${index}">
                    <div><strong>Label:</strong> <span class="info-text">${passwordObject.label}</span></div>
                    <div><strong>Username:</strong> <span class="info-text">${passwordObject.username}</span></div>
                    <div class="password-field" style="display: none"><strong>Password:</strong> <span class="info-text">${passwordObject.password}</span></div>
                </div>
            `;

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';

            const showPasswordButton = document.createElement('button');
            showPasswordButton.textContent = 'Show Password';
            showPasswordButton.className = 'action-button';
            showPasswordButton.addEventListener('click', () => togglePassword(index));

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'action-button';
            editButton.addEventListener('click', () => toggleEdit(index, passwordObject));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'action-button delete-button';
            deleteButton.addEventListener('click', () => deletePassword(index));

            buttonGroup.appendChild(showPasswordButton);
            buttonGroup.appendChild(editButton);
            buttonGroup.appendChild(deleteButton);

            passwordListItem.appendChild(contentDiv);
            passwordListItem.appendChild(buttonGroup);
            passwordList.appendChild(passwordListItem);
        } catch (error) {
            console.error('Error decoding password:', error);
        }
    });
}

function togglePassword(index) {
    const passwordField = document.querySelector(`#password-info-${index} .password-field`);
    const button = passwordField.parentElement.parentElement.querySelector('button');
    
    if (passwordField.style.display === 'none') {
        passwordField.style.display = 'block';
        button.textContent = 'Hide Password';
    } else {
        passwordField.style.display = 'none';
        button.textContent = 'Show Password';
    }
}

function toggleEdit(index, passwordObject) {
    const infoDiv = document.getElementById(`password-info-${index}`);
    const isEditing = infoDiv.querySelector('input');

    if (!isEditing) {
        // Switch to edit mode
        infoDiv.innerHTML = `
            <div>
                <strong>Label:</strong> 
                <input type="text" class="edit-input" value="${passwordObject.label}">
            </div>
            <div>
                <strong>Username:</strong> 
                <input type="text" class="edit-input" value="${passwordObject.username}">
            </div>
            <div>
                <strong>Password:</strong> 
                <input type="text" class="edit-input" value="${passwordObject.password}">
            </div>
            <div class="edit-buttons">
                <button class="action-button" onclick="saveChanges(${index})">Save</button>
                <button class="action-button" onclick="loadPasswords()">Cancel</button>
            </div>
        `;
    }
}

function checkPasswordStrength(password) {
    // Example criteria for a weak password
    return password.length < 8; // You can expand this logic as needed
}

function showWeakPasswordNotification() {
    alert('The password you entered is weak. It is recommended to use a stronger password.');
}

function saveChanges(index) {
    const infoDiv = document.getElementById(`password-info-${index}`);
    const inputs = infoDiv.querySelectorAll('input');
    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');

    const updatedPasswordObject = {
        label: inputs[0].value,
        username: inputs[1].value,
        password: inputs[2].value
    };

    if (checkPasswordStrength(updatedPasswordObject.password)) {
        showWeakPasswordNotification();
    }

    const encryptedData = btoa(JSON.stringify(updatedPasswordObject));
    savedPasswords[index] = encryptedData;
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
    loadPasswords();
}

function deletePassword(index) {
    if (confirm('Are you sure you want to delete this password?')) {
        const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
        savedPasswords.splice(index, 1);
        localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
        loadPasswords();
    }
}

loadPasswords();

function getSavedPasswords() {
    let savedPasswords;
    try {
        savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
    } catch (error) {
        console.error('Error parsing saved passwords:', error);
        savedPasswords = [];
    }
    return savedPasswords;
}