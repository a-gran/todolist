// Находим элемент для ввода новой задачи
let addMessage = document.querySelector('.message')
// Находим кнопку 'Добавить'
let addButton = document.querySelector('.add')
// Находим список задач
let todo = document.querySelector('.todo')
// Создаем массив, где будем хранить все задачи
let todoList = []

// Если в localStorage уже есть сохраненные задачи, подгружаем их
if (localStorage.getItem('todo')) {
    // Преобразуем строку в объект (массив задач)
    todoList = JSON.parse(localStorage.getItem('todo'))
    // Отображаем задачи на экране
    displayMessages()
}

// При клике на кнопку 'Добавить' создаем новую задачу
addButton.addEventListener('click', () => {
    // Если поле ввода пустое, выходим из функции
    if (!addMessage.value) return

    // Формируем объект новой задачи
    let newTodo = {
        // Текст задачи
        todo: addMessage.value,
        // Флаг выполнения (изначально false)
        checked: false,
        // Флаг важности (исправили import -> important)
        important: false
    }

    // Добавляем новую задачу в общий массив
    todoList.push(newTodo)
    // Сохраняем массив в localStorage (превращаем в строку JSON)
    localStorage.setItem('todo', JSON.stringify(todoList))
    // Вызываем функцию, которая отрисует задачи заново
    displayMessages()
    // Очищаем поле ввода
    addMessage.value = ''
})

// Функция для удаления задачи
function delTask() {
    // Находим все кнопки с классом 'delete'
    const deleteButtons = document.querySelectorAll('.delete')
    // Пробегаемся по всем кнопкам
    deleteButtons.forEach((btn) => {
        // Вешаем обработчик клика на каждую кнопку
        btn.addEventListener('click', (event) => {
        // Получаем индекс задачи из data-атрибута
        const index = event.target.dataset.index
        // Удаляем задачу из массива по индексу
        todoList.splice(index, 1)
        // Сохраняем обновленный массив в localStorage
        localStorage.setItem('todo', JSON.stringify(todoList))
        // Перерисовываем список задач
        displayMessages()
        })
    })
}

// Функция для переключения флага важности задачи
function addImportant() {
    // Находим все кнопки с классом 'important'
    const importantButtons = document.querySelectorAll('.important-btn')
    // Пробегаемся по этим кнопкам
    importantButtons.forEach((btn) => {
        // Вешаем обработчик клика
        btn.addEventListener('click', (event) => {
        // Получаем индекс задачи
        const index = event.target.dataset.index
        // Переключаем флаг important у задачи
        todoList[index].important = !todoList[index].important
        // Сохраняем обновленный массив в localStorage
        localStorage.setItem('todo', JSON.stringify(todoList))
        // Перерисовываем список, чтобы отобразить изменения
        displayMessages()
        })
    })
}

// Функция для отображения всех задач
function displayMessages() {
    // Если массив задач пуст, показываем сообщение 'Задач нет'
    if (!todoList.length) {
        todo.innerHTML = 'Задач нет'
        return
    }

    // Строка, в которую соберем HTML со всеми задачами
    let displayMessage = ''
    // Перебираем все объекты задач из массива todoList
    todoList.forEach((item, i) => {
        // Формируем HTML-разметку для каждой задачи
        displayMessage += `
        <li>
            <input type='checkbox' id='item_${i}' ${item.checked ? 'checked' : ''}>

            <label for='item_${i}' class='${item.important ? 'important' : ''}'>
                ${item.todo}
            </label>

            <div>
                <img class='important-btn' data-index='${i}' src='./icons/important.png' alt='important'>
                <img class='delete' data-index='${i}' src='./icons/delete.png' alt='delete'>
            </div>
        </li>
        `
    })

    // Записываем весь сформированный HTML в элемент .todo
    todo.innerHTML = displayMessage
    // Включаем обработчики удаления для вновь созданных кнопок
    delTask()
    // Включаем обработчики переключения важности
    addImportant()
}

// Отслеживаем изменения чекбокса (выполнена задача или нет)
// todo.addEventListener('change', event => {
//     // Находим привязанный к чекбоксу label
//     let label = todo.querySelector('[for=' + event.target.id + ']')
//     // Перебираем все задачи в массиве
//     todoList.forEach(item => {
//         // Ищем ту задачу, чей текст совпадает с содержимым label
//         if (item.todo === label.innerHTML) {
//         // Переключаем флаг checked
//         item.checked = !item.checked
//         // Сохраняем изменения в localStorage
//         localStorage.setItem('todo', JSON.stringify(todoList))
//         }
//     })
// })

// Обработчик события правого клика на задаче
todo.addEventListener('contextmenu', (event) => event.preventDefault()) // Отменяем стандартное контекстное меню

// const todoListCons = JSON.parse(localStorage.getItem('todo'))
// console.log(localStorage.getItem('todo'))
// console.log(todoListCons)
