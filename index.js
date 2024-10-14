let todos = JSON.parse(localStorage.getItem('todos')) || [];

const modal = document.getElementById('todoModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display == "none";
  };
});

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
  const newTodo = {
    title: document.getElementById('new-todo-title').value,
    task: document.getElementById('new-todo').value,
    date: document.getElementById('new-todo-date').value,
    priority: document.querySelector('input[name="priority-level"]:checked') ? document.querySelector('input[name="priority-level"]:checked').value : null,
  };

  if (newTodo.title || newTodo.task || newTodo.date) {
    const todo = {
      id: uuid.v4(),
      title: newTodo.title,
      task: newTodo.task,
      date: newTodo.date,
      priority: newTodo.priority,
      completed: false,
    };

    todos.unshift(todo);
    saveTodos();
    renderTodos();
    closeModal();
  } else {
    closeModal();
  }
}

function deleteTodo(id) {
  const todoItem = document.getElementById(`todo-${id}`);
  todoItem.style.animation = 'fade-out-shrink 0.5s ease-out';

  setTimeout(() => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
  }, 500);
}

function toggleTodo(id) {
  const todo = todos.find(todo => todo.id === id);

  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  };
}

function editTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  const todoItem = document.getElementById(`todo-${id}`);

  todoItem.innerHTML = `
    <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo('${id}')" disabled>
    <input type="text" class="edit-title" value="${todo.title}">
    <input type="text" class="edit-task" value="${todo.task}">
    <input type="date" class="edit-date" value="${todo.date}">
    <select class="edit-priority">
      <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
      <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
      <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
    </select>
    <button class="action-btn save-btn" onclick="saveTodo('${id}')">Save</button>
    <button class="action-btn" onclick="cancelEdit('${id}')">Cancel</button>
  `;
}

function saveTodo(id) {
  const todoItem = document.getElementById(`todo-${id}`);
  const updatedTodo = {
    title: todoItem.querySelector('.edit-title').value.trim(),
    task: todoItem.querySelector('.edit-task').value.trim(),
    date: todoItem.querySelector('.edit-date').value,
    priority: todoItem.querySelector('.edit-priority').value,
  };

  if (updatedTodo.title || updatedTodo.task || updatedTodo.date) {
    const todo = todos.find(todo => todo.id === id);
    todo.title = updatedTodo.title;
    todo.task = updatedTodo.task;
    todo.date = updatedTodo.date;
    todo.priority = updatedTodo.priority;
    saveTodos();
    renderTodos();
  }
}

function cancelEdit(id) {
  renderTodos();
}

function renderTodos() {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';

  todos.forEach(todo => {
    const todoDiv = document.createElement('div');
    todoDiv.id = `todo-${todo.id}`;
    todoDiv.className = 'todo-item';
    todoDiv.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo('${todo.id}')">
      <div class="todo-content">
        <span class="todo-title">${todo.title}</span>
        <span class="todo-task">${todo.task}</span>
        <span class="todo-date">${todo.date}</span>
        <span class="todo-priority">Priority: ${todo.priority}</span>
      </div>
      <button class="action-btn" onclick="editTodo('${todo.id}')">Edit</button>
      <button class="action-btn delete-btn" onclick="deleteTodo('${todo.id}')">Delete</button>
    `;
    list.appendChild(todoDiv);
  });
}


document.getElementById('new-todo').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    addTodo();
  }
});

document.getElementById('new-todo-date').value = new Date().toISOString().split('T')[0];

renderTodos();