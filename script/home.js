let username = localStorage.getItem('Logged_in_user');
    let name = document.getElementById('name');

    if (username) {
    name.innerHTML = `Welcome back, ${username}`;
  }  else {
    name.innerHTML = 'Welcome back, guest!';
  }
    // get todos from localStorage
    function getTodos() {
      const todos = localStorage.getItem("todos");
      return todos ? JSON.parse(todos) : [];
    }

    // save todos to localStorage
    function saveTodos(todos) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }

    // Render todos in the grid
    function renderTodos() {
      const todoContainer = document.querySelector(".todo-container");
      todoContainer.innerHTML = ""; 

      const todos = getTodos();
      todos.forEach((todo) => {
        const todoItem = document.createElement("div");
        todoItem.className = "todo-item";
        todoItem.dataset.id = todo.id;

        if (todo.completed) {
          todoItem.classList.add("completed");
        }

        todoItem.innerHTML = `
          <div class="icon" onclick="toggleDropdown(this)">
            <i class="fa-solid fa-ellipsis-vertical"></i>
            <div class="dropdown-menu">
              <a href="#" onclick="editTodoPrompt('${todo.id}')">Edit</a>
              <a href="#" onclick="deleteTodoPrompt('${todo.id}')">Delete</a>
            </div>
          </div>
          <div class = "centralise">
            <h1>${todo.title}</h1>
          <p>${todo.description}</p>
          <div>
            <input type="checkbox" ${
              todo.completed ? "checked" : ""
            } onclick="toggleCompletion('${todo.id}', this)" />
          </div>
          </div>
        `;

        todoContainer.appendChild(todoItem);
      });
    }

    // Toggle todo completion status
    function toggleCompletion(id, checkbox) {
      const todos = getTodos();
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        todo.completed = checkbox.checked;
        saveTodos(todos);
        renderTodos(); // Refresh the todos list to update the style
      }
    }

    // Toggle dropdown menu visibility
    function toggleDropdown(iconElement) {
      const dropdown = iconElement.querySelector(".dropdown-menu");
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    }

    // Add new todo
    document.querySelector(".btn-add-todo").addEventListener("click", function(){
      document.getElementById("todoModal").style.display = "flex";
      document.getElementById("todoForm").dataset.action = "add"; // Set action to 'add'
      document.getElementById("todoForm").reset(); // Reset form fields
      document.getElementById("modalTitle").textContent = "Add Todo"; // Set modal title
    });

    document.getElementById("modalClose").addEventListener("click", () => {
      document.getElementById("todoModal").style.display = "none";
    });

    document.getElementById("todoForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const title = form.querySelector("#todoTitle").value;
      const description = form.querySelector("#todoText").value;
      const action = form.dataset.action;

      let todos = getTodos();
      if (action === "add") {
        const newTodo = {
          id: Date.now().toString(), // Unique ID for each todo
          title,
          description,
          completed: false,
        };
        todos.push(newTodo);
      } else if (action === "edit") {
        const todoId = form.dataset.editId;
        const todo = todos.find((t) => t.id === todoId);
        if (todo) {
          todo.title = title;
          todo.description = description;
        }
      }

      saveTodos(todos);
      document.getElementById("todoModal").style.display = "none";
      renderTodos(); // Refresh the todos list
    });

    // Edit existing todo
    function editTodoPrompt(id) {
      const todos = getTodos();
      const todo = todos.find((t) => t.id === id);

      if (todo) {
        document.getElementById("todoTitle").value = todo.title;
        document.getElementById("todoText").value = todo.description;

        // Set form action to edit and store the ID to be edited
        const form = document.getElementById("todoForm");
        form.dataset.action = "edit";
        form.dataset.editId = id;

        document.getElementById("todoModal").style.display = "flex";
        document.getElementById("modalTitle").textContent = "Edit Todo"; // Set modal title
      }
    }

    // Delete todo
    function deleteTodoPrompt(id) {
      if (confirm("Are you sure you want to delete this todo?")) {
        let todos = getTodos();
        todos = todos.filter((t) => t.id !== id);
        saveTodos(todos);
        renderTodos(); // Refresh the todos list
      }
    }

    // Close dropdown when clicking outside of it
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dropdown-menu") && !e.target.closest(".icon")) {
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.style.display = "none";
        });
      }
    });

    // Initial render of todos
    renderTodos();