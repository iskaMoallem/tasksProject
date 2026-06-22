class FugitiveDbApi {
    constructor() {
        if (!localStorage.getItem('fugitives')) {
            localStorage.setItem('fugitives', JSON.stringify([]));
        }
    }

    _getData() {
        const data = localStorage.getItem('fugitives');
        return data ? JSON.parse(data) : [];
    }

    _setData(data) {
        localStorage.setItem('fugitives', JSON.stringify(data));
    }

    getAllFugitives() {
        return this._getData();
    }

    getFugitiveById(id) {
        const fugitives = this._getData();
        return fugitives.find(f => f.id === id) || null;
    }

    insertFugitive(fugitiveObject) {
        const fugitives = this._getData();
        const existingFugitive = fugitives.find(f => f.id === fugitiveObject.id);
        if (existingFugitive) {
            return { success: false, error: "Fugitive ID already exists" };
        }
        fugitives.push(fugitiveObject);
        this._setData(fugitives);
        return { success: true, data: fugitiveObject };
    }

    updateFugitive(updatedFugitive) {
        const fugitives = this._getData();
        const index = fugitives.findIndex(f => f.id === updatedFugitive.id);
        fugitives[index] = updatedFugitive;
        this._setData(fugitives);
    }

    deleteFugitive(id) {
        const fugitives = this._getData();
        const filteredFugitives = fugitives.filter(f => f.id !== id);
        this._setData(filteredFugitives);
    }
}