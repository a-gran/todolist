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
    const deleteButtons = document.querySelectorAll('.delete');
    
    // Перебираем каждую найденную кнопку удаления
    deleteButtons.forEach((btn) => {
        // Создаем новую копию кнопки, чтобы избежать проблем с множественными обработчиками
        const newBtn = btn.cloneNode(true)
        // Заменяем старую кнопку на новую, удаляя все старые обработчики событий
        btn.parentNode.replaceChild(newBtn, btn)
        
        // Добавляем новый обработчик события клика на кнопку
        newBtn.addEventListener('click', (event) => {
            // Получаем индекс задачи из data-атрибута кнопки
            const index = event.target.dataset.index
            
            // Проверяем существует ли задача с таким индексом
            if (todoList[index] !== undefined) {
                // Удаляем задачу из массива
                todoList.splice(index, 1)
                // Сохраняем обновленный список в localStorage
                localStorage.setItem('todo', JSON.stringify(todoList))
                // Перерисовываем список задач
                displayMessages()
            }
        })
    })
}

// Функция для отметки задачи как важной
function setImportant() {
    // Находим все кнопки важности на странице
    const importantButtons = document.querySelectorAll('.important-btn')
    
    // Перебираем каждую кнопку важности
    importantButtons.forEach((btn) => {
        // Создаем новую копию кнопки без обработчиков
        const newBtn = btn.cloneNode(true)
        // Заменяем старую кнопку на новую
        btn.parentNode.replaceChild(newBtn, btn)
        
        // Добавляем обработчик клика на новую кнопку
        newBtn.addEventListener('click', (event) => {
            // Получаем индекс задачи из data-атрибута
            const index = event.target.dataset.index
            
            // Проверяем существование задачи перед изменением
            if (todoList[index] !== undefined) {
                // Инвертируем флаг важности задачи
                todoList[index].important = !todoList[index].important
                // Сохраняем изменения в localStorage
                localStorage.setItem('todo', JSON.stringify(todoList))
                // Обновляем отображение списка
                displayMessages();
            }
        })
    })
}

// Функция для редактирования существующей задачи
function editTask() {
    // Получаем все кнопки редактирования со страницы
    const editButtons = document.querySelectorAll('.edit');
    
    // Перебираем каждую кнопку редактирования
    editButtons.forEach(btn => {
        // Создаем новую копию кнопки без старых обработчиков
        const newBtn = btn.cloneNode(true)
        // Заменяем старую кнопку на новую
        btn.parentNode.replaceChild(newBtn, btn)
        
        // Добавляем обработчик клика на новую кнопку
        newBtn.addEventListener('click', (event) => {
            // Получаем индекс задачи из data-атрибута
            const index = event.target.dataset.index
            // Находим элемент списка, содержащий задачу
            const taskElement = event.target.closest('li')
            // Находим элемент label с текстом задачи
            const label = taskElement.querySelector('label')
            
            // Проверяем, не редактируется ли уже эта задача
            // Если уже редактируется, прерываем выполнение
            if (taskElement.querySelector('.edit-input')) return
            
            // Создаем поле ввода для редактирования
            const input = document.createElement('input');
            // Устанавливаем тип поля ввода как текстовый
            input.type = 'text'
            // Копируем текущий текст задачи в поле ввода
            input.value = todoList[index].todo
            // Добавляем класс для стилизации
            input.className = 'edit-input'
            
            // Вставляем поле ввода перед текстом задачи
            taskElement.insertBefore(input, label)
            // Скрываем текст задачи
            label.style.display = 'none'
            // Устанавливаем фокус на поле ввода
            input.focus()
            
            // Функция для сохранения изменений
            const handleSave = () => {
                // Получаем новый текст и удаляем пробелы
                const newText = input.value.trim()
                // Проверяем, что текст не пустой и label существует
                if (newText && label) {
                    // Обновляем текст задачи в массиве
                    todoList[index].todo = newText
                    // Обновляем текст в интерфейсе
                    label.textContent = newText
                    // Сохраняем изменения в localStorage
                    localStorage.setItem('todo', JSON.stringify(todoList))
                }
                
                // Проверяем существование label перед изменением
                // Показываем текст задачи обратно
                if (label && label.parentNode) label.style.display = ''                     
                
                // Проверяем существование поля ввода перед удалением
                if (input && input.parentNode) input.remove() // Удаляем поле ввода                
            }
            
            // Добавляем обработчик потери фокуса
            // Добавляем задержку для обработки Enter
            input.addEventListener('blur', () => setTimeout(handleSave, 100))
            
            // Добавляем обработчик нажатия клавиш
            input.addEventListener('keyup', (event) => {
                // Если нажат Enter, сохраняем изменения
                if (event.key === 'Enter') {
                    handleSave()
                }
            })
        })
    })
}

// Функция для обработки чекбоксов (отметки выполнения задач)
function setCheckboxHandler() {
    // Находим все чекбоксы на странице
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Перебираем каждый чекбокс
    checkboxes.forEach((checkbox) => {
        // Создаем новую копию чекбокса
        const newCheckbox = checkbox.cloneNode(true);
        // Заменяем старый чекбокс на новый
        checkbox.parentNode.replaceChild(newCheckbox, checkbox);
        
        // Добавляем обработчик изменения состояния
        newCheckbox.addEventListener('change', (event) => {
            // Получаем индекс задачи из id чекбокса
            const index = event.target.id.split('_')[1];
            
            // Проверяем существование задачи
            if (todoList[index] !== undefined) {
                // Обновляем состояние выполнения задачи
                todoList[index].checked = event.target.checked;
                // Сохраняем изменения в localStorage
                localStorage.setItem('todo', JSON.stringify(todoList));
            }
        });
    });
}

// Функция для отображения списка задач
function displayMessages() {
    // Если список задач пуст, показываем сообщение
    if (!todoList.length) {
        todo.innerHTML = 'Задач нет';
        return;
    }
    
    // Строка для хранения HTML-разметки списка задач
    let displayMessage = '';
    
    // Перебираем все задачи и формируем HTML
    todoList.forEach((item, i) => {
        displayMessage += `
        <li>
            <!-- Чекбокс для отметки выполнения -->
            <input type='checkbox' id='item_${i}' ${item.checked ? 'checked' : ''}>
            <!-- Текст задачи -->
            <label for='item_${i}' class='${item.important ? 'important' : ''}'>
                ${item.todo}
            </label>
            <!-- Кнопки управления -->
            <div class="tools">
                <img class='edit' data-index='${i}' src='./icons/edit.png' alt='edit'>
                <img class='important-btn' data-index='${i}' src='./icons/important.png' alt='important'>
                <img class='delete' data-index='${i}' src='./icons/delete.png' alt='delete'>
            </div>
        </li>
        `;
    });
    
    // Обновляем содержимое списка на странице
    todo.innerHTML = displayMessage;
    
    // Инициализируем все обработчики событий
    delTask()
    setImportant()
    editTask()
    setCheckboxHandler()
}

// Обработчик события правого клика на задаче
todo.addEventListener('contextmenu', (event) => event.preventDefault()) // Отменяем стандартное контекстное меню

const todoListCons = JSON.parse(localStorage.getItem('todo'))
console.log("localStorage.getItem('todo')", localStorage.getItem('todo'))
console.log('todoListCons', todoListCons)
