// Определение всех необходимых элементов на странице
const tablinks = document.querySelectorAll('.tablinks'); // Вкладки
const tabContent = document.querySelectorAll('.main__section'); // Секции контента
const btnAddTask = document.querySelector('.btn-add-task'); // Кнопка добавления задачи в основной области
const btnAddTask2 = document.querySelector('.btn-add-task--footer'); // Кнопка добавления задачи в нижнем колонтитуле
const controlBtn = document.querySelectorAll('.control-btn'); // Кнопки управления в нижнем колонтитуле
const blockCreateTask = document.querySelector('.main__task-content'); // Блок создания задач
const blockCompletedTask = document.querySelector('.main__section--completed-task'); // Блок завершённых задач
const blockTrash = document.querySelector('.main__section--trash'); // Блок корзины
const modal = document.getElementById('modal'); // Модальное окно
const modalContent = document.querySelector('.modal-content'); // Контент модального окна
const modalTaskText = document.querySelector('.modal-task-text'); // Текст задачи в модальном окне
const closeModalBtn = document.querySelector('.close'); // Кнопка закрытия модального окна


// ------------------- tab (Обработка вкладок)-------------------
// Добавляем обработчики клика для всех вкладок
tablinks.forEach(element => {
    element.addEventListener('click', openTab);
});

// Функция открытия выбранной вкладки
function openTab(event) {
    // Убираем активное состояние со всех вкладок
    for (const item of tablinks) {
        item.classList.remove('tablinks-active');
    }

    // Скрываем все секции контента
    for (const item of tabContent) {
        item.classList.remove('active--center', 'active--start');
    }

    // Устанавливаем активное состояние для текущей вкладки
    event.currentTarget.classList.add('tablinks-active');

    // Получаем имя вкладки из атрибута data-target
    const tabName = event.currentTarget.getAttribute('data-target');
    const tabElement = document.getElementById(tabName);

    // Определяем позиционирование секции в зависимости от наличия задач
    if (tabElement.querySelector('.main__task-content .main__task-text')) {
        tabElement.classList.add('active--start');
    } else {
        tabElement.classList.add('active--center');
    }

    // Скрываем кнопку в нижнем колонтитуле, если вкладка не "Создать"
    if (tabName !== 'create-task') {
        btnAddTask2.style.display = 'none';
    } else {
        checkBtnVisibility(); // Проверяем видимость кнопки для вкладки "Создать"
    }
}
//------------------------------------------------------


// ---------------- Проверка видимости кнопки ----------------
// Функция для проверки, должна ли кнопка добавления задачи быть видимой
function checkBtnVisibility() {
    if (blockCreateTask.children.length > 0) {
        btnAddTask2.style.display = 'block';
    } else {
        btnAddTask2.style.display = 'none';
    }
}
// --------------------------------------------------------------------------------


// ---------------- Обновление счётчиков задач ----------------
// Определяем элементы счётчиков для разделов
const createTaskCount = document.querySelector('.button-navigation__count--create');
const completedTaskCount = document.querySelector('.button-navigation__count--completed');
const trashTaskCount = document.querySelector('.button-navigation__count--trash');

// Функция для обновления количества задач в каждом разделе
function updateTaskCounts() {
    createTaskCount.textContent = blockCreateTask.children.length; // Обновляем для "Создать"
    completedTaskCount.textContent = blockCompletedTask.querySelector('.main__task-content').children.length; // "Завершено"
    trashTaskCount.textContent = blockTrash.querySelector('.main__task-content').children.length; // "Корзина"
}
//------------------------------------------------------


// -------------- Menu Open/Close Button --------------
// Определяем элементы меню
const menuBtn = document.querySelector('.navigation__btn.btn');
const body = document.querySelector('.body');
const navigation = document.querySelector('.navigation');
const buttonNavigationWrapper = document.querySelectorAll('.button-navigation__wrapper');

// Обработчик клика для открытия/закрытия меню
menuBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
    const isMenuHidden = body.classList.contains('hidden-menu');
    body.classList.toggle('hidden-menu', !isMenuHidden);
    navigation.classList.toggle('hidden-menu');
    buttonNavigationWrapper.forEach(item => item.classList.toggle('hidden-menu', !isMenuHidden));
}

