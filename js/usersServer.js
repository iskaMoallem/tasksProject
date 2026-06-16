class UserServer {
    constructor() {
        this.dbApi = new UserDbApi();
    }

    handleRequest(fajaxRequestString) {
        const request = JSON.parse(fajaxRequestString);
        if (request.method === 'POST' && request.endPoint === '/api/users/login') {
            return this._login(request.body);
        }
        if (request.method === 'POST' && request.endPoint === '/api/users/register') {
            return this._register(request.body);
        }
        return JSON.stringify({ status: 404, message: "EndPoint not found" });
    }

    _login(body) {
        const { id, password } = body;
        const user = this.dbApi.getUserById(id);
        if (!user || user.password !== password) {
            return JSON.stringify({ status: 401, message: "Incorrect username or password" });
        }
        return JSON.stringify({
            status: 200,
            message: "Connection successful",
            data: { id: user.id, userName: user.userName }
        });
    }

    _register(body) {
        const { id, userName, password } = body;
        if (!id || !userName || !password) {
            return JSON.stringify({ status: 400, message: "ID, Username and password are required" });
        }
        const existingUser = this.dbApi.getUserById(id);
        if (existingUser) {
            return JSON.stringify({ status: 409, message: "ID is already taken" });
        }
        const newUser = new User(id, userName, password);
        this.dbApi.insertUser(newUser);
        return JSON.stringify({
            status: 201,
            message: "Registration was successful.",
            data: { id: newUser.id, userName: newUser.userName }
        });
    }
}