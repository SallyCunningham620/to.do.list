//task.js

export default class Task {
    constructor(title, description = '', dueDate = 'No Date', priority = 'low') {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isComplete = false;
    }
}