// Обработка медиа-запросов для автоматического скрытия меню на малых экранах
const mediaQuery = window.matchMedia("(max-width: 800px)");

function handleMediaQueryChange(e) {
    if (e.matches) {
        // При ширине меньше или равной 800px скрываем меню
        body.classList.add('hidden-menu');
        navigation.classList.remove('hidden-menu');
        buttonNavigationWrapper.forEach(item => item.classList.add('hidden-menu'));
    } else {
        // При ширине больше 800px возвращаем стандартное состояние
        body.classList.remove('hidden-menu');
        navigation.classList.remove('hidden-menu');
        buttonNavigationWrapper.forEach(item => item.classList.remove('hidden-menu'));
    }
}

// Проверяем начальное состояние
handleMediaQueryChange(mediaQuery);

// Добавляем слушатель на изменение размеров экрана
mediaQuery.addEventListener("change", handleMediaQueryChange);
// ----------------------------------------------------


// -------------- modal -------------
let currentTask = null; // Текущая редактируемая задача
let isNewTask = false; // Флаг, обозначающий создание новой задачи
let selectedColor = ''; // Выбранный цвет задачи
let colors = []; // Массив доступных цветов
let isColorSelectedManually = false; // Флаг, показывающий, выбран ли цвет вручную

// Получаем все элементы с классом footer__color-box
const colorBoxes = document.querySelectorAll('.footer__color-box');

// Заполняем массив colors цветами из элементов colorBoxes
colorBoxes.forEach(box => {
    const color = window.getComputedStyle(box).backgroundColor;
    colors.push(color);
});


// Добавляем обработчики кликов на кнопки "Добавить задачу"
btnAddTask.addEventListener('click', () => openModalForNewTask(true)); // При клике открываем модалку и скрываем кнопку
btnAddTask2.addEventListener('click', () => openModalForNewTask(false)); // При клике открываем модалку без скрытия кнопки

// Функция для генерации уникального ID для каждой задачи
function generateUniqueId() {
    return `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`; // Генерация ID на основе текущего времени и случайного числа
}

// Функция открытия модального окна для новой задачи
function openModalForNewTask(hideButton) {
    isNewTask = true; // Устанавливаем флаг, что создаётся новая задача
    modalTaskText.textContent = ''; // Очищаем текст модального окна

    // Генерируем уникальный ID для новой задачи и сохраняем историю
    const newTaskId = generateUniqueId();
    setTaskHistory(newTaskId);

    // Скрываем кнопку добавления задачи, если передан флаг hideButton или задач нет
    if (hideButton || blockCreateTask.children.length === 0) {
        btnAddTask.parentElement.style.display = "none";
    }

    // Скрываем вторую кнопку добавления задачи и показываем управляющие кнопки
    btnAddTask2.classList.add('footer__btn--hidden');
    controlBtn.forEach(btn => btn.classList.remove('footer__btn--hidden'));

    modal.style.display = 'block'; // Показываем модальное окно
    addFocus(); // Фокусируемся на модальном окне

    // Если цвет не был выбран вручную, выбираем случайный цвет
    if (!selectedColor) {
        selectedColor = colors[Math.floor(Math.random() * colors.length)];
    }
    modalContent.style.backgroundColor = selectedColor; // Устанавливаем цвет модального окна

    isColorSelectedManually = false; // Сбрасываем флаг выбора цвета вручную

    document.addEventListener('keydown', handleEscapeKey); // Добавляем обработчик нажатия клавиши Esc
}

