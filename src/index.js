const tablinks = document.querySelectorAll('.tablinks');
const tabContent = document.querySelectorAll('.main__section');

const btnAddTask = document.querySelector('.btn-add-task');
const btnAddTask2 = document.querySelector('.btn-add-task--footer');
const blockCreateTask = document.querySelector('.main__task-content');
const blockCompletedTask = document.querySelector('.main__section--completed-task');
const blockTrash = document.querySelector('.main__section--trash');
const modal = document.getElementById('modal');
const modalTaskText = document.getElementById('modal-task-text');
const closeModalBtn = document.querySelector('.close');

// ---------- tab ---------
tablinks.forEach(element => {
    element.addEventListener('click', openTab)
});

function openTab(event) {
    for (const item of tablinks) {
        item.classList.remove('tablinks-active');
    }

    for (const item of tabContent) {
        item.classList.remove('active--center', 'active--start');
    }

    event.currentTarget.classList.add('tablinks-active');

    const tabName = event.currentTarget.getAttribute('data-target');
    const tabElement = document.getElementById(tabName);

    if (tabElement.querySelector('.main__task-content .main__task-text')) {
        tabElement.classList.add('active--start');
    } else {
        tabElement.classList.add('active--center');
    }
}


// -------------- modal -------------
let currentTask = null; 
let isNewTask = false; 

btnAddTask.addEventListener('click', () => openModalForNewTask(true));
btnAddTask2.addEventListener('click', () => openModalForNewTask(false));

// Функция для открытия модального окна для новой задачи
function openModalForNewTask(hideButton) {
    isNewTask = true; 
    modalTaskText.textContent = ''; 

    if (hideButton || blockCreateTask.children.length === 0) {
        btnAddTask.parentElement.style.display = "none";
    }

    modal.style.display = 'block';
}

// Функция для открытия модального окна при редактировании задачи
function openModal(task) {
    currentTask = task;
    isNewTask = false;
    modalTaskText.textContent = task.textContent;
    modal.style.display = 'block';
}

// Закрытие модального окна и сохранение изменений
closeModalBtn.addEventListener('click', closeModal);

function closeModal() {
    modal.style.display = 'none';

    if (isNewTask) {
        const div = document.createElement('div');
        div.className = 'main__task-text';
        div.setAttribute('contenteditable', 'false');
        div.textContent = modalTaskText.textContent;

        div.addEventListener('click', () => openModal(div));

        blockCreateTask.appendChild(div);
    } else if (currentTask) {
        currentTask.textContent = modalTaskText.textContent;
    }

    currentTask = null;

    const activeTab = document.querySelector('.main__section.active--center');
    if (activeTab) {
        activeTab.classList.remove('active--center');
        activeTab.classList.add('active--start');
    }
}

// Закрытие модального окна при клике вне его
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});