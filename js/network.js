class Network {
    constructor() {
        this.userServer = new UserServer();
        this.fugitiveServer = new FugitiveServer();
    }

    _getRandomDelay() {
        return Math.floor(Math.random() * 501) + 500;
    }

    _isNetworkDown() {
        return Math.random() < 0.1;
    }

    _handleNetworkDrop(xhrObject, delay) {
        setTimeout(() => {
            xhrObject.status = 503;
            xhrObject.responseText = JSON.stringify({ message: "Network error: Request dropped" });
            xhrObject.onerror();
        }, delay);
    }

    _processValidRequest(xhrObject, delay) {
        setTimeout(() => {
            const stringifiedResponse = this._routeRequest(xhrObject);
            const finalResponse = JSON.parse(stringifiedResponse);
            xhrObject.status = finalResponse.status;
            xhrObject.responseText = stringifiedResponse;
            xhrObject.onload();
        }, delay);
    }

    _routeRequest(xhrObject) {
        const requestString = JSON.stringify({
            method: xhrObject.method,
            endPoint: xhrObject.endPoint,
            body: xhrObject.body
        });
        if (xhrObject.endPoint.startsWith('/api/users')) {
            return this.userServer.handleRequest(requestString);
        }
        if (xhrObject.endPoint.startsWith('/api/fugitives')) {
            return this.fugitiveServer.handleRequest(requestString);
        }
        return JSON.stringify({ status: 404, message: "Server not found" });
    }

    sendRequest(xhrObject) {
        const delay = this._getRandomDelay();
        if (this._isNetworkDown()) {
            this._handleNetworkDrop(xhrObject, delay);
        } else {
            this._processValidRequest(xhrObject, delay);
        }
    }
}

const network = new Network();