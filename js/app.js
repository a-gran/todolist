let addMessage = document.querySelector('.message')
let addButton = document.querySelector('.add')
let todo = document.querySelector('.todo')
let del = document.querySelector('.delete')

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
        import: false,
    }

    todoList.push(newTodo)
    displayMessages()
    localStorage.setItem('todo', JSON.stringify(todoList))
    addMessage.value = ''
})

function displayMessages() {
    let displayMessage = ''

    if (todoList.length === 0) todo.innerHTML = ''

    todoList.forEach((item, i) => {
        displayMessage += `
            <li>
                <input type='checkbox' id='item_${i}' ${
            item.checked ? 'checked' : ''
        }>
                <label for='item_${i}' class='${
            item.important ? 'important' : false
        }'>
                ${item.todo}</label>

                <img class='delete' src='../icons/delete.png' alt='delete'>
            </li>
        `
        todo.innerHTML = displayMessage
    })
}


