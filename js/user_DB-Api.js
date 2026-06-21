class UserDbApi {
    constructor() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
    }

    _getData() {
        const data = localStorage.getItem('users');
        return data ? JSON.parse(data) : [];
    }

    _setData(data) {
        localStorage.setItem('users', JSON.stringify(data));
    }

    getUserById(id) {
        const users = this._getData();
        const foundUser = users.find(user => user.id === id);
        return foundUser || null;
    }

    insertUser(userObject) {
        const users = this._getData();
        users.push(userObject);
        this._setData(users);
        return userObject;
    }
}