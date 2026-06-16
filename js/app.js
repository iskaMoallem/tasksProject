window.addEventListener('popstate', (event) => {
    const page = event.state ? event.state.page : 'login';
    navigateTo(page, false);
});

document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '') || 'login';
    navigateTo(hash);
});

function navigateTo(pageId, addToHistory = true) {
    console.log("Loading page:", pageId);
    const appContainer = document.getElementById('app');

    const targetId = (pageId === 'dashboard') ? 'dashboard-template' : pageId;
    const template = document.getElementById(targetId);

    if (!template) {
        console.error(`Page ${pageId} not found`);
        return;
    }

    appContainer.innerHTML = '';
    const clone = document.importNode(template.content, true);
    appContainer.appendChild(clone);

    if (addToHistory) {
        window.history.pushState({ page: pageId }, '', `#${pageId}`);
    }

    initPageLogic(pageId);
}

function initPageLogic(pageId) {
    switch (pageId) {
        case 'registration':
            if (typeof handleRegistration === 'function') handleRegistration();
            break;
        case 'login':
            if (typeof handleLogin === 'function') handleLogin();
            break;
        case 'dashboard':
            if (typeof initDashboardLogic === 'function') initDashboardLogic();
            break;
    }
}

function showMessage(text) {
    const alertBox = document.getElementById('custom-alert');
    const alertText = document.getElementById('custom-alert-text');
    alertText.innerText = text;
    alertBox.classList.remove('hidden');
    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 3000);
}