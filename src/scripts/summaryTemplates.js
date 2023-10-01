/**
 * Generates the HTML template for the summary section.
 */
function generateSummaryTemplate() {
    let content = document.getElementById('summaryContent');

    content.innerHTML = /*html*/`
        <div class="task-container" onclick="goToBoard()">
            <div class="task-container-2">
                <div class="task-progress"><span id="summaryTaskInBoard" class="task-number-container"></span> 
                    <span class="task-text-container"> Task in Board</span>
                </div>
                <div class="task-progress"><span id="summaryTaskInProgress" class="task-number-container"></span> 
                    <span class="task-text-container"> Tasks in Progress</span>
                </div>
                    <div class="task-progress"><span id="summaryTaskInAwaitingFeedback" class="task-number-container"></span> 
                        <span class="task-text-container"> Awaiting Feedback</span>
            </div>
        </div>


        <div class="task-Deadline-Container">

            <div class="task-Deadline-Info">
                <img src="./src/img/redCircle.png" alt="redCirlce">
                <div class="deadline-text">
                    <p id="summaryUrgentCount"></p> Urgent
                </div>
            </div>
            <div class="gray-line"></div>
            <div class="deadline-container">
                <span class="date" id="summaryDate"></span>
                <span class="upcoming-Deadline"><p> Upcoming Deadline</p></span>
            </div>
        </div>

        <div class="to-do-done-container">
            <div class="to-do-done-container2">
                <div class="to-do-done"> <img src="./src/img/to-do.png" alt="">
                    <span class="to-do-done-text">
                        <p id="summarytoDo"></p>To-do
                    </span>
                </div>
                <div class="to-do-done"><img src="./src/img/done.png" alt="">
                    <span class="to-do-done-text">
                        <p id="summarytoDoDone"></p>Done
                    </span>
                </div>
            </div>
        </div>
    </div>
 `;
}

/**
 * Creates HTML for displaying the tasks amount.
 * @param {number} number - The number of tasks.
 * @returns {string} - The HTML string representing the tasks amount.
 */
function createHtmlforTasksAmount(number) {
    return `
        <p>${number}</p>
    `;
}