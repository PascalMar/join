/**
 * Truncates the text to a specified maximum length and adds ellipsis if necessary.
 * 
 * @param {string} text - The text to truncate.
 * @returns {string} - The truncated text.
 */
function truncateText(text) {
    let maxLength = 30;
    if (text.length > maxLength) {
        let abridgedText = text.slice(0, maxLength) + '...';
        return abridgedText;
    } else {
        return text;
    }
}

/**
 * Checks the number of finished subtasks.
 * 
 * @param {Array} subtask - An array of subtasks.
 * @returns {number} - The number of finished subtasks.
 */
function checkIfSubtaskIsDone(subtask) {
    let finishedSubtasks = 0;
    for (let i = 0; i < subtask.length; i++) {
        const status = subtask[i].status;
        if (status == true) {
            finishedSubtasks++
        } else {
            continue;
        }
    }
    return finishedSubtasks;
}

/**
 * Calculates the progress percentage based on the number of finished subtasks and the total subtask length.
 * 
 * @param {number} subtasklength - The total number of subtasks.
 * @param {number} finishedSubtasks - The number of finished subtasks.
 * @returns {number} - The progress percentage rounded to two decimal places.
 */
function calculateProgress(subtasklength, finishedSubtasks) {
    let result = finishedSubtasks / subtasklength * 100;
    let roundedResult = result.toFixed(2);
    return roundedResult;
}

/**
 * Checks the priority status and returns either the image path or the corresponding word.
 * 
 * @param {number} prio - The priority value.
 * @param {string} returnTyp - The return type: 'path' for image path, 'word' for corresponding word.
 * @returns {string} - The image path or corresponding word based on the priority.
 */
// 
function checkPrioStatus(prio, returnTyp) {
    let priorities = {
        1: ['src/img/img_board/urgent_prio.png', 'Urgent'],
        2: ['src/img/img_board/medium_prio.png', 'Medium'],
        3: ['src/img/img_board/low_prio.png', 'Low']
    }
    let defaultPrio = 3;
    let priority = priorities[prio] || priorities[defaultPrio];
    if (returnTyp == 'path') {
        return priority[0];
    } else if (returnTyp == 'word') {
        return priority[1];
    }
}

/**
 * Retrieves the color associated with a given priority level.
 *
 * @param {number} prio - The priority level.
 * @returns {string} The color associated with the priority level.
 */
function getPrioColor(prio) {
    let colors = ['#FB3D01', '#FFA800', '#7AE22A'];
    return colors[prio-1];
}

/**
 * Gets the color for the initials of a name based on the second part of the name.
 * 
 * @param {string} name - The name to get the initials color for.
 * @returns {string} - The color for the initials.
 */
function getColorForInitials(name) {
    let firstLetter = name.split(' ')[1][0].toLowerCase();
    let index = firstLetter.charCodeAt(0) - 'a'.charCodeAt(0);
    return initialsColors[index];
}

/**
 * Replaces umlaut characters in a string with their respective ASCII representations.
 * 
 * @param {string} value - The input string to process.
 * @returns {string} - The input string with umlaut characters replaced.
 */
function deUmlaut(value) {
    value = value.toLowerCase();
    value = value.replace(/ä/g, 'ae');
    value = value.replace(/ö/g, 'oe');
    value = value.replace(/ü/g, 'ue');
    return value;
}

/**
 * Prevents the event from propagating further.
 * 
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * This function closes a window or modal with the given ID by adding the "dNone" class to hide it.
 * It also calls the "preventScrollingInBackground" function to prevent scrolling of the background content.
 *
 * @param {string} id - The ID of the window or modal element to close.
 */
function closeWindow(id) {
    let windowContainer = document.getElementById(id);
    windowContainer.classList.add('dNone');
    preventScrollingInBackground();
}

/**
 * This function assigns an action to the "assignedToInput" element based on the given action parameter.
 * If the action is 'close', it removes the 'openAssigned' class from the element.
 * If the action is 'toggle', it toggles the presence of the 'openAssigned' class on the element.
 *
 * @param {string} action - The action to assign to the "assignedToInput" element.
 */
function assignAction(action) {
    const assignedToInput = document.getElementById('assignedToInput');
    if (action === 'close') {
        assignedToInput.classList.remove('openAssigned');
    } else if (action === 'toggle') {
        assignedToInput.classList.toggle('openAssigned');
    }
}

/**
 * Adds an event listener for the Enter key on the input field.
 * @param {number} column - The column index.
 * @param {number} i - The task index.
 */
function addEnterListener(column, i) {
    let input = document.getElementById('inputSubtask');
    if (input) {
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                addSubtask(column, i);
            }
        });
    }
}

/**
 * Checks the boolean value and returns 'checked' if true, otherwise returns undefined.
 * 
 * @param {boolean} value - The boolean value to check.
 * @returns {string|undefined} - 'checked' if the value is true, undefined otherwise.
 */
function checkBooleanValue(value) {
    if (value == true) {
        return 'checked';
    } else {
        return;
    }
}

/**
 * Generates a random ID for tasks or elements.
 * 
 * @returns {string} - The randomly generated ID.
 */
function generateRandomId() {
    const random = Math.floor(Math.random() * 1000000);
    return random.toString();
}

/**
 * Toggles the prevention of background scrolling by adding/removing the CSS class 'preventScrolling' to the main container.
 */
function preventScrollingInBackground() {
    let mainContainer = document.getElementById('boardMainContainer');
    mainContainer.classList.toggle('preventScrolling');
}

/**
 * Checks if a task has subtasks and updates the visibility of the subtask progress bar.
 * 
 * @param {Object} task - The task object.
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function checkIfSubtask(task, column, i) {
    let progressBar = document.getElementById(`subtaskBar${column}${i}`);
    let subtask = task.subtask.length;
    if (subtask == 0) {
        progressBar.classList.add('dNone');
    } else {
        return;
    }
}

/**
 * This function sets a minimum date for input fields with the name "dueDate",
 * ensuring that past dates are not selectable.
 * It retrieves the current date and sets it as the minimum value for each "dueDate" input field.
 */
function noPastDate() {
	let today = new Date().toISOString().split('T')[0];
	for (let i = 0; i < document.getElementsByName("dueDate").length; i++) {
		document.getElementsByName("dueDate")[i].setAttribute('min', today);
	}
}