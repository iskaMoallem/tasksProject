class UserDbApi {
    constructor() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
        if (!localStorage.getItem('tasks')) {
            localStorage.setItem('tasks', JSON.stringify([]));
        }
    }

    _getData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    _setData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    getAllUsers() {
        return this._getData('users');
    }

    insertUser(userObject) {
        const users = this.getAllUsers();
        users.push(userObject);
        this._setData('users', users);
        return userObject;
    }

    getAllTasks() {
        return this._getData('tasks');
    }

    insertTask(taskObject) {
        const tasks = this.getAllTasks();
        tasks.push(taskObject);
        this._setData('tasks', tasks)
        return taskObject;
    }

    updateTask(updatedTaskObject) {
        const tasks = this.getAllTasks();
        const index = tasks.findIndex(task => task.id === updatedTaskObject.id);
        if (index !== -1) {
            tasks[index] = updatedTaskObject;
            this._setData('tasks', tasks);
            return true;
        }
        return false
    }

    deleteTask(taskId) {
        const task = this.getAllTasks();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        if (tasks.length !== filteredTasks.length) {
            this._setData('task', filteredTasks);
            return true
        }
        return false
    }




}