/**
 * Initializes the application by retrieving tasks and contacts from storage, and rendering the tasks in each column.
 * 
 * Retrieves the tasks and contacts from storage.
 * Renders the tasks in the 'toDo', 'inProgress', 'feedback', and 'done' columns.
 */
async function init() {
    inBoard = true;
    await includeHTML();
    tasks = JSON.parse(await getItem('tasks'));
    contacts = JSON.parse(await getItem('contacts'));
    renderTasks(tasks, 'toDo', 'toDo');
    renderTasks(tasks, 'inProgress', 'inProgress');
    renderTasks(tasks, 'feedback', 'feedback');
    renderTasks(tasks, 'done', 'done');
    generateLoggedinUserLogo();
}

/**
 * Renders the tasks for a specific column.
 * 
 * @param {Object} array - The tasks object.
 * @param {string} column - The column to render.
 * @param {string} id - The ID of the HTML element representing the column.
 */
function renderTasks(array, column, id) {
    let columnId = document.getElementById(id)
    columnId.innerHTML = '';
    if (array[column].length == 0) {
        columnId.innerHTML = createHtmlForEmptyCategory();
    }
    for (let i = 0; i < array[column].length; i++) {
        const task = array[column][i];
        columnId.innerHTML += createHtmlForTasks(task, column, i);
        renderInitinalsForAssingetPeople(column, i);
        checkIfSubtask(task, column, i);
    }
}

/**
 * Renders the initials of assigned people for a specific task in a column.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function renderInitinalsForAssingetPeople(column, i) {
    let assignedTo = document.getElementById(`assignedTo${column}${i}`);
    if (tasks[column][i].assignedTo && tasks[column][i].assignedTo.length > 0) {
        for (let p = 0; p < tasks[column][i].assignedTo.length; p++) {
            const person = tasks[column][i].assignedTo[p];
            if (p < 3) {
                assignedTo.innerHTML += createHtmlForAssignedPeopleTask(person);
            } else {
                assignedTo.innerHTML += createHtmlForAdditional(tasks[column][i].assignedTo.length - 3);
                return;
            }
        }
    }
}

/**
 * Opens the task information container and renders the details of the selected task.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function openTask(column, i) {
    let taskInfoContainer = document.getElementById('taskInfoContainer');
    taskInfoContainer.classList.remove('dNone');
    taskInfoContainer.innerHTML = createHtmlForTaskInfo(column, i);
    renderAssignetPeople(column, i);
    preventScrollingInBackground();
}

/**
 * Renders the assigned people for a specific task in the task information container.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function renderAssignetPeople(column, i) {
    let assignedToContainer = document.getElementById('assignedToContainer');
    if (tasks[column][i].assignedTo && tasks[column][i].assignedTo.length > 0) {
        for (let p = 0; p < tasks[column][i].assignedTo.length; p++) {
            const person = tasks[column][i].assignedTo[p];
            assignedToContainer.innerHTML += createHtmlForAssignedPeople(person);
        }
    } else {
        return;
    }
}

// EDIT TASK FUNCTIONS

/**
 * Edits the details of a task in the task information container.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function editTask(column, i) {
    let taskInfoContainer = document.getElementById('taskInfoContainer');
    taskInfoContainer.innerHTML = createHtmlForEditTask(column, i);
    assignedPeople = [];
    getValuesForTask(column, i);
    getPrioStatus(column, i);
    getAssignedTo(column, i);
    renderAssignetPeopleForEdit();
    renderAssignetInitials(column, i);
    getSubtasks(column, i);
}

/**
 * Retrieves the values of a task and populates the corresponding input fields.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function getValuesForTask(column, i) {
    document.getElementById('inputEditTitle').value = tasks[column][i].title;
    document.getElementById('inputEditDescription').value = tasks[column][i].description;
    document.getElementById('dueDate').value = tasks[column][i].date;
}

/**
 * Retrieves the priority status of a task and updates the corresponding UI.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function getPrioStatus(column, i) {
    let prioStatus = tasks[column][i].prio;
    if (prioStatus == 1) {
        addPrioEditTask(0);
    } else if (prioStatus == 2) {
        addPrioEditTask(1);
    } else {
        addPrioEditTask(2);
    }
}

/**
 * Adds the priority status UI for the selected priority level.
 * 
 * @param {number} status - The index of the priority level.
 */
function addPrioEditTask(status) {
    resetPrioActive(status);
}

