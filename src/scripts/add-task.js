// global variables
let isMobil;
let inBoard;
let prio = null;
let subTasks = [];
let selectedCategoryName;
let selectedCatColor = null;
const prios = ['urgent', 'medium', 'low'];

/**
 * Initializes the addition of a task.
 * Calls the "loadUsers" function.
 */
async function initAddTask() {
	await includeHTML();
	loadUsers();
	generateLoggedinUserLogo();
}

/**
 * Loads user data from the backend.
 */
async function loadUsers() {
	tasks = JSON.parse(await getItem('tasks'));
}

/**
 * Initializes the task addition functionality.
 * Adds event listeners and loads categories and contacts.
 */
function initAddTasks() {
	document.querySelector('#select-task-category').addEventListener('click', categoryToggler);
	document.querySelector('.new-category__button--check').addEventListener('click', addNewCategory);
	document.querySelector('.assigned-to').addEventListener('click', assignToHandler);
	(() => {
		loadCategories();
		loadContacts();
	})();
}

/**
 * Creates a new task with the provided data and saves it in the backend.11
 * Displays a success message and navigates to the board page.
 */
async function createTask() {
	const { value: title } = document.getElementById('title');
	const { value: description } = document.getElementById('description');
	const { value: dueDate } = document.getElementById('due-date');
	const selectedCategory = { name: selectedCategoryName, color: selectedCatColor };
	if (selectedCategory.name === undefined) {
		alert("Bitte eine Kategorie auswählen!");
	} else {
		const assignees = Array.from(document.querySelectorAll('.contact__checkbox:checked')).map(input => input.value);
		const newTask = {
			category: { ...selectedCategory },
			assignedTo: assignees,
			title,
			description,
			prio,
			date: dueDate,
			subtask: subTasks
		};
		createNewTask(newTask);
	}
}

/**
 * Creates a new task.
 * @param {string} newTask - The new task to be added.
 */
async function createNewTask(newTask) {
	if (taskColumn === undefined) taskColumn = 'toDo';
	tasks[taskColumn].push(newTask);
	await setItem('tasks', JSON.stringify(tasks));
	alertMessage('Task succesfully created');
	if (isMobil == true) {
		setTimeout(() => {
			closeWindow('modalAddtask');
			resetForm();
			init();
		}, 1500);
	} else {
		goToBoard();
	}
}

/**
 * Navigates to the board page after a task is created.
 */
function goToBoard() {
	setTimeout(() => window.location.href = "board.html", 1500)
}

/**
 * Adds priority to the task based on the provided value.
 * Updates the UI to reflect the selected priority.
 * @param {number} prioValue - The priority value (0: urgent, 1: medium, 2: low).
 */
function addPrio(priorityValue) {
	resetPrio();
	selectPriority(priorityValue);
	event.preventDefault();
}

/**
 * Selects a priority level and applies corresponding styles to the elements.
 * @param {number} priorityValue - The selected priority value.
 */
function selectPriority(priorityValue) {
	document.getElementById(`${prios[priorityValue]}-btn`).classList.add(`${prios[priorityValue]}-aktiv`);
	document.getElementById(`${prios[priorityValue]}-image`).style.filter = 'brightness(0) invert(1)';
	prio = priorityValue + 1;
}

// /**
//  * Resets the priority buttons to their default state.
//  */

function resetPrio() {
	for (let i = 0; i < prios.length; i++) {
		const priority = prios[i];
		document.getElementById(`${priority}-btn`).classList.remove(`${priority}-aktiv`);
		document.getElementById(`${priority}-image`).style.filter = '';
	}
}

/**
 * Resets the form to its default state.
 */

function resetForm() {
	document.getElementById('title').value = '';
	document.getElementById('description').value = '';
	document.getElementById('selected-category').innerHTML = 'Select task category';
	document.getElementById('inicial-circles').innerHTML = '';
	document.querySelector('.assigned-to').style.display = 'flex';
	document.querySelector('.assigned-to__list').style.display = 'none';
	removeContactCheckboxes();
	document.getElementById('due-date').value = '';
	resetPrio();
	subTasks = [];
	selectedCategoryName = undefined;
	composeSubTasks(subTasks);
	closeSubtaskEditor();
}

/**
 * Removes the selected contact checkboxes.
 */

function removeContactCheckboxes() {
	const contactCheckboxes = document.querySelectorAll('.contact__checkbox');
	for (let i = 0; i < contactCheckboxes.length; i++) {
		const element = contactCheckboxes[i];
		if (element.checked) {
			element.checked = false;
		}
	}
}

