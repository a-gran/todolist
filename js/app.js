// Находим элемент для ввода текста новой задачи
let addMessage = document.querySelector('.message')
// Находим кнопку для добавления новой задачи
let addButton = document.querySelector('.add')
// Находим контейнер для отображения списка задач
let todo = document.querySelector('.todo')
// Находим кнопку для удаления задачи
let del = document.querySelector('.delete')
// Создаем массив для хранения задач
let todoList = []
// Проверяем, есть ли сохраненные задачи в localStorage
if (localStorage.getItem('todo')) {
    // Если есть, преобразуем их из JSON-строки в массив и отображаем
    todoList = JSON.parse(localStorage.getItem('todo'))
    displayMessages()
}

// Добавляем обработчик события на кнопку добавления задачи
addButton.addEventListener('click', () => {
    // Если поле ввода пустое, ничего не делаем
    if (!addMessage.value) return

    // Создаем объект новой задачи
    let newTodo = {
        todo: addMessage.value, // Текст задачи
        checked: false,         // Флаг выполнения задачи
        import: false,          // Флаг важности задачи
    }

    // Добавляем новую задачу в массив
    todoList.push(newTodo)
    // Обновляем отображение списка задач
    displayMessages()
    // Сохраняем обновленный список задач в localStorage
    localStorage.setItem('todo', JSON.stringify(todoList))
    // Очищаем поле ввода
    addMessage.value = ''
})

// Функция для отображения списка задач
function displayMessages() {
    let displayMessage = '' // Переменная для хранения HTML-кода

    // Если список задач пуст, очищаем содержимое контейнера
    if (todoList.length === 0) todo.innerHTML = ''

    // Перебираем массив задач и формируем HTML-код для каждой задачи
    todoList.forEach((item, i) => {
        displayMessage += `
            <li>
                <input type='checkbox' id='item_${i}' ${
            item.checked ? 'checked' : '' // Добавляем флаг checked, если задача выполнена
        }>
                <label for='item_${i}' class='${
            item.important ? 'important' : '' // Добавляем класс important, если задача важная
        }'>
                ${item.todo}</label>

                <img class='delete' src='./icons/delete.png' alt='delete'>
            </li>
        `
        // Добавляем сформированный HTML-код в контейнер
        todo.innerHTML = displayMessage
    })
}

// Обработчик события изменения состояния чекбокса задачи
todo.addEventListener('change', (event) => {
    // Получаем текст задачи, связанный с измененным чекбоксом
    let valueLabel = todo.querySelector(
        '[for=' + event.target.getAttribute('id') + ']'
    ).innerHTML

    // Перебираем задачи и обновляем состояние задачи
    todoList.forEach((item) => {
        if (item.todo === valueLabel) {
            item.checked = !item.checked // Инвертируем флаг выполнения
            localStorage.setItem('todo', JSON.stringify(todoList)) // Сохраняем изменения
        }
    })
})

// Обработчик события правого клика на задаче
todo.addEventListener('contextmenu', (event) => {
    event.preventDefault() // Отменяем стандартное контекстное меню

    // Перебираем задачи и ищем задачу, на которую кликнули
    todoList.forEach((item, i) => {
        if (item.todo === event.target.innerHTML) {
            if (event.ctrlKey || event.metaKey) {
                // Если зажата клавиша Ctrl или Command, удаляем задачу
                todoList.splice(i, 1)
            } else {
                // В противном случае переключаем важность задачи
                item.important = !item.important
            }

            // Обновляем отображение списка задач
            displayMessages()
            // Сохраняем изменения в localStorage
            localStorage.setItem('todo', JSON.stringify(todoList))
        }
    })
})

// Обработчик события клика на кнопку удаления задачи
del.addEventListener('click', () => this.delElem.parentElement.remove())
