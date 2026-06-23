class AppRouter {
    constructor() {
        this.screens = ['login-screen', 'register-screen', 'dashboard-screen'];
        window.addEventListener('load', () => this.handleRoute());
        window.addEventListener('popstate', () => this.handleRoute());
    }
 
    _showScreen(screenIdToShow) {
        this.screens.forEach(screenId => {
            const screenElement = document.getElementById(screenId);
            if (screenElement) {
                screenElement.style.display = (screenId === screenIdToShow) ? 'block' : 'none';
            }
        });
    }

    handleRoute() {
        const currentHash = window.location.hash;
        switch (currentHash) {
            case '':
            case '#login':
                this._handleLogin();
                break;
            case '#register':
                this._handleRegister();
                break;
            case '#dashboard':
                this._handleDashboard();
                break;
            default:
                this.navigateTo('#login');
                break;
        }
    }

    _handleLogin() {
        const loggedInUser = sessionStorage.getItem('currentUser');
        if (loggedInUser) {
            this.navigateTo('#dashboard');
        }
        else {
            this._showScreen('login-screen');
        }
    }

    _handleRegister() {
        const loggedInUser = sessionStorage.getItem('currentUser');
        if (loggedInUser) {
            this.navigateTo('#dashboard');
        }
        else {
            this._showScreen('register-screen');
        }
    }

    _handleDashboard() {
        const loggedInUser = sessionStorage.getItem('currentUser');
        if (loggedInUser) {
            const parsedUser = JSON.parse(loggedInUser);
            document.getElementById('welcome-msg').innerText = "Welcome, Officer " + parsedUser.userName;
            this._showScreen('dashboard-screen');
            fugitiveUI.loadAllFugitives();
        } else {
            alert("Unauthorized access. Please login first.");
            this.navigateTo('#login');
        }
    }

    navigateTo(hashUrl) {
        window.history.pushState({}, '', hashUrl);
        this.handleRoute();
    }
}

const router = new AppRouter();