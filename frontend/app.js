class TodoApp {
    constructor() {
        this.apiUrl = 'http://localhost:8000';
        this.token = localStorage.getItem('token');
        this.user = null;
        
        this.initializeApp();
        this.bindEvents();
    }

    async initializeApp() {
        if (this.token) {
            try {
                await this.getCurrentUser();
                this.showTodoSection();
                await this.loadTodos();
            } catch (error) {
                this.logout();
            }
        }
    }

    bindEvents() {
        // Auth forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        
        // Todo form
        document.getElementById('todoForm').addEventListener('submit', (e) => this.handleAddTodo(e));
        
        // Password form
        document.getElementById('passwordForm').addEventListener('submit', (e) => this.handleChangePassword(e));
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
    }

    async makeRequest(url, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${this.apiUrl}${url}`, config);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'An error occurred');
        }

        // Handle empty responses (like 204 No Content)
        if (response.status === 204 || !response.headers.get('content-length') || response.headers.get('content-length') === '0') {
            return null;
        }

        return response.json();
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);
            formData.append('grant_type', 'password');

            const response = await fetch(`${this.apiUrl}/auth/token`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            const data = await response.json();
            this.token = data.access_token;
            localStorage.setItem('token', this.token);

            await this.getCurrentUser();
            this.showTodoSection();
            await this.loadTodos();
            this.showAlert('Login successful!', 'success');
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const userData = {
            email: document.getElementById('registerEmail').value,
            first_name: document.getElementById('registerFirstName').value,
            last_name: document.getElementById('registerLastName').value,
            password: document.getElementById('registerPassword').value
        };

        if (!this.isPasswordStrong(userData.password)) {
            this.showAlert('Password must be at least 8 characters, include uppercase, lowercase, digit, and special character.', 'danger');
            return;
        }

        try {
            await this.makeRequest('/auth/', {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            this.showAlert('Registration successful! Please login.', 'success');
            document.getElementById('login-tab').click();
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    isPasswordStrong(password) {
        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
        );
    }

    async getCurrentUser() {
        try {
            this.user = await this.makeRequest('/users/me');
            document.getElementById('userInfo').textContent = `Welcome, ${this.user.first_name}!`;
        } catch (error) {
            throw error;
        }
    }

    async handleAddTodo(e) {
        e.preventDefault();
        
        const todoData = {
            description: document.getElementById('todoDescription').value,
            priority: parseInt(document.getElementById('todoPriority').value)
        };

        const dueDate = document.getElementById('todoDueDate').value;
        if (dueDate) {
            todoData.due_date = new Date(dueDate).toISOString();
        }

        try {
            await this.makeRequest('/todos/', {
                method: 'POST',
                body: JSON.stringify(todoData)
            });

            document.getElementById('todoForm').reset();
            await this.loadTodos();
            this.showAlert('Todo added successfully!', 'success');
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    async loadTodos() {
        try {
            const todos = await this.makeRequest('/todos/');
            this.renderTodos(todos);
        } catch (error) {
            this.showAlert('Failed to load todos', 'danger');
        }
    }

    renderTodos(todos) {
        const container = document.getElementById('todoList');
        
        if (todos.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No todos yet. Add one above!</p>';
            return;
        }

        container.innerHTML = todos.map(todo => `
            <div class="todo-item ${todo.is_completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="todo-description">${todo.description}</span>
                            <span class="badge priority-${todo.priority} priority-badge">
                                ${this.getPriorityText(todo.priority)}
                            </span>
                        </div>
                        <div class="todo-meta">
                            ${todo.due_date ? `<span class="due-date ${this.isOverdue(todo.due_date) ? 'overdue' : ''}">
                                Due: ${new Date(todo.due_date).toLocaleString()}
                            </span>` : ''}
                            ${todo.completed_at ? `<span class="completed-at">
                                Completed: ${new Date(todo.completed_at).toLocaleString()}
                            </span>` : ''}
                        </div>
                    </div>
                    <div class="todo-actions">
                        ${!todo.is_completed ? `
                            <button class="btn btn-success btn-sm complete-btn" data-todo-id="${todo.id}">
                                <i class="fas fa-check"></i> Complete
                            </button>
                        ` : ''}
                        <button class="btn btn-danger btn-sm delete-btn" data-todo-id="${todo.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to buttons
        container.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', () => this.completeTodo(btn.dataset.todoId));
        });

        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => this.deleteTodo(btn.dataset.todoId));
        });
    }

    getPriorityText(priority) {
        const priorities = ['Normal', 'Low', 'Medium', 'High', 'Top'];
        return priorities[priority] || 'Normal';
    }

    isOverdue(dueDate) {
        return new Date(dueDate) < new Date();
    }

    async completeTodo(todoId) {
        try {
            await this.makeRequest(`/todos/${todoId}/complete`, {
                method: 'PUT'
            });

            await this.loadTodos();
            this.showAlert('Todo completed!', 'success');
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    async deleteTodo(todoId) {
        if (!confirm('Are you sure you want to delete this todo?')) {
            return;
        }

        try {
            // Remove from UI immediately for better UX
            const todoElement = document.querySelector(`.todo-item[data-id="${todoId}"]`);
            if (todoElement) {
                todoElement.style.opacity = '0.5';
                todoElement.style.pointerEvents = 'none';
            }

            await this.makeRequest(`/todos/${todoId}`, {
                method: 'DELETE'
            });

            await this.loadTodos();
            this.showAlert('Todo deleted!', 'success');
        } catch (error) {
            // Restore the todo element if deletion failed
            const todoElement = document.querySelector(`.todo-item[data-id="${todoId}"]`);
            if (todoElement) {
                todoElement.style.opacity = '1';
                todoElement.style.pointerEvents = 'auto';
            }
            this.showAlert(error.message, 'danger');
        }
    }

    async handleChangePassword(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            this.showAlert('New passwords do not match!', 'danger');
            return;
        }
        if (!this.isPasswordStrong(newPassword)) {
            this.showAlert('Password must be at least 8 characters, include uppercase, lowercase, digit, and special character.', 'danger');
            return;
        }

        const passwordData = {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirm: confirmPassword
        };

        try {
            await this.makeRequest('/users/change-password', {
                method: 'PUT',
                body: JSON.stringify(passwordData)
            });

            document.getElementById('passwordForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('passwordModal')).hide();
            this.showAlert('Password changed successfully!', 'success');
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    showTodoSection() {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('todoSection').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'block';
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('todoSection').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('userInfo').textContent = '';
        
        // Clear forms
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        
        this.showAlert('Logged out successfully!', 'info');
    }

    showAlert(message, type) {
        const alertContainer = document.getElementById('alertContainer');
        const alertId = 'alert-' + Date.now();
        
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" id="${alertId}">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        alertContainer.insertAdjacentHTML('beforeend', alertHtml);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                bootstrap.Alert.getOrCreateInstance(alert).close();
            }
        }, 5000);
    }
}