/**
 * Loads the task categories from the backend and displays them in a dropdown menu.
 */

async function loadCategories() {
	// categories = JSON.parse(await getItem('categoriess'));
	let list = document.querySelector('.category-list');
	list.innerHTML = '';
	list.innerHTML += addCategoryHTML();
	for (let i = 0; i < categories.length; i++) {
		let category = categories[i]['name'];
		let color = categories[i]['color'];
		list.innerHTML += categoryHTML(category, color);
	}
}

/**
 * Toggles the display of the category dropdown menu.
 */

function categoryToggler() {
	const categoryList = document.querySelector('.category-list');
	const selectCategory = document.querySelector('.select-task-category');
	if (categoryList.style.display === 'none') {
		categoryList.style.display = 'block';
		selectCategory.style.borderBottom = '0px';
		selectCategory.style.borderRadius = '10px 10px 0px 0px';
	} else {
		categoryList.style.display = 'none';
		resetSelectCategory();
	}
}

/**
 * Closes the category toggler by hiding the category list and resetting the select category element.
 */

function closeCategoryToggler() {
	document.querySelector('.category-list').style.display = 'none';
	resetSelectCategory();
}

/**
 * Handles the creation of a new category.
 */

function newCategoryHandler() {
	document.querySelector('.category-list').style.display = 'none';
	document.querySelector('#select-task-category').style.display = 'none';
	document.querySelector('.new-category').style.display = 'flex';
	document.querySelector('.color-container').style.display = 'flex';
}

/**
 * Cancels the creation of a new category.
 */

function cancelNewCategory() {
	document.querySelector('.new-category').style.display = 'none';
	document.querySelector('.color-container').style.display = 'none';
	document.querySelector('#select-task-category').style.display = 'flex';
}

/**
 * Adds a new category with the provided name and color.
 */

async function addNewCategory() {
	event.preventDefault();
	document.querySelector('.new-category').style.display = 'none';
	document.querySelector('.color-container').style.display = 'none';
	document.querySelector('#select-task-category').style.display = 'flex';
	let selectedColor = null;
	let categoryName = '';
	categoryName = document.querySelector('.new-catgory__input').value;
	for (let i = 0; i < document.querySelectorAll('.color-container input[type="radio"]').length; i++) {
		if (document.querySelectorAll('.color-container input[type="radio"]')[i].checked) {
			selectedColor = document.querySelectorAll('.color-container input[type="radio"]')[i].value;
		}
	}
	const newCategory = {
		name: categoryName,
		color: selectedColor,
	};
	categories.push(newCategory);
	await setItem('categoriess', JSON.stringify(categories));
	loadCategories();
	selectCategory(categoryName, selectedColor)
	clearInputs();
}

/**
 * Clears the input fields and color selection for creating a new category.
 */

function clearInputs() {
	document.querySelector('.new-catgory__input').value = '';
	for (let i = 0; i < document.querySelectorAll('.color-container input[type="radio"]').length; i++) {
		document.querySelectorAll('.color-container input[type="radio"]')[i].checked = false;
	}
}

/**
 * Selects a category and updates the UI to reflect the selected category.
 * @param {string} category - The selected category name.
 * @param {string} color - The selected category color.
 */

function selectCategory(category, color) {
	document.querySelector('#selected-category').innerHTML = selectedCategoryHTML(category, color);
	document.querySelector('.category-list').style.display = 'none';
	selectedCatColor = color;
	selectedCategoryName = category;
	resetSelectCategory();
}

/**
 * Loads the contacts from the backend and displays them as checkboxes.
 */

