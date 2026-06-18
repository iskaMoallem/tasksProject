class FugitiveServer {
    constructor() {
        this.dbApi = new FugitiveDbApi();
    }

    _checkIfExists(id) {
        return this.dbApi.getFugitiveById(id) !== null;
    }

    _getAllFugitives() {
        const fugitives = this.dbApi.getAllFugitives();
        return JSON.stringify({
            status: 200,
            message: "Success",
            data: fugitives
        });
    }

    _addFugitive(body) {
        const { id, name, description, riskLevel, status, creatorOfficerId } = body;
        if (!id || !name || !creatorOfficerId) {
            return JSON.stringify({ status: 400, message: "ID, Name, and Creator Officer ID are required" });
        }
        if (this._checkIfExists(id)) {
            return JSON.stringify({ status: 409, message: "Fugitive ID already exists" });
        }
        const newFugitive = new Fugitive(id, name, description, riskLevel, status, creatorOfficerId);
        this.dbApi.insertFugitive(newFugitive);
        return JSON.stringify({
            status: 201,
            message: "Fugitive added successfully",
            data: newFugitive
        });
    }

    _updateFugitive(body) {
        const { id, name, description, riskLevel, status, relatedOfficerIds } = body;
        if (!id) {
            return JSON.stringify({ status: 400, message: "ID is required for update" });
        }
        if (!this._checkIfExists(id)) {
            return JSON.stringify({ status: 404, message: "Fugitive not found" });
        }
        const updatedFugitive = { id, name, description, riskLevel, status, relatedOfficerIds };
        this.dbApi.updateFugitive(updatedFugitive);
        return JSON.stringify({
            status: 200,
            message: "Fugitive updated successfully",
            data: updatedFugitive
        });
    }

    _deleteFugitive(body) {
        const { id } = body;
        if (!id) {
            return JSON.stringify({ status: 400, message: "ID is required for deletion" });
        }
        if (!this._checkIfExists(id)) {
            return JSON.stringify({ status: 404, message: "Fugitive not found" });
        }
        this.dbApi.deleteFugitive(id);
        return JSON.stringify({
            status: 200,
            message: "Fugitive deleted successfully"
        });
    }

    handleRequest(fajaxRequestString) {
        const request = JSON.parse(fajaxRequestString);
        if (request.method === 'GET' && request.endPoint === '/api/fugitives/all') {
            return this._getAllFugitives();
        }
        if (request.method === 'POST' && request.endPoint === '/api/fugitives/add') {
            return this._addFugitive(request.body);
        }
        if (request.method === 'PUT' && request.endPoint === '/api/fugitives/update') {
            return this._updateFugitive(request.body);
        }
        if (request.method === 'DELETE' && request.endPoint === '/api/fugitives/delete') {
            return this._deleteFugitive(request.body);
        }
        return JSON.stringify({ status: 404, message: "EndPoint not found" });
    }
}