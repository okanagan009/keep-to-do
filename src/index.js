const tablinks = document.querySelectorAll('.tablinks');
const tabContent = document.querySelectorAll('.main__section');

const btnAddTask = document.querySelector('.btn-add-task');
const btnAddTask2 = document.querySelector('.btn-add-task--footer');
const controlBtn = document.querySelectorAll('.control-btn');
const blockCreateTask = document.querySelector('.main__task-content');
const blockCompletedTask = document.querySelector('.main__section--completed-task');
const blockTrash = document.querySelector('.main__section--trash');
const modal = document.getElementById('modal');
const modalContent = document.querySelector('.modal-content');
const modalTaskText = document.querySelector('.modal-task-text');
const closeModalBtn = document.querySelector('.close');

// ---------- tab ---------
tablinks.forEach(element => {
    element.addEventListener('click', openTab);
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
let isColorSelectedManually = false;

const colorBoxes = document.querySelectorAll('.footer__color-box');

colorBoxes.forEach(box => {
    const color = window.getComputedStyle(box).backgroundColor;
    colors.push(color);
});


btnAddTask.addEventListener('click', () => openModalForNewTask(true));
btnAddTask2.addEventListener('click', () => openModalForNewTask(false));

// Функция для генерации уникального ID для каждой задачи
function generateUniqueId() {
    return `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Функция открытия модального окна для новой задачи
function openModalForNewTask(hideButton) {
    isNewTask = true;
    modalTaskText.textContent = '';

    // Генерируем уникальный ID для новой задачи и устанавливаем историю
    const newTaskId = generateUniqueId();
    setTaskHistory(newTaskId);

    if (hideButton || blockCreateTask.children.length === 0) {
        btnAddTask.parentElement.style.display = "none";
    }

    btnAddTask2.classList.add('footer__btn--hidden');
    controlBtn.forEach(btn => btn.classList.remove('footer__btn--hidden'));

    modal.style.display = 'block';
    addFocus();

    // Если цвет не был выбран вручную, генерируем случайный цвет
    if (!selectedColor) {
        selectedColor = colors[Math.floor(Math.random() * colors.length)];
    }
    modalContent.style.backgroundColor = selectedColor;

    // Сброс флага при открытии модального окна, чтобы для новых задач цвет генерировался случайно
    isColorSelectedManually = false;

    document.addEventListener('keydown', handleEscapeKey);
}


// Установка истории задачи
function setTaskHistory(taskId) {
    currentTaskId = taskId;

    if (!taskHistory.has(taskId)) {
        taskHistory.set(taskId, { undo: [], redo: [] });
    }

    const { undo, redo } = taskHistory.get(taskId);
    currentUndoStack = undo;
    currentRedoStack = redo;

    updateButtonStates();
}

// Сохранение состояния задачи
function saveStateForCurrentTask() {
    currentUndoStack.push(modalTaskText.innerHTML);
    currentRedoStack = [];

    taskHistory.set(currentTaskId, {
        undo: [...currentUndoStack],
        redo: [...currentRedoStack],
    });

    updateButtonStates();
}

// Функция для открытия модального окна при редактировании задачи
function openModal(task) {
    currentTask = task;
    isNewTask = false;
    modalTaskText.textContent = task.textContent;

    const taskColor = window.getComputedStyle(task).backgroundColor;
    modalContent.style.backgroundColor = taskColor;

    setTaskHistory(task);

    btnAddTask2.classList.add('footer__btn--hidden');
    controlBtn.forEach(btn => btn.classList.remove('footer__btn--hidden'));

    modal.style.display = 'block';
    addFocus();
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
        currentTask.style.backgroundColor = selectedColor;
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

    selectedColor = '';

    document.removeEventListener('keydown', handleEscapeKey);
}

// добавить фокус
function addFocus() {
    if (modalTaskText.textContent.length === 0) {
        // Если текста нет, устанавливаем фокус на элемент
        modalTaskText.focus();
    }
}


const btnPaint = document.querySelector('.footer__btn--paint');
const colorPanel = document.querySelector('.footer__color-choice');

if (btnPaint && colorPanel) {
    btnPaint.addEventListener('click', toggleColorPanel);

    function toggleColorPanel() {
        // Переключаем классы для панели и кнопки
        colorPanel.classList.toggle('footer__color-choice--active');
        btnPaint.classList.toggle('footer__btn--paint-no-hover');
    }
}


// Закрытие модального окна и панели цвета при нажатии esc
function handleEscapeKey(event) {
    if (event.code === 'Escape') {
        // Сначала закрываем панель выбора цвета, если она открыта
        if (colorPanel.classList.contains('footer__color-choice--active')) {
            toggleColorPanel();
        }
        // Если панель выбора цвета закрыта, проверяем модальное окно
        else if (modal.style.display === 'block') {
            closeModal();
        }
    }
}

// Закрытие модального окна и/или панели выбора цвета
window.addEventListener('click', (event) => {
    const isClickInsidePaintButton = btnPaint.contains(event.target);
    const isClickInsideColorPanel = colorPanel.contains(event.target);

    if (colorPanel.classList.contains('footer__color-choice--active')) {
        // Закрываем панель, если клик был вне панели и кнопки
        if (!isClickInsideColorPanel && !isClickInsidePaintButton) {
            toggleColorPanel();
        }
    } else {
        // Закрываем модальное окно, если клик был вне него
        if (event.target === modal) {
            closeModal();
        }
    }
});



// Выбор фонового цвета для модального окна
const colorButtons = document.querySelectorAll('.footer__btn-color');

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedColor = button.getAttribute('data-color');
        modalContent.style.backgroundColor = selectedColor;
        isColorSelectedManually = true;
    });
});


// ---- шаг вперед, шаг назад для текста задачи. реализацией undo/redo механизма. ----

const undoBtn = document.querySelector('.undo');
const redoBtn = document.querySelector('.redo');

let taskHistory = new Map(); // Храним историю undo/redo для каждой задачи (ключ: id задачи)
let currentTaskId = 'new-task';

let currentUndoStack = [];
let currentRedoStack = [];

// Функция сброса undo/redo для новой задачи
function resetHistory() {
    currentUndoStack = [];
    currentRedoStack = [];
    updateButtonStates(); // Обновляем состояние кнопок
}

// Сохранение состояния при вводе пробела или Enter
modalTaskText.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
        saveStateForCurrentTask();
    }
});

// Обновление состояния кнопок undo/redo
function updateButtonStates() {
    undoBtn.disabled = currentUndoStack.length === 0;
    redoBtn.disabled = currentRedoStack.length === 0;
}

// Undo (шаг назад)
undoBtn.addEventListener('click', () => {
    if (currentUndoStack.length > 0) {
        const lastState = currentUndoStack.pop();
        currentRedoStack.push(modalTaskText.innerHTML);
        modalTaskText.innerHTML = lastState;

        // Обновляем историю в map
        taskHistory.set(currentTaskId, {
            undo: [...currentUndoStack],
            redo: [...currentRedoStack],
        });

        updateButtonStates();
    }
});

// Redo (шаг вперед)
redoBtn.addEventListener('click', () => {
    if (currentRedoStack.length > 0) {
        const nextState = currentRedoStack.pop();
        currentUndoStack.push(modalTaskText.innerHTML);
        modalTaskText.innerHTML = nextState;

        // Обновляем историю в map
        taskHistory.set(currentTaskId, {
            undo: [...currentUndoStack],
            redo: [...currentRedoStack],
        });

        updateButtonStates();
    }
});


// для кнопок вперед и назад добавить активность состояний

// для созданных задач при наведении сделать появляется кнопка которая может закрывать эту задачу и переносить
// в завершенное, корзина

// создать счетчик задач на боковой панели.
// при нажатии на кнопку меню, боковая панель складывается

// уменьшить иконки в header
// создать поиск по задачам, по одинаковым словам

// добавить легкую анимацию.
// добавить анимированую загрузку в начале 

// баги
// при нажатии на созданную задачу и после ее закрытия проподает цвет фона.  
// для каждой задачи должен undo/redo должен быть свой, сейчас он общий и в новых задачах можно дойти до слов из прошлых задач.




