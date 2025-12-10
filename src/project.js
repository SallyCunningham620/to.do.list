//project.js

export default class Project {
    constructor(title) {
        this.title = title;
        this.id = title.trim().toLowerCase();
        this.tasks = [];
    }

    addTask(task) {
        console.log(task);
        this.tasks.push(task);
    }

    removeTask(taskTitle) {
        console.log(taskTitle);
        this.tasks = this.tasks.filter(task => task.title !== taskTitle);
    }

    editProjectTitle(newTitle) {
        this.title = newTitle;
    }
}