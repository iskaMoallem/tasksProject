class Network {
    constructor() {
        this.userServer = new userServer();
        this.taskServer = new this.taskServer();
    }
    sendRequest(requestObject) {
        return new Promise((resolve, reject) => {
            const stringiedRequest = JSON.stringify(requestObject);
            const isNetworkDown = Math.random() < 0.1;
            if (isNetworkDown) {
                setTimeout(() => {
                    reject({ status: 503, message: "Network error: No internet connection or server not responding" });

                }, 1000);
                return;
            }
            setTimeout(() => {
                let stringifiedResponse;
                if (requestObject.endPoint && requestObject.endPoint.startsWith('/api/users')) {
                    stringifiedResponse = this.userServer.handleRequest(stringiedRequest);
                }
                else if (requestObject.endPoint && requestObject.endPoint.startsWith('/api/tasks')) {
                    stringifiedResponse = this.taskServer.handleRequest(stringiedRequest);
                }
                else {
                    stringifiedResponse = JSON.stringify({ status: 404, message: "Server not found" });
                }
                const finleResponse = JSON.parse(stringifiedResponse);
                if (finleResponse.status >= 200 && finleResponse.status < 300) {
                    resolve(finleResponse);
                }
                else {
                    reject(finleResponse);
                }
            }, 1000);
        });
    }
}