/**
 * Resets the priority status UI and highlights the selected priority level.
 * 
 * @param {number} status - The index of the priority level.
 */
function resetPrioActive(status) {
    let buttonId = ['urgentBtn', 'mediumBtn', 'lowBtn'];
    let imageId = ['urgentImage', 'mediumImage', 'lowImage']
    let color = ['#FB3D01', '#FFA800', '#7AE22A']
    for (let i = 0; i < buttonId.length; i++) {
        document.getElementById(buttonId[i]).style = '';
        document.getElementById(imageId[i]).style = '';
        document.getElementById(buttonId[i]).classList.remove('prioActive');
    }
    document.getElementById(buttonId[status]).style = `background-color: ${color[status]}`;
    document.getElementById(imageId[status]).style = 'filter: brightness(0) invert(1);';
    document.getElementById(buttonId[status]).classList.add('prioActive');
    prioValue = status + 1;
}

/**
 * Retrieves the assigned people for a task and updates the assignedPeople array.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function getAssignedTo(column, i) {
    let assignedNames = tasks[column][i].assignedTo;
    if (contacts && contacts.length > 0) {
        for (let p = 0; p < contacts.length; p++) {
            const contactName = contacts[p].name;
            if (assignedNames.includes(contactName)) {
                assignedPeopleForEditTask(contactName, true);
            } else {
                assignedPeopleForEditTask(contactName, false);
            }
        }
    }
}

/**
 * Adds an assigned person to the assignedPeople array for editing a task.
 * 
 * @param {string} name - The name of the assigned person.
 * @param {boolean} checked - The checked status of the assigned person.
 */
function assignedPeopleForEditTask(name, checked) {
    let assign = {
        'name': name,
        'assigned': checked
    };
    assignedPeople.push(assign);
}

/**
 * Renders the assigned people list in the edit task form.
 */
function renderAssignetPeopleForEdit() {
    let assignedList = document.getElementById('assignedList');
    assignedList.innerHTML = '';
    for (let i = 0; i < assignedPeople.length; i++) {
        const assign = assignedPeople[i];
        assignedList.innerHTML += createHtmlForAssignedList(assign, i)
    }
}

/**
 * Renders the initials of assigned people for a task.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function renderAssignetInitials(column, i) {
    let selectedAssignments = document.getElementById('selectedAssignments');
    for (let p = 0; p < tasks[column][i].assignedTo.length; p++) {
        const person = tasks[column][i].assignedTo[p];
        selectedAssignments.innerHTML += createHtmlForAssignedPeopleTask(person);
    }
}

/**
 * Changes the assigned status of an assigned person in the edit task form.
 * 
 * @param {number} i - The index of the assigned person in the assignedPeople array.
 */
function changeAssignedStatus(i) {
    let checked = document.getElementById(`checkbox${i}`).checked;
    assignedPeople[i].assigned = checked;
}

/**
 * Retrieves the subtasks for a task and updates the subtasks list in the edit task form.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function getSubtasks(column, i) {
    let subtaskList = document.getElementById('subtasksList');
    subtaskList.innerHTML = '';
    if (tasks[column][i].subtask && tasks[column][i].subtask.length > 0) {
        for (let s = 0; s < tasks[column][i].subtask.length; s++) {
            const task = tasks[column][i].subtask[s];
            if (task.status == true) {
                subtaskList.innerHTML += createHtmlForSubtask(task, true, column, i, s);
            } else {
                subtaskList.innerHTML += createHtmlForSubtask(task, false, column, i, s);
            }
        }
    }
}

/**
 * Changes the status of a subtask in the edit task form.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 * @param {string} id - The ID of the HTML element representing the subtask.
 * @param {number} s - The index of the subtask within the task.
 */
function changeSubtaskStatus(column, i, id, s) {
    let subtaskStatus = document.getElementById(id).checked;
    tasks[column][i].subtask[s].status = subtaskStatus;
}

/**
 * Adds a new subtask to a task in the edit task form.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function addSubtask(column, i) {
    let subtaskInput = document.getElementById('inputSubtask');
    let id = generateRandomId();
    let newSubtast = {
        id: id,
        title: subtaskInput.value,
        status: false,
    };
    if (subtaskInput.value.length > 0) {
        tasks[column][i].subtask.push(newSubtast);
        getSubtasks(column, i);
        subtaskInput.value = '';
    } else {
        alert('Type in a titel to add a subtask')
    }
}

/**
 * Deletes a subtask from a task.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 * @param {number} s - The index of the subtask within the task.
 */