// Функция для открытия модального окна при редактировании задачи
function openModal(task) {
    currentTask = task; // Устанавливаем текущую редактируемую задачу
    isNewTask = false; // Сбрасываем флаг новой задачи
    modalTaskText.textContent = task.textContent; // Загружаем текст задачи в модалку

    const taskColor = window.getComputedStyle(task).backgroundColor; // Получаем цвет задачи
    modalContent.style.backgroundColor = taskColor; // Устанавливаем цвет модального окна

    setTaskHistory(task); // Сохраняем историю задачи

    btnAddTask2.classList.add('footer__btn--hidden'); // Скрываем вторую кнопку добавления задачи
    controlBtn.forEach(btn => btn.classList.remove('footer__btn--hidden')); // Показываем управляющие кнопки

    modal.style.display = 'block'; // Показываем модальное окно
    addFocus(); // Фокусируемся на модальном окне
    document.addEventListener('keydown', handleEscapeKey); // Добавляем обработчик нажатия клавиши Esc
}

// Закрытие модального окна и сохранение изменений
closeModalBtn.addEventListener('click', closeModal);

// Функция закрытия модального окна и обработка сохранений изменений
function closeModal() {
    modal.style.display = 'none'; // Скрываем модальное окно

    btnAddTask2.classList.remove('footer__btn--hidden'); // Показываем вторую кнопку добавления задачи
    controlBtn.forEach(btn => btn.classList.add('footer__btn--hidden')); // Скрываем управляющие кнопки

    // Если создаётся новая задача и текст модалки не пустой
    if (isNewTask && modalTaskText.textContent.trim() !== '') {
        const taskDiv = document.createElement('div'); // Создаём div для новой задачи
        taskDiv.className = 'main__task-text'; // Устанавливаем класс задачи
        taskDiv.setAttribute('contenteditable', 'false'); // Запрещаем редактирование текста
        taskDiv.textContent = modalTaskText.textContent; // Устанавливаем текст задачи
        taskDiv.style.backgroundColor = selectedColor || colors[Math.floor(Math.random() * colors.length)]; // Устанавливаем цвет задачи

        // Добавляем событие для открытия модалки при клике на задачу
        taskDiv.addEventListener('click', () => openModal(taskDiv));

        const closeDiv = document.createElement('div'); // Создаём кнопку закрытия задачи
        closeDiv.className = 'main__task-close';
        closeDiv.addEventListener('click', (event) => {
            event.stopPropagation(); // Предотвращаем открытие модалки при клике на закрытие
            handleCloseTask(taskDiv); // Закрываем задачу
        });

        taskDiv.appendChild(closeDiv); // Добавляем кнопку закрытия в задачу
        blockCreateTask.appendChild(taskDiv); // Добавляем задачу в блок создания

        const activeTab = document.querySelector('.main__section.active--center'); // Ищем активный раздел
        if (activeTab) {
            activeTab.classList.remove('active--center');
            activeTab.classList.add('active--start'); // Меняем класс раздела
            blockCreateTask.classList.add('main__task-content--active'); // Активируем блок задач
        }

        updateTaskCounts(); // Обновляем счётчики задач
        checkBtnVisibility(); // Проверяем видимость кнопок
    } else if (currentTask) {
        currentTask.textContent = modalTaskText.textContent; // Обновляем текст редактируемой задачи
        currentTask.style.backgroundColor = selectedColor || currentTask.style.backgroundColor; // Обновляем цвет задачи

        if (!currentTask.querySelector('.main__task-close')) {
            const closeDiv = document.createElement('div'); // Добавляем кнопку закрытия, если её нет
            closeDiv.className = 'main__task-close';
            closeDiv.addEventListener('click', (event) => {
                event.stopPropagation(); // Предотвращаем открытие модалки
                handleCloseTask(currentTask); // Закрываем задачу
            });
            currentTask.appendChild(closeDiv); // Добавляем кнопку в задачу
        }
    } else if (blockCreateTask.children.length === 0) {
        const activeTab = document.querySelector('.main__section.active--start'); // Проверяем, активен ли раздел
        if (activeTab) {
            activeTab.classList.remove('active--start');
            activeTab.classList.add('active--center'); // Меняем класс раздела
        }
        btnAddTask.parentElement.style.display = "flex"; // Возвращаем кнопку
        btnAddTask2.style.display = 'none'; // Скрываем вторую кнопку
    }

    selectedColor = ''; // Сбрасываем выбранный цвет
    document.removeEventListener('keydown', handleEscapeKey); // Удаляем обработчик клавиши Esc
}
// ---------------------------------------------------------------------------


