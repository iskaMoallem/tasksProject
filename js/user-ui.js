class UserUI {
    constructor() {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('currentUser');
                if (typeof fugitiveUI !== 'undefined') {
                    fugitiveUI.fugitivesList = [];
                    fugitiveUI._renderTable([]);
                    fugitiveUI._clearAddForm();
                }
                router.navigateTo('#login');
            });
        }
        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.handleRegister());
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('currentUser');
                router.navigateTo('#login');
            });
        }
    }

    _isValid(...fields) {
        const hasEmptyFields = fields.some(field => field === '');
        if (hasEmptyFields) {
            alert("Error: All fields are required.");
            return false;
        }
        return true;
    }

    _clearInputs(elementIdsArray) {
        elementIdsArray.forEach(id => {
            document.getElementById(id).value = '';
        });
    }

    _onNetworkError() {
        alert("Network Error: Could not reach the server. Please check your connection.");
    }

    _getLoginInputs() {
        return {
            id: document.getElementById('login-id').value.trim(),
            password: document.getElementById('login-pass').value.trim()
        };
    }

    _processSuccessfulLogin(userData) {
        this._clearInputs(['login-id', 'login-pass']);
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        router.navigateTo('#dashboard');
        setTimeout(() => alert("Welcome back, " + userData.userName + "!"), 50);
    }

    _onLoginResponse(xhr) {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            this._processSuccessfulLogin(response.data);
        } else {
            alert("Login Failed: " + response.message);
        }
    }

    _sendLoginRequest(credentials) {
        const xhr = new FXMLHttpRequest();
        xhr.open('POST', '/api/users/login');
        xhr.onload = () => this._onLoginResponse(xhr);
        xhr.onerror = () => this._onNetworkError();
        xhr.send(credentials);
    }

    handleLogin() {
        const credentials = this._getLoginInputs();
        if (!this._isValid(credentials.id, credentials.password)) {
            return;
        }
        this._sendLoginRequest(credentials);
    }

    _getRegisterInputs() {
        return {
            id: document.getElementById('reg-id').value.trim(),
            userName: document.getElementById('reg-name').value.trim(),
            password: document.getElementById('reg-pass').value.trim()
        };
    }

    _sendRegisterRequest(data) {
        const xhr = new FXMLHttpRequest();
        xhr.open('POST', '/api/users/register');

        xhr.onload = () => this._onRegisterResponse(xhr);
        xhr.onerror = () => this._onNetworkError();

        xhr.send(data);
    }

    _processSuccessfulRegistration(userData) {
        this._clearInputs(['reg-id', 'reg-name', 'reg-pass']);
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        router.navigateTo('#dashboard');
        setTimeout(() => alert("Registration successful!"), 50);
    }

    _onRegisterResponse(xhr) {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 201) {
            this._processSuccessfulRegistration(response.data);
        } else {
            alert("Registration Failed: " + response.message);
        }
    }

    handleRegister() {
        const data = this._getRegisterInputs();
        if (!this._isValid(data.id, data.password, data.userName)) {
            return;
        }
        this._sendRegisterRequest(data);
    }

}
const userUI = new UserUI();
