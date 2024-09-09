// ---------- tab ---------
const tablinks = document.querySelectorAll('.tablinks');
const tabContent = document.querySelectorAll('.main__section');

tablinks.forEach(element => {
    element.addEventListener('click', openTab)
});

function openTab(event) {
    for (const item of tablinks) {
        item.classList.remove('tablinks-active');
    }

    event.currentTarget.classList.add('tablinks-active');

    for (const item of tabContent) {
        item.classList.remove('active');
    }

    const tabName = event.currentTarget.getAttribute('data-target');
    document.getElementById(tabName).classList.add('active');
}


// -------------- add-task -------------
const btnAddTask = document.querySelector('.btn-add-task');
const blockCreateTask = document.querySelector('.main__task-content');
const blockCompletedTask = document.querySelector('.main__section--completed-task');
const blockTrash = document.querySelector('.main__section--trash');

btnAddTask.addEventListener('click', addTask)

function addTask() {
    btnAddTask.parentElement.style.display = "none";

    const div = document.createElement('div');
    div.className = 'main__task-text';
    div.setAttribute('contenteditable', 'true');

    blockCreateTask.appendChild(div);
}
