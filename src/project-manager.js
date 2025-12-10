//project-manager.js

export { projectManager };

import Project from "./project.js";
import Task from "./task.js";

class ProjectManager {
    #allProjects = [];
    #currentProject = null;
    #storageKey = 'YourSavedProjects'
    #currentProjectKey = 'YourCurrentProject'
    
    constructor() {
        this.loadProjects();
    }

    //load project from local storage
    loadProjects() {
        //get stored item
        const storedProjects = localStorage.getItem(this.#storageKey);
        if (storedProjects) {
            //create each individual project for all projects
            this.#allProjects = JSON.parse(storedProjects).map(projectData => {
                const project = new Project(projectData.title);
                project.tasks = projectData.tasks;
                return project;
            });

            //get current project to create project-task container
            const storedCurrentProjectTitle = localStorage.getItem(this.#currentProjectKey);
            if (storedCurrentProjectTitle) {
                //find the current project in allProjects array
                const storedCurrentProjectObject = this.#allProjects.find(project => project.title === storedCurrentProjectTitle) || this.#allProjects[0] || null;
                if (storedCurrentProjectObject) {
                    this.#currentProject = storedCurrentProjectObject;
                    return storedCurrentProjectObject;
                } else {
                    console.warn('Current project stored title was not found in #allProjects.');
                }
            } else {
                console.log('No stored current projects found.')
            }
        } else {
            //fill projects container with no projects statement
            const projectsContainer = document.getElementById('projects-container');
            if(projectsContainer){
                projectsContainer.textContent = 'No projects available. Create a new project to get started!';
            }
        }
    }

    //adding a new project
    addProject(projectTitle) {
        //format title to no spaces and lower case to create ID
        const projectIdTitle = projectTitle.trim().toLowerCase();
        //see if project already exists based on ID
        const projectExists = this.#allProjects.find(project => project.title === projectIdTitle);
        if (!projectExists) {
            //create a normal new project
            const newProject = new Project(projectTitle);
            //add to allProjects array
            this.#allProjects.push(newProject);
            this.saveProjects();
            this.saveCurrentProject(newProject.title)
            this.setCurrentProject(newProject);
            return newProject;
        } else {
            //project exists already alert
            alert("A project with that title already exists");
            return null;
        }
    }
    
    //save projects to local storage in allProjects array
    saveProjects() {
        localStorage.setItem(this.#storageKey, JSON.stringify(this.#allProjects));
    }

    //set project to currentProject
    setCurrentProject(projectObject) {
            this.#currentProject = projectObject;
            //save the title of currentProject
            this.saveCurrentProject(projectObject.title);
    }

    //save project in local storage as currentProject
    saveCurrentProject(title) {
        //use in addProject of projectManager
        localStorage.setItem(this.#currentProjectKey, title);
    }

    //get project with ID from allProjects
    getProject(projectId) {
        return this.#allProjects.find(project => project.id === projectId);
    }

    getCurrentProject() {
        // Returns the actual Project object instance stored
        return this.#currentProject;
    }

    //gets allProjects array
    getAllProjects () {
        return this.#allProjects;
    }

    updateProjectTitle(projectId, newTitle) {
        //find project in allProjects
        const projectToUpdate = this.#allProjects.find(project => project.id === projectId); 
        if (projectToUpdate) {
            projectToUpdate.title = newTitle;
            projectToUpdate.id = newTitle.toLowerCase();
            this.saveProjects(); 

            if (this.#currentProject === projectToUpdate) {
                this.setCurrentProject(projectToUpdate);
            }
        } else {
            alert('No project found.');
        }
    }

    //remove project from allProjects array
    removeProject(projectTitle) {
        const projectIndex = this.#allProjects.findIndex(project => project.title === projectTitle);
        if (projectIndex !== -1) {
            this.#allProjects.splice(projectIndex, 1);
            if (this.#allProjects.length === 0) {
                this.#currentProject = null;
                localStorage.removeItem(this.#currentProjectKey);
            } else if (this.#currentProject && this.#currentProject.title === projectTitle) {
                this.#currentProject = this.#allProjects[0]
                this.saveCurrentProject(this.#currentProject.title);
            }
            this.saveProjects();
        }
    
    }

    addTaskToCurrentProject(title, description, dueDate, priority) {
        const currentProject = this.#currentProject; 
        if (!currentProject) {
            alert("Please select or create a project first.");
            return null;
        }
        const newTask = new Task(title, description, dueDate, priority);
        const taskExists = this.#currentProject.tasks.find(task => task.title === newTask.title);
        if (!taskExists) {
            //add task to project
            currentProject.addTask(newTask);
            this.saveProjects();
            return newTask;
        } else {
            //task already exists in project
            alert("A task with that title already exists");
            return null;
        }}

    removeTaskFromCurrentProject(taskTitle) {
        this.#currentProject.removeTask(taskTitle);
        this.saveCurrentProject();
        this.saveProjects();
    }
}
const projectManager = new ProjectManager();
Object.freeze(projectManager);