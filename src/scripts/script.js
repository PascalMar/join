/**
 * Includes HTML content from external files.
 * @returns {Promise} - A promise that resolves when the HTML content has been included.
 */
async function includeHTML() {
    return new Promise(async function (resolve) {
        let includeElements = document.querySelectorAll('[w3-include-html]');
        for (let i = 0; i < includeElements.length; i++) {
            const element = includeElements[i];
            file = element.getAttribute("w3-include-html"); // "includes/header.html"
            let resp = await fetch(file);
            if (resp.ok) {
                element.innerHTML = await resp.text();
            } else {
                element.innerHTML = 'Page not found';
            }
            // Need this to initialize event listeners after addTaskContainer Template was rendered to HTML 
            if (i === includeElements.length - 1) {
                try {
                    initAddTasks();
                } catch (error) {
                }
                resolve();
            }
        }
    });
}

/**
 * Opens the logout menu and adds event listeners for closing the menu.
 */
function openLogout() {
    document.getElementById('legalNoticeMobile').classList.remove('dNone');
    document.getElementById('logoutMobile').classList.remove('dNone');
    document.getElementById('logout').classList.remove('dNone');
    setTimeout(() => document.addEventListener('click', checkLogout), 0);
}

/**
 * Displays the legal notice for mobile view.
 */
function legalNoticeMobile() {
    document.getElementById('');
}

/**
 * Closes the logout menu and removes event listeners for closing the menu.
 */
function closeLogout() {
    document.getElementById('legalNoticeMobile').classList.add('dNone');
    document.getElementById('logoutMobile').classList.add('dNone');
    document.getElementById('logout').classList.add('dNone');
    document.removeEventListener('click', checkLogout);
}

/**
 * Checks if the click event target is outside the logout menu and closes the menu if necessary.
 * @param {Event} event - The click event.
 */
function checkLogout(event) {
    if (event.target.id !== 'logout', 'logoutMobile', 'legalNoticeMobile') closeLogout();
}

/**
 * Logs out the user and redirects to the login page.
 */
function logout() {
    window.location.href = 'index.html';
}

/**
 * Adds the 'activeLink' class to the specified menu item, defaulting to 'impressumLink' if no ID is provided.
 * @param {string} id - The ID of the menu item.
 */
function addActiveToMenu(id) {
    if (id == undefined) id = 'impressumLink';
    if (id.includes('Link')) {
        let active = document.getElementById(id);
        active.classList.add('activeLink');
    }
    if (id.includes('mobile')) {
        let active = document.getElementById(id);
        active.classList.add('activeLinkMobil');
    }
}

/**
 * Generates the logo for the logged-in user based on their username.
 */
function generateLoggedinUserLogo() {
    getUserNameFromLocalStorage();
    let logoContainer = document.getElementById('guestLogin');
    if (userName.toLowerCase() === 'guest') {
        logoContainer.classList.add('guestUserLogo');
    } else {
        let nameWithoutUmlauts = deUmlaut(userName);
        let loggedinUser = nameWithoutUmlauts.match(/\b\w/g).join('').toUpperCase();
        logoContainer.classList.add('loggedinUserLogo');
        logoContainer.innerHTML = `<div>${loggedinUser}</div>`;
    }
}

/**
 * Removes umlauts from a given value.
 * @param {string} value - The value to remove umlauts from.
 * @returns {string} - The value without umlauts.
 */
function deUmlaut(value) {
    value = value.toLowerCase();
    value = value.replace(/ä/g, 'ae');
    value = value.replace(/ö/g, 'oe');
    value = value.replace(/ü/g, 'ue');
    return value;
}

/**
 * Saves the user's name in local storage.
 */
function saveUserNameInLocalStorage() {
    let userNameAsString = JSON.stringify(userName);
    localStorage.setItem('userName', userNameAsString);
}

/**
 * Retrieves the user's name from the local storage.
 */
function getUserNameFromLocalStorage() {
    let userNameAsString = localStorage.getItem('userName');
    userName = JSON.parse(userNameAsString);
}

/**
 * Initializes the impressum page by adding the 'activeLink' class to the menu item and generating the logged-in user logo.
 */
function initImpressum() {
    addActiveToMenu();
    generateLoggedinUserLogo();
}