class AppRouter {
    constructor() {
        this.screens = ['login-screen', 'register-screen', 'dashboard-screen'];
        window.addEventListener('load', () => this.handleRoute());
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    _showScreen(screenIdToShow) {
        this.screens.forEach(screenId => {
            const screenElement = document.getElementById(screenId);
            if (screenElement) {
                if (screenId === screenIdToShow) {
                    screenElement.style.display = 'block';
                } else {
                    screenElement.style.display = 'none';
                }
            }
        });
    }

    handleRoute() {
        const currentHash = window.location.hash;
        if (currentHash === '' || currentHash === '#login') {
            this._showScreen('login-screen');
        }
        else if (currentHash === '#register') {
            this._showScreen('register-screen');
        }
        else if (currentHash === '#dashboard') {
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
        else {
            this.navigateTo('#login');
        }
    }

    navigateTo(hashUrl) {
        window.location.hash = hashUrl;
    }

}

const router = new AppRouter();