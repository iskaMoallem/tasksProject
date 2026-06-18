class FugitiveUI {
    constructor() {
        this.fugitivesList = [];
        this._bindEvents();
    }

    _applyFilters() {
        const searchText = document.getElementById('search-input').value.toLowerCase();
        const statusValue = document.getElementById('filter-status-select').value;
        const filteredList = this.fugitivesList.filter(fugitive => {
            const matchesName = fugitive.name.toLowerCase().includes(searchText);
            const matchesStatus = (statusValue === 'All') || (fugitive.status === statusValue);
            return matchesName && matchesStatus;
        });
        this._renderTable(filteredList);
    }

    _getNewFugitiveInputs() {
        return {
            id: document.getElementById('fugitive-id').value.trim(),
            name: document.getElementById('fugitive-name').value.trim(),
            riskLevel: document.getElementById('fugitive-risk').value,
            status: document.getElementById('fugitive-status').value,
            description: document.getElementById('fugitive-desc').value.trim()
        };
    }

    _clearAddForm() {
        document.getElementById('fugitive-id').value = '';
        document.getElementById('fugitive-name').value = '';
        document.getElementById('fugitive-desc').value = '';
    }

    _sendAddRequest(newData) {
        const xhr = new FXMLHttpRequest();
        xhr.open('POST', '/api/fugitives/add');
        xhr.onload = () => {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status === 201) {
                this.fugitivesList.push(response.data);
                this._clearAddForm();
                this._applyFilters();
                alert("Fugitive added successfully.");
            } else {
                alert("Failed to add fugitive: " + response.message);
            }
        };
        xhr.onerror = () => alert("Network Error while adding fugitive.");
        xhr.send(newData);
    }

    handleAddFugitive() {
        const newData = this._getNewFugitiveInputs();
        if (!newData.id || !newData.name) {
            alert("Error: Fugitive ID and Name are required.");
            return;
        }
        const loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (loggedInUser) {
            newData.creatorOfficerId = loggedInUser.id;
        }
        this._sendAddRequest(newData);
    }

    _bindEvents() {
        const searchInput = document.getElementById('search-input');
        const filterStatus = document.getElementById('filter-status-select');
        const addFugitiveBtn = document.getElementById('add-fugitive-btn');

        if (searchInput) {
            searchInput.addEventListener('input', () => this._applyFilters());
        }
        if (filterStatus) {
            filterStatus.addEventListener('change', () => this._applyFilters());
        }
        if (addFugitiveBtn) {
            addFugitiveBtn.addEventListener('click', () => this.handleAddFugitive());
        }
    }

    loadAllFugitives() {
        const xhr = new FXMLHttpRequest();
        xhr.open('GET', '/api/fugitives/all');
        xhr.onload = () => this._onLoadFugitivesResponse(xhr);
        xhr.onerror = () => alert("Network Error: Cannot load fugitives.");
        xhr.send();
    }

    _onLoadFugitivesResponse(xhr) {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            this.fugitivesList = response.data;
            this._renderTable(this.fugitivesList);
        } else {
            alert("Error loading data: " + response.message);
        }
    }

    _renderTable(dataArray) {
        const tbody = document.getElementById('fugitives-table-body');
        tbody.innerHTML = '';

        if (dataArray.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No fugitives found.</td></tr>';
            return;
        }

        dataArray.forEach(fugitive => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${fugitive.id}</td>
                <td><strong>${fugitive.name}</strong></td>
                <td>${fugitive.description}</td>
                <td><span class="risk-${fugitive.riskLevel.toLowerCase()}">${fugitive.riskLevel}</span></td>
                <td>${fugitive.status}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="fugitiveUI.handleUpdate('${fugitive.id}')">Update</button>
                    <button class="action-btn delete-btn" onclick="fugitiveUI.handleDelete('${fugitive.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    handleDelete(fugitiveId) {
        const isConfirmed = confirm("Are you sure you want to delete fugitive ID: " + fugitiveId + "?");
        if (!isConfirmed) return;
        const xhr = new FXMLHttpRequest();
        xhr.open('DELETE', '/api/fugitives/delete');
        xhr.onload = () => {
            if (xhr.status === 200) {
                this.fugitivesList = this.fugitivesList.filter(f => f.id !== fugitiveId);
                this._applyFilters();
            } else {
                const response = JSON.parse(xhr.responseText);
                alert("Failed to delete: " + response.message);
            }
        };
        xhr.onerror = () => alert("Network Error while deleting.");
        xhr.send({ id: fugitiveId });
    }

    handleUpdate(fugitiveId) {
        const fugitiveToUpdate = this.fugitivesList.find(f => f.id === fugitiveId);
        if (!fugitiveToUpdate) return;
        const newStatus = prompt("Update status for " + fugitiveToUpdate.name + ":\n(Type: At Large / In Custody / Deceased)", fugitiveToUpdate.status);
        if (!newStatus || newStatus === fugitiveToUpdate.status) return;

        const updatedFugitive = { ...fugitiveToUpdate, status: newStatus };
        const xhr = new FXMLHttpRequest();
        xhr.open('PUT', '/api/fugitives/update');
        xhr.onload = () => {
            if (xhr.status === 200) {
                const index = this.fugitivesList.findIndex(f => f.id === fugitiveId);
                if (index !== -1) {
                    this.fugitivesList[index] = updatedFugitive;
                }
                this._applyFilters();
            } else {
                const response = JSON.parse(xhr.responseText);
                alert("Failed to update: " + response.message);
            }
        };
        xhr.onerror = () => alert("Network Error while updating.");
        xhr.send(updatedFugitive);
    }
}

const fugitiveUI = new FugitiveUI();