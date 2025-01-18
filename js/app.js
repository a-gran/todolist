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

// Функция для удаления задач из списка
function delTask() {
    // Находим все кнопки удаления на странице по классу 'delete'
    const deleteButtons = document.querySelectorAll('.delete')    
    // Перебираем каждую найденную кнопку удаления
    deleteButtons.forEach((btn) => {      
        // Добавляем новый обработчик события клика на кнопку
        btn.addEventListener('click', (event) => {
            // Получаем индекс задачи из data-атрибута кнопки
            const index = event.target.dataset.index
            // Удаляем задачу из массива
            todoList.splice(index, 1)
            // Сохраняем обновленный список в localStorage
            localStorage.setItem('todo', JSON.stringify(todoList))
            // Перерисовываем список задач
            displayMessages()
        })
    })
}

// Функция для отметки задачи как важной
function setImportant() {
    // Находим все кнопки важности на странице
    const importantButtons = document.querySelectorAll('.important-btn')    
    // Перебираем каждую кнопку важности
    importantButtons.forEach((btn) => {        
        // Добавляем обработчик клика на новую кнопку
        btn.addEventListener('click', (event) => {
            // Получаем индекс задачи из data-атрибута
            const index = event.target.dataset.index            
            // Инвертируем флаг важности задачи
            todoList[index].important = !todoList[index].important
            // Сохраняем изменения в localStorage
            localStorage.setItem('todo', JSON.stringify(todoList))
            // Обновляем отображение списка
            displayMessages()
        })
    })
}

// Обновленная функция editTask
function editTask() {
    const editButtons = document.querySelectorAll('.edit')    
    
    editButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true)
        btn.parentNode.replaceChild(newBtn, btn)

        newBtn.addEventListener('click', (event) => {
            const index = event.target.dataset.index
            const taskElement = event.target.closest('li')
            const label = taskElement.querySelector('label')
            
            if (taskElement.querySelector('.edit-input')) return
            
            const input = document.createElement('input')
            input.type = 'text'
            input.value = todoList[index].todo
            input.className = 'edit-input'
            
            // Создаем span для хранения текста задачи, если его еще нет
            let textSpan = label.querySelector('.task-text')
            if (!textSpan) {
                // Сохраняем текущий текст
                const currentText = label.textContent.trim()
                // Создаем span
                textSpan = document.createElement('span')
                textSpan.className = 'task-text'
                textSpan.textContent = currentText
                // Заменяем текстовое содержимое label на span
                label.textContent = ''
                label.appendChild(textSpan)
            }
            
            // Скрываем только span с текстом, а не весь label
            textSpan.style.display = 'none'
            // Вставляем input после textSpan
            label.insertBefore(input, textSpan)
            input.focus()
            
            const handleSave = () => {
                const newText = input.value.trim()
                if (newText) {
                    todoList[index].todo = newText
                    textSpan.textContent = newText
                    localStorage.setItem('todo', JSON.stringify(todoList))
                }
                
                // Показываем обратно только span с текстом
                textSpan.style.display = ''
                
                if (input && input.parentNode) {
                    input.remove()
                }
            }

            // input.addEventListener('blur', () => setTimeout(handleSave, 100))
            
            input.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    handleSave()
                }
            })
        })
    })
}

// Функция для обработки чекбоксов (отметки выполнения задач)
function setCheck() {
    // Находим все чекбоксы на странице
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    
    // Перебираем каждый чекбокс
    checkboxes.forEach((checkbox) => {        
        // Добавляем обработчик изменения состояния
        checkbox.addEventListener('change', (event) => {
            // Получаем индекс задачи из id чекбокса
            const index = event.target.id.split('_')[1]            
            // Обновляем состояние выполнения задачи
            todoList[index].checked = event.target.checked
            // Сохраняем изменения в localStorage
            localStorage.setItem('todo', JSON.stringify(todoList))
        })
    })
}

function displayMessages() {
    if (!todoList.length) {
        todo.innerHTML = 'Задач нет'
        return
    }
    
    let displayMessage = '';
    
    todoList.forEach((item, i) => {
        displayMessage += `
        <li class="task">
            <input type='checkbox' id='item_${i}' ${item.checked ? 'checked' : ''}>
            <label for='item_${i}' class='${item.important ? 'important' : ''}'>
                <span class="task-text">${item.todo}</span>
            </label>
            <div class="tools">
                <img class='edit' data-index='${i}' src='./icons/edit.png' alt='edit'>
                <img class='important-btn' data-index='${i}' src='./icons/important.png' alt='important'>
                <img class='delete' data-index='${i}' src='./icons/delete.png' alt='delete'>
            </div>
        </li>
        `;
    });
    
    todo.innerHTML = displayMessage;
    
    delTask()
    setImportant()
    editTask()
    setCheck()
}

// Обработчик события правого клика на задаче
todo.addEventListener('contextmenu', (event) => event.preventDefault()) // Отменяем стандартное контекстное меню

console.log("localStorage.getItem('todo')", localStorage.getItem('todo'))
