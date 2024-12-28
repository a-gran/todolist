let addMessage = document.querySelector('.message')
let addButton = document.querySelector('.add')
let todo = document.querySelector('.todo')
let todoList = []

if (localStorage.getItem('todo')) {    
    todoList = JSON.parse(localStorage.getItem('todo'))    
    displayMessages()
}

addButton.addEventListener('click', () => {    
    if (!addMessage.value) return
    let newTodo = {        
        todo: addMessage.value,        
        checked: false,        
        important: false,
        isEditing: false
    }
    
    todoList.push(newTodo)    
    localStorage.setItem('todo', JSON.stringify(todoList))    
    displayMessages()    
    addMessage.value = ''
})

function delTask() {
    const deleteButtons = document.querySelectorAll('.delete')
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const index = event.target.dataset.index
            todoList.splice(index, 1)
            localStorage.setItem('todo', JSON.stringify(todoList))
            displayMessages()
        })
    })
}

function addImportant() {
    const importantButtons = document.querySelectorAll('.make-important')
    importantButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const index = event.target.dataset.index
            todoList[index].important = !todoList[index].important
            localStorage.setItem('todo', JSON.stringify(todoList))
            displayMessages()
        })
    })
}

function handleEdit() {
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

function displayMessages() {
    if (!todoList.length) {
        todo.innerHTML = 'Задач нет'
        return
    }

    let displayMessage = ''
    todoList.forEach((item, i) => {
        displayMessage += `
        <li>
            <div class="task-content">
                <input type="checkbox" id="item_${i}" ${item.checked ? 'checked' : ''}>
                <label for="item_${i}" class="checkbox-label"></label>
                <span class="task-display ${item.important ? 'important' : ''}">${item.todo}</span>
                <textarea class="task-textarea" data-index="${i}" style="display: none;">${item.todo}</textarea>
            </div>
            <div class="task-actions">
                <button class="edit" data-index="${i}">✎</button>
                <button class="make-important" data-index="${i}">Важная</button>
                <img class="delete" data-index="${i}" src="./icons/delete.png" alt="delete">
            </div>
        </li>
        `
    })

    todo.innerHTML = displayMessage
    delTask()
    addImportant()
    handleEdit()
    handleTaskInputs()
}

todo.addEventListener('change', event => {
    if (event.target.type === 'checkbox') {
        const index = event.target.id.split('_')[1]
        todoList[index].checked = event.target.checked
        localStorage.setItem('todo', JSON.stringify(todoList))
    }
})

todo.addEventListener('contextmenu', (event) => event.preventDefault())