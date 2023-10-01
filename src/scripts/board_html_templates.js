/**
 * Creates the HTML code for rendering a task.
 * 
 * @param {object} task - The task object.
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 * @returns {string} - The HTML code for rendering the task.
 */
function createHtmlForTasks(task, column, i) {
    let title = task.title;
    let description = truncateText(task.description);
    let category = task.category.name;
    let categoryColor = task.category.color;
    let prio = checkPrioStatus(task.prio, 'path');
    let subtasklength = task.subtask.length;
    let finishedSubtasks = checkIfSubtaskIsDone(task.subtask);
    let progress = calculateProgress(subtasklength, finishedSubtasks);
    return `
        <div draggable="true" ondragstart="startDragging('${column}', ${i})" id="moveFrom${column}${i}" class="task" onclick="openTask('${column}', ${i})">
            <img class="mobileMoveToBtn" onclick="doNotClose(event); moveToMobil('${column}', ${i})" src="src/img/img_board/arrows.png">
            <div class="category" style="background-color: ${categoryColor}">${category}</div>
            <h3 class="title">${title}</h3>
            <div class="description">${description}</div>
            <div class="subtaskBar" id="subtaskBar${column}${i}">
                <div class="progressBar">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
                <div class="progressInNumbers" id="progressInNumbers">${finishedSubtasks}/${subtasklength}</div>
            </div>
            <div class="statusContainer">
                <div class="assignedToContainer" id="assignedTo${column}${i}"></div>
                <img src="${prio}" class="prioImage">
            </div>
        </div>
    `;
}

/**
 * Creates the HTML code for displaying an empty category message.
 * @returns {string} The HTML markup for the empty category message.
 */
function createHtmlForEmptyCategory() {
    return `
        <div class="emptyCategory">No tasks here</div>
    `;
}

/**
 * Creates the HTML code for rendering the task information window.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 * @returns {string} - The HTML code for rendering the task information window.
 */
function createHtmlForTaskInfo(column, i) {
    let title = tasks[column][i].title;
    let description = tasks[column][i].description;
    let category = tasks[column][i].category.name;
    let categoryColor = tasks[column][i].category.color;
    let date = tasks[column][i].date;
    let prioImage = checkPrioStatus(tasks[column][i].prio, 'path');
    let prio = checkPrioStatus(tasks[column][i].prio, 'word');
    let prioColor = getPrioColor(tasks[column][i].prio);
    return `
        <div class="taskEditContainer" onclick="doNotClose(event)">
            <img src="src/img/img_board/cross.png" alt="cross for closing the window" class="closeBtn" onclick="closeWindow('taskInfoContainer')">
            <div class="category" style="background-color: ${categoryColor}">${category}</div>
            <h3 class="title titleEditWindow">${title}</h3>
            <div class="description">${description}</div>
            <div class="dateContainer">
                <div class="subheadlineStyle">Due date:</div>
                <div class="dateValue">${date}</div>
            </div>
            <div class="priorityContainer">
                <div class="subheadlineStyle">Priority:</div>
                <div class="priorityValue" style="background-color: ${prioColor}">${prio}<img src="${prioImage}"></div>
            </div>
            <div class="assignedToMainContainer">
                <div class="subheadlineStyle">Assigned to:</div>
                <div id="assignedToContainer"></div>
            </div>
            <div class="editDeleteContainer">
                <div onclick="deleteTask('${column}', ${i})" class="left"></div>
                <div onclick="editTask('${column}', ${i}), addEnterListener('${column}', ${i})" class="right">
                    <img src="src/img/img_board/pencil.png" alt="image of a pencil">
                </div>
            </div>
        </div>
    `;
}

/**
 * Creates the HTML code for rendering an assigned person.
 * 
 * @param {string} person - The name of the assigned person.
 * @returns {string} - The HTML code for rendering the assigned person.
 */
function createHtmlForAssignedPeople(person) {
    let initialsColor = getColorForInitials(person)
    let nameWithoutUmlauts = deUmlaut(person);
    let initials = nameWithoutUmlauts.match(/\b\w/g).join('').toUpperCase();
    return `
        <div class="assignedPerson">
            <div class="initials" style="background-color: ${initialsColor}">${initials}</div>
            <span>${person}</span>
        </div>
    `;
}

/**
 * Creates the HTML code for rendering the initials of an assigned person (used in task view).
 * 
 * @param {string} person - The name of the assigned person.
 * @returns {string} - The HTML code for rendering the assigned person's initials.
 */
function createHtmlForAssignedPeopleTask(person) {
    let initialsColor = getColorForInitials(person)
    let nameWithoutUmlauts = deUmlaut(person);
    let initials = nameWithoutUmlauts.match(/\b\w/g).join('').toUpperCase();
    return `
        <div class="assignedPersonInitials">
            <div class="initials" style="background-color: ${initialsColor}">${initials}</div>
        </div>
    `;
}

/**
 * Creates the HTML code for rendering additional assigned people (used in task view).
 * 
 * @param {number} amount - The number of additional assigned people.
 * @returns {string} - The HTML code for rendering the additional assigned people.
 */
function createHtmlForAdditional(amount) {
    return `
        <div class="assignedPersonInitials">
            <div class="initials" style="background-color: #2A3647">+${amount}</div>
        </div>
    `;
}

