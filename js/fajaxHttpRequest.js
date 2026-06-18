class FXMLHttpRequest {
    constructor() {
        this.method = '';
        this.endPoint = '';
        this.body = null;

        this.status = null;
        this.responseText = null;

        this.onload = null;
        this.onerror = null;
    }

    open(method, endPoint) {
        this.method = method;
        this.endPoint = endPoint;
    }

    send(body = null) {
        this.body = body;
        network.sendRequest(this);
    }
}