async function loadContacts() {
    let contactsSingleQuote = await getItem('contacts');
    contacts = JSON.parse(contactsSingleQuote.replace(/'/g, '"'));
    let assignedToList = document.querySelector('.assigned-to__list');
    
    assignedToList.innerHTML = `<li onclick="assignToHandlerInList()" class="assigned-to__list-action">
        <div class="assigned-to__in-list">
            <span>Select contact to assign</span>
            <img src="./src/img/img_add_task/triangle.svg">
        </div>
    </li>`;

    for (let i = 0; i < contacts.length; i++) {
        assignedToList.innerHTML += contactListElementsHTML(contacts, i);
    }
}

/**
 * Toggles the checked state of a checkbox based on its ID.
 * @param {number} i - The index of the checkbox.
 */
function checkbox(i) {
    let checkbox = document.getElementById(`checkbox${i}`);
    checkbox.checked = !checkbox.checked; // toggle the checked state
}

/**
 * Handles the click event to display the list of assigned contacts.
 */
function assignToHandler() {
    document.querySelector('.assigned-to__list').style.display = 'flex';
    document.querySelector('.assigned-to').style.display = 'none';
}

/**
 * Handles the click event when selecting a contact from the assigned contacts list.
 */
function assignToHandlerInList() {
    document.querySelector('.assigned-to__list').style.display = 'none';
    document.querySelector('.assigned-to').style.display = 'flex';
}




/**
 * Adds a new subtask to the task.
 * Validates the input value and adds the subtask to the subTasks array.
 */

function addSubtaskAddTask() {
	const subTaskId = generateRandomId();
	const value = document.querySelector('.subtask__input').value;
	if (value !== '') {
		const subTask = {
			id: subTaskId,
			title: value,
			status: false,
		};
		subTasks.push(subTask);
		composeSubTasks(subTasks);
		document.querySelector('.subtask__actions').style.display = 'none';
		document.querySelector('.subtask__plus').style.display = 'block';
	} else {
		alert("Please enter a subtask");
	}
	document.querySelector('.subtask__input').value = '';
}

/**
 * Opens the subtask editor to add a new subtask.
 * Resets the input value and displays the necessary elements.
 */

function openSubtaskEditor() {
	document.querySelector('.subtask__input').value = '';
	document.querySelector('.subtask__actions').style.display = 'flex';
	document.querySelector('.subtask__plus').style.display = 'none';
}

/**
 * Closes the subtask editor without adding a new subtask.
 * Hides the input field and actions, and shows the plus icon.
 */

function closeSubtaskEditor() {
	document.querySelector('.subtask__actions').style.display = 'none';
	document.querySelector('.subtask__plus').style.display = 'block';
	document.querySelector('.subtask__input').value = '';
}

/**
 * Displays the added subtasks on the webpage.
 * Creates HTML markup for each subtask and updates the subtasks-list element.
 * @param {object[]} subTasks - An array of subtask objects.
 */

function composeSubTasks(subTasks) {
	document.querySelector('.subtasks-list').style.display = 'block';
	document.querySelector('.subtasks-list').innerHTML = '';
	if (subTasks) {
		for (let i = 0; i < subTasks.length; i++) {
			document.querySelector('.subtasks-list').innerHTML += subTaskHTML(subTasks, i);
		}
	} else {
		document.querySelector('.subtasks-list').innerHTML = '';
	}
}

/**
 * Removes a subtask from the subTasks array and updates the displayed subtasks.
 * @param {string} id - The ID of the subtask to be removed.
 */

function removeSubtask(id) {
	const filteredSubtasks = subTasks.filter((sub) => sub.id !== id.toString());
	subTasks = filteredSubtasks;
	composeSubTasks(filteredSubtasks);
}

/**
 * Generates a random ID for a subtask.
 * @returns {string} A random ID as a string.
 */

function generateRandomId() {
	const random = Math.floor(Math.random() * 1000000);
	return random.toString();
}

/**
 * Adds an event listener to submit the subtask on pressing the Enter key.
 */

function submitOnEnter() {
	let input = document.getElementById('subtask-input');
	input.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			addSubtaskAddTask();
		}
	});
}

/**
 * Displays an alert message on the webpage.
 * @param {string} message - The message to be displayed in the alert.
 */

function alertMessage(message) {
	let taskCreatedAlert = document.getElementById('TaskCreatedAlert');
	taskCreatedAlert.innerHTML = message;
	taskCreatedAlert.classList.remove('dNone')
	setTimeout(() => taskCreatedAlert.classList.add('dNone'), 2000);
}

/**
 * Resets the styling of the select task category element.
 * Removes the custom border and border-radius styles.
 */

function resetSelectCategory() {
	document.querySelector('.select-task-category').style.borderBottom = '1px solid #a8a8a8';
	document.querySelector('.select-task-category').style.borderRadius = '10px';
}

/**
 * Sets the minimum value for all elements with the name "due-date" to today's date.
 */

function limitDueDate() {
	let today = new Date().toISOString().split('T')[0];
	for (let i = 0; i < document.getElementsByName("due-date").length; i++) {
		document.getElementsByName("due-date")[i].setAttribute('min', today);
	}
}