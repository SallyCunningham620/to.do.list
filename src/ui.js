//ui.js

import { projectManager } from "./project-manager.js";
import { format, parseISO } from "date-fns";
import { openForm, closeForm, closeFormButtons} from "./button-manager.js";

const ui = (() => {
    //UI calls from template.html
    const projectsContainer = document.getElementById('projects-container');
    const projectTaskItems = document.getElementById('project-task-items');
    
    const newProjectBtn = document.getElementById('new-project-btn');
    const closeProjectFormBtn = document.getElementById('close-project-form-btn');
    const newTaskBtn = document.getElementById('new-task-btn');
    const closeTaskFormBtn = document.getElementById('close-task-form-btn');
    
    const newProjectForm = document.getElementById('new-project-form');
    const newProjectFormTitle = document.getElementById('new-project-form-title');
    const addProjectBtn = document.getElementById('add-project-btn');
    const newTaskForm = document.getElementById('new-task-form');
    const newTaskFormTitle = document.getElementById('new-task-form-title');
    const addTaskBtn = document.getElementById('add-task-btn');

    //set null values
    let editTask = null;
    let editProject = null;
    
    const createTaskElement = (task, project) => {
        //create container for individual tasks
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-container')

        //top task container items
        const topTaskElement =document.createElement('div');
        topTaskElement.classList.add('top-task-container');
        taskItem.appendChild(topTaskElement);

        //add items to task container
        const taskTitle = document.createElement('h3');
        taskTitle.classList.add('task-title');
        taskTitle.textContent = 'Title: ' + task.title;
        topTaskElement.appendChild(taskTitle);

        const dueDate = document.createElement('span');
        dueDate.classList.add('due-date');
        
        if (task.dueDate && task.dueDate !== 'No Date') {
            try {
                //format due date for date-fns
                dueDate.textContent = 'Due: ' + format(parseISO(task.dueDate), 'MM/dd/yyyy');
            } catch (e) {
                dueDate.textContent = 'Due: Invalid Date';
            }
        } else {
            dueDate.textContent = 'Due: No Date Set';
        }
        topTaskElement.appendChild(dueDate);

        const taskDescription = document.createElement('div');
        taskDescription.classList.add('task-description');
        taskItem.appendChild(taskDescription);

        const descriptionPara = document.createElement('p');
        descriptionPara.textContent = 'Description: ' + task.description;
        taskDescription.appendChild(descriptionPara);

        const priority = document.createElement('p');
        priority.textContent = 'Priority: ' + task.priority;
        taskDescription.appendChild(priority);
        
        if (task.priority === 'low') {
            priority.style.color = "green";
        } else if (task.priority === 'medium') {
            priority.style.color = "orange";
        } else if (task.priority === 'high') {
            priority.style.color = "red";
        }
        
        //task buttons container
        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');
        taskItem.appendChild(taskActions);

        //task edit button
        const editTaskBtn = document.createElement('button');
        editTaskBtn.classList.add('edit-task-btn');
        editTaskBtn.textContent = 'Edit Task';
        editTaskBtn.addEventListener('click', () => {
            handleEditTask(task)
        });
        taskActions.appendChild(editTaskBtn);

        //task complete button
        const completeTaskBtn = document.createElement('button');
        completeTaskBtn.classList.add('complete-task-btn');
        //switch between uncomplete and complete
        const updateButtonState = () => {
            if (task.isComplete) {
                completeTaskBtn.textContent = 'Uncomplete';
                completeTaskBtn.classList.remove('btn-complete');
                completeTaskBtn.classList.add('btn-uncomplete');
            } else {
                completeTaskBtn.textContent = 'Complete';
                completeTaskBtn.classList.remove('btn-uncomplete');
                completeTaskBtn.classList.add('btn-complete');
            }
        };
        updateButtonState();
        completeTaskBtn.addEventListener('click', () => {
            task.isComplete = !task.isComplete;
            updateButtonState();
            createProjectCard();
        });
        taskActions.appendChild(completeTaskBtn);
    
        //task delete button
        const deleteTaskBtn = document.createElement('button');
        deleteTaskBtn.classList.add('delete-task-btn');
        deleteTaskBtn.textContent = 'Delete';
        deleteTaskBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
            projectManager.removeTaskFromCurrentProject(task.title);
            createProjectCard();
            }
        })
        taskActions.appendChild(deleteTaskBtn);

        return taskItem;
    }

    //display all projects in left column
    const showAllProjects = () => {
        //call for all projects array of objects
        const allProjects = projectManager.getAllProjects();
        console.log(allProjects.length);
        if (allProjects.length > 0) {
            //clear container
            projectsContainer.textContent = '';

            //set information for each project
            allProjects.forEach(project => {
                //create individual project cards that are buttons
                const navCard = document.createElement('button');
                navCard.classList.add('project-card');
                navCard.dataset.projectId = project.title;
                projectsContainer.appendChild(navCard);

                //add project title to project card
                const projectTitle = document.createElement('h2');
                projectTitle.classList.add('project-title');
                projectTitle.textContent = project.title;
                navCard.appendChild(projectTitle);

                //box for project buttons
                const projectBtns =document.createElement('div');
                projectBtns.classList.add('project-btns-div');
                navCard.appendChild(projectBtns);

                //add edit button
                const editProjectBtn = document.createElement('button');
                editProjectBtn.classList.add('project-edit-btn');
                editProjectBtn.textContent = 'Edit';
                editProjectBtn.addEventListener('click', (e) => {
                     e.stopPropagation();
                    handleEditProject(project);
                });
                projectBtns.appendChild(editProjectBtn);

                //add delete button
                const deleteProjectBtn = document.createElement('button');
                deleteProjectBtn.innerHTML = '&times;';
                deleteProjectBtn.classList.add('project-delete-btn');
                deleteProjectBtn.addEventListener('click', (e) => {
                     e.stopPropagation();
                    if (confirm(`Are you sure you want to delete the project "${project.title}"?`)) {
                        projectManager.removeProject(project.title);
                        showAllProjects();
                        createProjectCard();
                    }});
                projectBtns.appendChild(deleteProjectBtn);

                //create event listener for when project card is clicked
                navCard.addEventListener('click', (e) => {
                    //find card ID
                    const clickedCard = e.target.closest(`.project-card`);
                    if (clickedCard) {
                        //close project form if open
                        closeForm('new-project-form');
                        
                        //set project ID and format to get the project
                        const projectId = clickedCard.dataset.projectId;
                        const formattedProjectId = projectId.trim().toLowerCase();
                        const clickedProject = projectManager.getProject(formattedProjectId);
    
                        if (clickedProject) {
                            //set the current project to the clicked project
                            projectManager.setCurrentProject(clickedProject);
                        } else {
                            alert("Error selecting project.")
                        }

                        //create project-task container
                        createProjectCard();
                    }
                });
            })} else {
                projectsContainer.textContent = 'No projects available. Create a new project to get started!';
            }
        };

    //create a project-task card for current project with tasks listed
    const createProjectCard = () => {
        //get current project object
        const currentProject = projectManager.getCurrentProject();
        console.log(currentProject);
        if (currentProject && currentProject.id) {
            //clear project-task container
            projectTaskItems.textContent = '';
        
            //create project-task card
            const projectTaskCard = document.createElement('div');
            projectTaskCard.dataset.projectId = currentProject.title;
            projectTaskCard.classList.add('project-task-card');
            projectTaskItems.appendChild(projectTaskCard);

            //create header box for task
            const headerBox = document.createElement('div');
            headerBox.classList.add('header-box');
            projectTaskCard.appendChild(headerBox);

            //add project title to header box
            const title = document.createElement('h2');
            title.classList.add('card-title');
            title.textContent = 'Project: ' + currentProject.title;
            headerBox.appendChild(title);

            //add task list container to header box
            const taskList = document.createElement('div');
            taskList.classList.add('task-list');
                headerBox.appendChild(taskList);

                if (currentProject.tasks.length > 0) {
                    //clear task list
                    taskList.textContent = '';

                    //create each individual task
                    currentProject.tasks.forEach(task => {
                        const taskElement = createTaskElement(task, currentProject);
                        taskList.appendChild(taskElement);
                    });
                } else {
                taskList.textContent = "No tasks available. Create a new task for your project.";
            }
        } else {
            projectTaskItems.textContent = '';
            projectsContainer.textContent = 'No projects available. Create a new project to get started!';
        }
    }

    //new project handler
    const handleNewProject = () => {
        //focus on project title
        setTimeout(function() {
        document.getElementById('project-title').focus();
        }, 0);
        
        // clear project-task container
        projectTaskItems.textContent = '';

        //fill new project form
        newProjectFormTitle.textContent = 'Create New Project';
        addProjectBtn.textContent = "Add Project";

        newProjectForm.reset();
        editProject = null;
        openForm('new-project-form');
    }

    //edit project handler
    const handleEditProject = (project) => {
        //set the current project to the editing one
        projectManager.setCurrentProject(project);

        //reload project-task container
        createProjectCard();

        //fill new project form for edit project
        newProjectFormTitle.textContent = "Edit Project";
        addProjectBtn.textContent = "Edit";
        editProject = project;
        //focus on project title
        setTimeout(function() {
        document.getElementById('project-title').focus();
        }, 0);
        
        openForm('new-project-form');
        newProjectForm.querySelector('#project-title').value = project.title;
    }

    //new task handler
    const handleNewTask = () => {
        //focus on task title
        setTimeout(function() {
        document.getElementById('task-title').focus();
        }, 0);

        //get all projects
        const allProjects = projectManager.getAllProjects();
        if (allProjects.length > 0) {
            //clear project-task container 
            projectTaskItems.textContent = '';

            //fill new task form
            newTaskFormTitle.textContent = "Create New Task";
            addTaskBtn.textContent = 'Add Task';
            
            newTaskForm.reset();
            editTask = null;
            openForm('new-task-form');
        } else {
            alert("Please add a Project");
        }
    }

    //edit task handler
    const handleEditTask = (task) => {
        //fill new task form for edit task
        newTaskFormTitle.textContent = "Edit Task";
        addTaskBtn.textContent = "Edit";
        editTask = task;
        setTimeout(function() {
        document.getElementById('task-title').focus();
        }, 0);
        openForm('new-task-form');

        // Populate the form with the task's existing data
        newTaskForm.querySelector('#task-title').value = task.title;
        newTaskForm.querySelector('#task-description').value = task.description;
        newTaskForm.querySelector('#task-due-date').value = task.dueDate;
        newTaskForm.querySelector('#task-priority').value = task.priority;
    }
    
    //close project form handler
    const handleCloseProjectForm = () => {
        //get current project
        const project = projectManager.getCurrentProject();
        if (project) {
            createProjectCard();
        } else {
            showAllProjects();
        }
    }

    //close task form handler
    const handleCloseTaskForm = () => {
        //get current project
        const project = projectManager.getCurrentProject();
        if (project) {
            createProjectCard();
        } else {
            console.log('Error occured.');
        }
    }

    //event listener calls for project and task buttons
    newProjectBtn.addEventListener('click', handleNewProject);
    closeProjectFormBtn.addEventListener('click', handleCloseProjectForm);
    newTaskBtn.addEventListener('click', handleNewTask);
    closeTaskFormBtn.addEventListener('click', handleCloseTaskForm);

    //new project form submit event listener
    newProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        //fill project title
        const newProjectTitle = newProjectForm.querySelector('#project-title').value;
        
        if (!newProjectTitle) {
            console.log("Title cannot be empty.")
            return
        }
            
        if (editProject) {
            //update project title
            projectManager.updateProjectTitle(editProject.id, newProjectTitle);
            editProject.title = newProjectTitle;
        } else {
            //add a new project
            projectManager.addProject(newProjectTitle);
        }
        
        showAllProjects();
        createProjectCard();
        newProjectForm.reset();
        editProject = null;
        closeForm('new-project-form');
    });

    //new task form submit event listener
    newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskTitle = newTaskForm.querySelector('#task-title').value;
        const taskDescription = newTaskForm.querySelector('#task-description').value;
        const taskDueDate = newTaskForm.querySelector('#task-due-date').value;
        const taskPriority = newTaskForm.querySelector('#task-priority').value;
        
        //for editing task
        if (editTask) {
            editTask.title = taskTitle;
            editTask.description = taskDescription;
            editTask.dueDate = taskDueDate;
            editTask.priority = taskPriority;

            projectManager.saveProjects();

            createProjectCard();
            newTaskForm.reset();
            editTask = null;
            closeForm('new-task-form');
            return;// stops anything else from happening below
        } else if (taskTitle) {
            //add a new task
            projectManager.addTaskToCurrentProject(taskTitle, taskDescription, taskDueDate, taskPriority);
        }
        createProjectCard();
        newTaskForm.reset();
        editTask = null;
        closeForm('new-task-form');
    });

    //Load DOM when page opens
    document.addEventListener('DOMContentLoaded', () => {
        projectManager.loadProjects();
        showAllProjects();
        createProjectCard();
        closeFormButtons();
    });
})();

export default ui;