function deleteSubtask(column, i, s) {
    tasks[column][i].subtask.splice(s, 1);
    getSubtasks(column, i);
}

/**
 * Saves the changes made to a task in the edit task form.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
async function saveChangesForTask(column, i) {
    let title = document.getElementById('inputEditTitle').value;
    let description = document.getElementById('inputEditDescription').value;
    let dueDate = document.getElementById('dueDate').value;
    let prioStatus = prioValue;
    tasks[column][i].title = title;
    tasks[column][i].description = description;
    tasks[column][i].date = dueDate;
    tasks[column][i].prio = prioStatus;
    saveAssignedPeopleList(column, i);
    await setItem('tasks', JSON.stringify(tasks));
    init();
    openTask(column, i);
    preventScrollingInBackground();
}

/**
 * Saves the changes made to the assigned people list in the edit task form.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function saveAssignedPeopleList(column, i) {
    let changes = [];
    for (let i = 0; i < assignedPeople.length; i++) {
        const person = assignedPeople[i];
        if (person.assigned == true) {
            changes.push(person.name);
        } else {
            continue;
        }
    }
    tasks[column][i].assignedTo = changes;
}

/**
 * Deletes a task from the task list.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
async function deleteTask(column, i) {
    tasks[column].splice(i, 1);
    await setItem('tasks', JSON.stringify(tasks));
    init();
    closeWindow('taskInfoContainer');
    preventScrollingInBackground();
}

// FILTER FUNCTIONS

/**
 * Filters the tasks based on the search input.
 */
function filterTasks() {
    let column = ['toDo', 'inProgress', 'feedback', 'done'];
    let search = document.getElementById('inputSearch').value;
    search = search.toLowerCase().trim();
    for (let c = 0; c < column.length; c++) {
        const space = column[c];
        if (search.length > 0) {
            filteredTasks[space] = tasks[space].filter(t => checkIfIncluded(t, search));
            renderTasks(filteredTasks, space, space);
        } else {
            init();
        }
    }
}

/**
 * Checks if a task is included in the search results.
 * 
 * @param {Object} t - The task object.
 * @param {string} search - The search input.
 * @returns {boolean} - True if the task is included in the search results, false otherwise.
 */
function checkIfIncluded(t, search) {
    return t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search);
}

// DRAG & DROP FUNTIONS

/**
 * Allows the dropping of elements during drag and drop.
 * 
 * @param {Event} ev - The drag event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Starts dragging a task to prepare for drag and drop.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function startDragging(column, i) {
    currentDraggedTask = {
        'column': column,
        'position': i
    }
}

/**
 * Moves a task to a different category during drag and drop.
 * 
 * @param {string} category - The category to move the task to.
 */
async function moveTo(category) {
    let column = currentDraggedTask.column;
    let position = currentDraggedTask.position;
    let toMoveTask = tasks[column].splice(position, 1)[0];
    tasks[category].push(toMoveTask);
    await setItem('tasks', JSON.stringify(tasks));
    init();
}

/**
 * This function opens the "Add Task" section by removing the "dNone" class from the "modalAddtask" element.
 * It makes the "Add Task" section visible on the page.
 */
function openAddtaskSection(column) {
    document.getElementById('modalAddtask').classList.remove('dNone');
    isMobil = true;
    taskColumn = column;
}

/**
 * Moves a task to the "Mobil" column on mobile view.
 * 
 * @param {string} column - The column the task currently belongs to.
 * @param {number} i - The index of the task within the column.
 */
function moveToMobil(column, i) {
    renderMoveToMobil(column, i)
    // generateMoveToOptions(column, i);
}

/**
 * Renders the "Move to Mobil" option for a task on mobile view.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function renderMoveToMobil(column, i) {
    let smallTask = document.getElementById(`moveFrom${column}${i}`);
    smallTask.innerHTML = createHtmlMoveTo(column, i);
}

/**
 * Moves a task to a different category.
 * 
 * @param {string} goal - The category to move the task to.
 * @param {string} column - The column the task currently belongs to.
 * @param {number} i - The index of the task within the column.
 */
async function moveToCategory(goal, column, i) {
    tasks[goal].push(tasks[column].splice(i, 1)[0]);
    await setItem('tasks', JSON.stringify(tasks));
    init();
}