// Initialize the app
const app = new TodoApp();

document.addEventListener('DOMContentLoaded', function() {
    // Registration password strength
    const regPwd = document.getElementById('registerPassword');
    if (regPwd) {
        regPwd.addEventListener('input', function() {
            updatePasswordStrengthBar(regPwd.value, 'registerPasswordStrength', 'registerPasswordStrengthText');
        });
    }
    // Change password strength
    const newPwd = document.getElementById('newPassword');
    if (newPwd) {
        newPwd.addEventListener('input', function() {
            updatePasswordStrengthBar(newPwd.value, 'changePasswordStrength', 'changePasswordStrengthText');
        });
    }
});

function updatePasswordStrengthBar(password, barId, textId) {
    const bar = document.getElementById(barId);
    const text = document.getElementById(textId);
    const score = getPasswordStrengthScore(password);
    let percent = score * 25;
    let color = 'bg-danger';
    let label = 'Very Weak';
    if (score === 1) { color = 'bg-danger'; label = 'Weak'; }
    if (score === 2) { color = 'bg-warning'; label = 'Fair'; }
    if (score === 3) { color = 'bg-info'; label = 'Good'; }
    if (score === 4) { color = 'bg-success'; label = 'Strong'; }
    bar.style.width = percent + '%';
    bar.className = 'progress-bar ' + color;
    text.textContent = password ? `Strength: ${label} (${percent}%)` : '';
}

function getPasswordStrengthScore(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
}
