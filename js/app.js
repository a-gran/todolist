let addMessage = document.querySelector('.message') // Находим элемент для ввода новой задачи
let addButton = document.querySelector('.add') // Находим кнопку "Добавить"
let todo = document.querySelector('.todo') // Находим список задач
let todoList = [] // Создаем массив, где будем хранить все задачи

// Если в localStorage уже есть сохраненные задачи, подгружаем их
if (localStorage.getItem('todo')) {    
    todoList = JSON.parse(localStorage.getItem('todo')) // Преобразуем строку в объект (массив задач)    
    displayMessages() // Отображаем задачи на экране
}

// При клике на кнопку "Добавить" создаем новую задачу
addButton.addEventListener('click', () => {    
    if (!addMessage.value) return // Если поле ввода пустое, выходим из функции
    // Формируем объект новой задачи
    let newTodo = {        
        todo: addMessage.value, // Текст задачи        
        checked: false, // Флаг выполнения (изначально false)        
        important: false // Флаг важности (исправили import -> important)
    }
    
    todoList.push(newTodo) // Добавляем новую задачу в общий массив    
    localStorage.setItem('todo', JSON.stringify(todoList)) // Сохраняем массив в localStorage (превращаем в строку JSON)    
    displayMessages() // Вызываем функцию, которая отрисует задачи заново    
    addMessage.value = '' // Очищаем поле ввода
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
function setImportant() {
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

// Обновленная функция обработки редактирования
function editTask() {
    const editButtons = document.querySelectorAll('.edit')
    editButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const index = event.target.dataset.index
            const taskElement = event.target.closest('li')
            const textarea = taskElement.querySelector('.task-textarea')
            const taskDisplay = taskElement.querySelector('.task-display')
            
            textarea.style.display = 'block'
            taskDisplay.style.display = 'none'
            
            // Устанавливаем значение и фокус
            textarea.value = todoList[index].todo
            textarea.focus()
            
            // Устанавливаем высоту textarea в зависимости от содержимого
            textarea.style.height = 'auto'
            textarea.style.height = textarea.scrollHeight + 'px'
        })
    })
}

function handleTaskInputs() {
    const textareas = document.querySelectorAll('.task-textarea')
    textareas.forEach(textarea => {
        // Обработчик изменения размера textarea
        textarea.addEventListener('input', function() {
            this.style.height = 'auto'
            this.style.height = this.scrollHeight + 'px'
        })

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                const index = textarea.dataset.index
                const newText = textarea.value.trim()
                if (newText) {
                    todoList[index].todo = newText
                    localStorage.setItem('todo', JSON.stringify(todoList))
                    displayMessages()
                }
            }
        })

        textarea.addEventListener('blur', () => {
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

            <div class="tools">
                <img class='edit' data-index='${i}' src='./icons/edit.png' alt='edit'>
                <img class='important-btn' data-index='${i}' src='./icons/important.png' alt='important'>
                <img class='delete' data-index='${i}' src='./icons/delete.png' alt='delete'>
            </div>
        </li>
        `
    })
    
    todo.innerHTML = displayMessage // Записываем весь сформированный HTML в элемент .todo    
    delTask() // Включаем обработчики удаления для вновь созданных кнопок    
    setImportant() // Включаем обработчики переключения важности
    editTask() // Добавляем обработчики для кнопок редактирования
    handleTaskInputs() // Добавляем обработчики для чекбоксов и текстовых полей
}

// Обработчик события правого клика на задаче
todo.addEventListener('contextmenu', (event) => event.preventDefault()) // Отменяем стандартное контекстное меню

// const todoListCons = JSON.parse(localStorage.getItem('todo'))
// console.log(localStorage.getItem('todo'))
// console.log(todoListCons)