//------- Установка истории задачи----------
function setTaskHistory(taskId) {
    // Обновляем текущий идентификатор задачи
    currentTaskId = taskId;

    // Проверяем, существует ли история для данной задачи в taskHistory
    // Если нет, создаем новую историю с пустыми массивами для отмены и повторения
    if (!taskHistory.has(taskId)) {
        taskHistory.set(taskId, { undo: [], redo: [] });
    }

    // Получаем текущие стеки отмены и повторения для задачи из taskHistory
    const { undo, redo } = taskHistory.get(taskId);

    // Обновляем текущие стеки отмены и повторения
    currentUndoStack = undo;
    currentRedoStack = redo;

    // Обновляем состояния кнопок в интерфейсе на основе новой истории задачи
    updateButtonStates();
}
//--------------------------------------


//--- Сохранение состояния задачи-----
function saveStateForCurrentTask() {
    currentUndoStack.push(modalTaskText.innerHTML); // Добавляет текущее содержимое задачи в стек отмены (`currentUndoStack`).
    currentRedoStack = []; // Очищает стек повторений (`currentRedoStack`), так как сохраняемое состояние не может быть использовано для повторения.

    // Обновляет историю задачи с новым состоянием, включающим текущее содержимое стека отмены (`undo`) и очищенный стек повторений (`redo`).
    taskHistory.set(currentTaskId, {
        undo: [...currentUndoStack],
        redo: [...currentRedoStack],
    });

    // Обновляет состояние кнопок на основе нового состояния задачи.
    updateButtonStates();
}
//--------------------------------------


// --------- Пренести в другой раздел, удалить созданную задачу. --------------
function handleCloseTask(taskDiv) {
    // Определяем текущий раздел задачи и целевой блок для перемещения
    const parentSection = taskDiv.closest('.main__section');
    let targetContent;

    if (parentSection.classList.contains('main__section--create-task')) {  // Если задача находится в разделе "создать", перемещаем её в раздел "завершенные задачи".
        targetContent = blockCompletedTask.querySelector('.main__task-content');
        targetContent.appendChild(taskDiv);
    } else if (parentSection.classList.contains('main__section--completed-task')) { // Если задача находится в разделе "завершенные задачи", перемещаем её в раздел "корзина"
        targetContent = blockTrash.querySelector('.main__task-content');
        targetContent.appendChild(taskDiv);
    } else if (parentSection.classList.contains('main__section--trash')) {  // Если задача находится в разделе "корзина", удаляем её.
        taskDiv.remove();
    }

    // Снимаем выделение текста
    window.getSelection().removeAllRanges();

    // Обновляем классы и видимость блоков для текущего и целевого контента
    [parentSection.querySelector('.main__task-content'), targetContent].forEach(updateContentVisibility);

    // Переключаем классы для main__section, если нет задач
    updateSectionClass(parentSection);

    // Устанавливаем display для main__btn-box, если нет задач в main__section--create-task
    updateBtnBoxVisibility();

    // Обновляем счётчики
    updateTaskCounts();

    // Показать кнопку, если есть хотя бы одна задача в разделе "создать"
    checkBtnVisibility();
}

// Функция обновления видимости контента
function updateContentVisibility(content) {
    if (content) {
        const isEmpty = content.children.length === 0;
        content.classList.toggle('main__task-content--active', !isEmpty);

        let relatedContent;

        if (content.closest('.main__section--completed-task')) { // Если `content` находится в разделе "завершенные задачи", находим связанный блок с `.main__completed-content`
            relatedContent = document.querySelector('.main__completed-content');
        } else if (content.closest('.main__section--trash')) {  // Если `content` находится в разделе "корзина", находим связанный блок с `.main__trash-content`.
            relatedContent = document.querySelector('.main__trash-content');
        }

        if (relatedContent) { // Обновляем видимость relatedContent в зависимости от того, пустой ли content
            relatedContent.style.display = isEmpty ? 'block' : 'none';
        }
    }
}

