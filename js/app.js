let addMessage = document.querySelector('.message') // Находим элемент для ввода новой задачи
let addButton = document.querySelector('.add') // Находим кнопку "Добавить"
let todo = document.querySelector('.todo') // Находим список задач
let todoList = [] // Создаем массив, где будем хранить все задачи

// Если в localStorage уже есть сохраненные задачи, подгружаем их
if (localStorage.getItem('todo')) {    
    todoList = JSON.parse(localStorage.getItem('todo')) // Преобразуем строку в объект (массив задач)    
    displayMessages() // Отображаем задачи на экране
}

function setTask() {
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
}

addButton.addEventListener('click', () => setTask()) // При клике на кнопку "Добавить" создаем новую задачу

addMessage.addEventListener('keyup', (event) => { // При нажатии на клавишу "Enter" создаем новую задачу
    if (event.key === 'Enter') {
        event.preventDefault() // Отмена стандартного поведения при нажатии на клавишу "Enter"
        setTask()
    }
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

// Функция для обработки редактирования задачи
function editTask() {
    // Находим все кнопки редактирования на странице
    const editButtons = document.querySelectorAll('.edit')    
    // Добавляем обработчик для каждой кнопки редактирования
    editButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            
            const index = event.target.dataset.index // Получаем индекс текущей задачи из data-атрибута       
            
            const taskElement = event.target.closest('li') // Находим родительский элемент li для текущей задачи           
            
            const label = taskElement.querySelector('label') // Находим label элемент, содержащий текст задачи           
            // Создаем input для редактирования
            const input = document.createElement('input')
            input.type = 'text'
            input.value = todoList[index].todo
            input.className = 'edit-input'

            // Временно скрываем label и показываем input
            label.style.display = 'none'
            taskElement.insertBefore(input, label)
            input.focus()

            // Обработчик для сохранения изменений при потере фокуса
            input.addEventListener('blur', () => saveChanges(input, label, index))

            // Обработчик для сохранения изменений при нажатии Enter
            input.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    saveChanges(input, label, index)
                }
            })
        })
    })
}

// Вспомогательная функция для сохранения изменений
function saveChanges(input, label, index) {   
    const newText = input.value.trim()  // Получаем новый текст задачи
    
    // Проверяем, что текст не пустой
    if (newText) {        
        todoList[index].todo = newText // Обновляем текст в массиве задач        
        label.textContent = newText // Обновляем текст в label        
        localStorage.setItem('todo', JSON.stringify(todoList)) // Сохраняем изменения в localStorage
    }    
    
    label.style.display = '' // Показываем label обратно    
    input.remove() // Удаляем поле ввода
}

// Добавьте эту функцию после displayMessages()
function setCheckboxHandler() {
    // Находим все чекбоксы
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    
    // Добавляем обработчик для каждого чекбокса
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            // Получаем индекс задачи из id чекбокса (item_1 -> 1)
            const index = event.target.id.split('_')[1]
            
            // Обновляем состояние в массиве задач
            todoList[index].checked = event.target.checked
            
            // Сохраняем обновленный массив в localStorage
            localStorage.setItem('todo', JSON.stringify(todoList))
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
    setCheckboxHandler() // Добавляем вызов новой функции
}

// Обработчик события правого клика на задаче
todo.addEventListener('contextmenu', (event) => event.preventDefault()) // Отменяем стандартное контекстное меню

const todoListCons = JSON.parse(localStorage.getItem('todo'))
console.log("localStorage.getItem('todo')", localStorage.getItem('todo'))
console.log('todoListCons', todoListCons)
