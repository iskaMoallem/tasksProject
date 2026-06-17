class Network {
    constructor() {
        this.userServer = new UserServer();
        this.fugitiveServer = new FugitiveServer();
    }

    _isNetworkDown() {
        return Math.random() < 0.1;
    }

    _simulateNetworkFailure(reject) {
        setTimeout(() => {
            reject({ status: 503, message: "Network error: No internet connection or server not responding" });
        }, 1000);
    }

    _routeRequest(requestObject, stringifiedRequest) {
        if (requestObject.endPoint && requestObject.endPoint.startsWith('/api/users')) {
            return this.userServer.handleRequest(stringifiedRequest);
        }
        if (requestObject.endPoint && requestObject.endPoint.startsWith('/api/fugitive')) {
            return this.fugitiveServer.handleRequest(stringifiedRequest);
        }
        return JSON.stringify({ status: 404, message: "Server not found" });
    }

    _processResponse(stringifiedResponse, resolve, reject) {
        const finalResponse = JSON.parse(stringifiedResponse);
        if (finalResponse.status >= 200 && finalResponse.status < 300) {
            resolve(finalResponse);
        }
        else {
            reject(finalResponse);
        }
    }

    sendRequest(requestObject) {
        return new Promise((resolve, reject) => {
            if (this._isNetworkDown()) {
                return this._simulateNetworkFailure(reject);
            }

            const stringifiedRequest = JSON.stringify(requestObject);
            setTimeout(() => {
                const stringifiedResponse = this._routeRequest(requestObject, stringifiedRequest);
                this._processResponse(stringifiedResponse, resolve, reject);
            }, 1000);
        });
    }

}