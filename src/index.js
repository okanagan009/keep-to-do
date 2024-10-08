const tablinks = document.querySelectorAll('.tablinks');
const tabContent = document.querySelectorAll('.main__section');

const btnAddTask = document.querySelector('.btn-add-task');
const btnAddTask2 = document.querySelector('.btn-add-task--footer');
const controlBtn = document.querySelectorAll('.control-btn');
const blockCreateTask = document.querySelector('.main__task-content');
const blockCompletedTask = document.querySelector('.main__section--completed-task');
const blockTrash = document.querySelector('.main__section--trash');
const modal = document.getElementById('modal');
const modalContent = document.querySelector('.modal-content')
const modalTaskText = document.querySelector('.modal-task-text');
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
let selectedColor = '';
let colors = []; 

const colorBoxes = document.querySelectorAll('.footer__color-box');

colorBoxes.forEach(box => {
    const color = window.getComputedStyle(box).backgroundColor;
    colors.push(color);
});


btnAddTask.addEventListener('click', () => openModalForNewTask(true));
btnAddTask2.addEventListener('click', () => openModalForNewTask(false));

// Функция для открытия модального окна для новой задачи
function openModalForNewTask(hideButton) {
    isNewTask = true;
    modalTaskText.textContent = '';

    if (hideButton || blockCreateTask.children.length === 0) {
        btnAddTask.parentElement.style.display = "none";
    }

    btnAddTask2.classList.add('footer__btn--hidden');
    controlBtn.forEach(btn => btn.classList.remove('footer__btn--hidden'));

    modal.style.display = 'block';
    addFocus()

    // Генерируем случайный цвет и сохраняем его
    selectedColor = colors[Math.floor(Math.random() * colors.length)];
    modalContent.style.backgroundColor = selectedColor;

    document.addEventListener('keydown', handleEscapeKey);
}

// Функция для открытия модального окна при редактировании задачи
function openModal(task) {
    currentTask = task;
    isNewTask = false;
    modalTaskText.textContent = task.textContent;

    const taskColor = window.getComputedStyle(task).backgroundColor; 
    modalContent.style.backgroundColor = taskColor; 

    btnAddTask2.classList.add('footer__btn--hidden');
    controlBtn.forEach(btn => btn.classList.remove('footer__btn--hidden'));

    modal.style.display = 'block';
    addFocus()
    document.addEventListener('keydown', handleEscapeKey);
}

// Закрытие модального окна и сохранение изменений
closeModalBtn.addEventListener('click', closeModal);

function closeModal() {
    modal.style.display = 'none';

    btnAddTask2.classList.remove('footer__btn--hidden');
    controlBtn.forEach(btn => btn.classList.add('footer__btn--hidden'));

    // Проверяем, если задача новая и не пустая
    if (isNewTask && modalTaskText.textContent.trim() !== '') {
        const div = document.createElement('div');
        div.className = 'main__task-text';
        div.setAttribute('contenteditable', 'false');
        div.textContent = modalTaskText.textContent;

        div.style.backgroundColor = selectedColor;

        div.addEventListener('click', () => openModal(div));

        blockCreateTask.appendChild(div);

        // Устанавливаем класс active--start, если задача добавлена
        const activeTab = document.querySelector('.main__section.active--center');
        if (activeTab) {
            activeTab.classList.remove('active--center');
            activeTab.classList.add('active--start');
            blockCreateTask.classList.add('main__task-content--active');
        }
    } else if (currentTask) {
        // Если редактируем задачу
        currentTask.textContent = modalTaskText.textContent;
    } else if (blockCreateTask.children.length === 0) {
        // Если новая задача пустая и это первая задача
        const activeTab = document.querySelector('.main__section.active--start');
        if (activeTab) {
            activeTab.classList.remove('active--start');
            activeTab.classList.add('active--center');
        }
        // Возвращаем кнопку
        btnAddTask.parentElement.style.display = "flex";
    }

    currentTask = null;

    document.removeEventListener('keydown', handleEscapeKey);
}

// добавить фокус
function addFocus() {
    if (modalTaskText.textContent.length === 0) {
        // Если текста нет, устанавливаем фокус на элемент
        modalTaskText.focus();
    }
}


// Закрытие модального окна при клике вне его
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Закрытие модального окна при нажатии esc 
function handleEscapeKey(event) {
    if (event.code === 'Escape') {
        closeModal();
    }
}


// открытие/закрытие панели выбора цвета для задач
const btnPaint = document.querySelector('.footer__btn--paint');
const colorPanel = document.querySelector('.footer__color-choice');

if (btnPaint && colorPanel) {
    btnPaint.addEventListener('click', toggleColorPanel);

    function toggleColorPanel() {
        colorPanel.classList.toggle('footer__color-choice--active');
        btnPaint.classList.toggle('footer__btn--paint-no-hover');
    }
}
// если модальное окно и редактирование задачи открыто, то кнопка добавить новую задачу в футере скрыта.
// если модальное окно закрыто, то кнопки назад вперед и выбор квета скрыты.

// сделать футер выше модального окна что бы кнопки работали. 
// создать кнопки закрытия для задач и перенос этих задач в новый отдел таба.
// создать счетчик задач на боковой панели.