/**
 * Creates the HTML code for rendering the edit task window.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 * @returns {string} - The HTML code for rendering the edit task window.
 */
function createHtmlForEditTask(column, i) {
    return `
        <div id="taskEditContainer" class="taskEditContainer editTaskGap" onclick="doNotClose(event); assignAction('close')">
            <img src="src/img/img_board/cross.png" alt="cross for closing the window" class="closeBtn" onclick="closeWindow('taskInfoContainer')">
            <div class="leftEditContainer">
                <label class="editTitle">Title</label>
                <input type="text" id="inputEditTitle" placeholder="Enter a title" required>
                <label class="editDescription">Description</label>
                <textarea id="inputEditDescription" placeholder="Enter a description" method="dialog" required></textarea>
                <div class="assignedContainer">
                    <label>Assigned to</label>
                    <div id="assignedToInput">
                        <div onclick="doNotClose(event); assignAction('toggle')" class="assignedBtn">Select Contacts<img class="assignedOpenBtn" src="src/img/img_board/arrow_down.png" alt=""></div>
                        <ul class="assignedList" id="assignedList"></ul>
                    </div>
                    <div id="selectedAssignments"></div>
                </div>
            </div>
            <div class="rightEditContainer">
                <label class="editDate">Due date</label>
                <input type="date" onclick="noPastDate()" class="dueDate" id="dueDate" name="dueDate" required>
                <div class="inputPrioContainer">
                    <label>Prio</label>
                    <div class="prioBtn">
                        <button id="urgentBtn" onclick="addPrioEditTask(0)"><span>Urgent</span><img class="prioImg"
                                id="urgentImage" src="./src/img/img_board/urgent_prio.png"></button>
                        <button id="mediumBtn" onclick="addPrioEditTask(1)"><span>Medium</span><img class="prioImg"
                                id="mediumImage" src="./src/img/img_board/medium_prio.png"></button>
                        <button id="lowBtn" onclick="addPrioEditTask(2)"><span>Low</span><img class="prioImg"
                                id="lowImage" src="./src/img/img_board/low_prio.png"></button>
                    </div>
                </div>
                <div class="subTaskContainer">
                    <label>Subtasks</label>
                    <div class="subtaksInputContainer">
                        <input type="text" id="inputSubtask" placeholder="Add new subtask">
                        <button onclick="addSubtask('${column}', ${i})" class="subtaskAddBtn"></button>
                    </div>
                    <ul id="subtasksList"></ul>
                </div>
            </div>
            <button onclick="saveChangesForTask('${column}',${i})" class="applyEditBtn">Ok<img src="src/img/img_contacts/ok_chop.png"alt="image of a chop"></button>          
        </div>
    `;
}

/**
 * Creates the HTML code for rendering an assigned person in the edit task window.
 * 
 * @param {object} assign - The assigned person object.
 * @param {number} i - The index of the assigned person.
 * @returns {string} - The HTML code for rendering the assigned person in the edit task window.
 */
function createHtmlForAssignedList(assign, i) {
    let name = assign.name;
    let checked = checkBooleanValue(assign.assigned);
    return `
        <li onclick="doNotClose(event); changeAssignedStatus(${i})"><label for="checkbox${i}">${name}</label><input type="checkbox" id="checkbox${i}" ${checked}></li>
    `;
}

/**
 * Creates the HTML code for rendering a subtask.
 * 
 * @param {object} task - The subtask object.
 * @param {boolean} checked - The status of the subtask.
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 * @param {number} s - The index of the subtask within the task.
 * @returns {string} - The HTML code for rendering the subtask.
 */
function createHtmlForSubtask(task, checked, column, i, s) {
    let title = task.title;
    let checkedStatus = checkBooleanValue(checked)
    let id = task.id;
    return `
        <li onclick="changeSubtaskStatus('${column}', ${i}, ${id}, ${s})"><input type="checkbox" id="${id}" ${checkedStatus}><label for="subtask${i}">${title}</label><div class="deleteSubtaskBtn" onclick="deleteSubtask('${column}', ${i}, ${s})"></div></li>
    `;
}


/**
 * Creates the HTML code for rendering the move to mobile options.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 * @returns {string} - The HTML code for rendering the move to mobile options.
 */
function createHtmlMoveTo(column, i) {
    let moveOptions = generateMoveToOptions(column, i);
    return `
        <div class="mobilMoveToContainer" onclick="doNotClose(event)">
            ${moveOptions}
        </div>
    `;
}

/**
 * Generates the move-to options for a task column.
 * @param {string} column - The current column of the task.
 * @param {number} index - The index of the task.
 * @returns {string} - The HTML string representing the move-to options.
 */
function generateMoveToOptions(column, index) {
    const categories = ['toDo', 'inProgress', 'feedback', 'done'];
    const names = ['To Do', 'In progress', 'Awaiting feedback', 'Done'];
    let moveOptions = '';
    for (let i = 0; i < categories.length; i++) {
        if (column != categories[i]) {
            moveOptions += `<div class="mobileMoveToRow" onclick="moveToCategory('${categories[i]}', '${column}', ${index})">${names[i]}</div>`;
        }
    }
    return moveOptions;
}