// Функция для переключения классов у main__section при отсутствии задач
function updateSectionClass(section) {
    const isEmpty = section.querySelector('.main__task-content').children.length === 0;
    section.classList.toggle('active--start', !isEmpty);
    section.classList.toggle('active--center', isEmpty);
}

// Функция управления видимостью main__btn-box
function updateBtnBoxVisibility() {
    const btnBox = document.querySelector('.main__btn-box');
    btnBox.style.display = blockCreateTask.children.length === 0 ? 'flex' : 'none';
}

// -----------------------------------------------------


// ---------- добавить фокус -----------------
function addFocus() {
    if (modalTaskText.textContent.length === 0) {
        // Если текста нет, устанавливаем фокус на элемент
        modalTaskText.focus();
    }
}
// --------------------------------------------


// ---------------- нижняя панель управление в Footer -------------------
// Находим кнопку для выбора цвета и панель выбора цвета
const btnPaint = document.querySelector('.footer__btn--paint');
const colorPanel = document.querySelector('.footer__color-choice');

// Проверяем, что оба элемента найдены в DOM
if (btnPaint && colorPanel) {
    btnPaint.addEventListener('click', toggleColorPanel); // Добавляем обработчик клика на кнопку выбора цвета

    // Функция для переключения состояния панели выбора цвета
    function toggleColorPanel() {
        colorPanel.classList.toggle('footer__color-choice--active');// Переключаем класс активности для панели выбора цвета
        btnPaint.classList.toggle('footer__btn--paint-no-hover');// Переключаем класс, чтобы отключить эффект hover на кнопке выбора цвета
    }
}
// ---------------------------------------------------------------------


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
// ---------------------------------------------------------------------


// ------  Закрытие модального окна и/или панели выбора цвета ----------
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
// ------------------------------------------------------------------------


//---------- Выбор фонового цвета для модального окна -----------------------------
const colorButtons = document.querySelectorAll('.footer__btn-color'); // Находим все кнопки выбора цвета на панели

// Для каждой кнопки добавляем обработчик клика
colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Устанавливаем выбранный цвет из атрибута `data-color` кнопки
        selectedColor = button.getAttribute('data-color');

        // Изменяем фон модального содержимого на выбранный цвет
        modalContent.style.backgroundColor = selectedColor;

        // Устанавливаем флаг, что цвет был выбран вручную
        isColorSelectedManually = true;
    });
});
// ---------------------------------------------------------------------------------


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

// Функция для обновления состояния кнопок undo/redo
function updateButtonStates() {
    undoBtn.disabled = currentUndoStack.length === 0; // Отключить кнопку "undo" при отсутствии состояния
    redoBtn.disabled = currentRedoStack.length === 0;  // Отключить кнопку "redo" при отсутствии состояния
}

// Обработчик клика для кнопки "undo" (шаг назад)
undoBtn.addEventListener('click', () => {
    if (currentUndoStack.length > 0) {
        const lastState = currentUndoStack.pop(); // Извлекаем последнее состояние из стека undo
        currentRedoStack.push(modalTaskText.innerHTML); // Добавляем текущее состояние в стек redo
        modalTaskText.innerHTML = lastState; // Восстанавливаем предыдущее состояние текста задачи

        // Обновляем историю в map
        taskHistory.set(currentTaskId, {
            undo: [...currentUndoStack],
            redo: [...currentRedoStack],
        });

        updateButtonStates(); // Обновляем состояние кнопок
    }
});

// Обработчик клика для кнопки "redo" (шаг вперед)
redoBtn.addEventListener('click', () => {
    if (currentRedoStack.length > 0) {
        const nextState = currentRedoStack.pop(); // Извлекаем следующее состояние из стека redo
        currentUndoStack.push(modalTaskText.innerHTML); // Добавляем текущее состояние в стек undo
        modalTaskText.innerHTML = nextState; // Восстанавливаем следующее состояние текста задачи

        // Обновляем историю в map
        taskHistory.set(currentTaskId, {
            undo: [...currentUndoStack],
            redo: [...currentRedoStack],
        });

        updateButtonStates(); // Обновляем состояние кнопок
    }
});
// -----------------------------------------------------------------------------------




