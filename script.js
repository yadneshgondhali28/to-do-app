let form = document.getElementById("form"); //form element
let input = document.getElementById("input"); // input element
const button = document.querySelector(".add-btn");
let msg = document.querySelector(".msg"); // error msg element
let taskContainer = document.getElementById("task-container"); // task container element

let editIndex = null;
let deleteTimeouts = {};

// creating data array
let data = getLocalStorageData() || [];

// Adding event listener on form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
})

// validating form
let formValidation = () => {
  if (input.value === "") {
    showNotification("Task field cannot be empty", "error");
  } else {
    if (editIndex !== null) {
      updateTask();
      resetForm();
      button.innerText = "Add Task";
    } else {
      console.log("success");
      msg.innerHTML = "";
      acceptData();
    }
  }
};

function showNotification(message, type, notify = true) {
  if (notify === true) {
    msg.innerHTML = message;
    msg.classList.add(type);
    setTimeout(() => {
      msg.innerHTML = "";
      msg.type = "";
      msg.classList.remove(type)
    }, 3000);
  }
}

// add data to local storage
function addDataToLocalStorage(data) {
  try {
    localStorage.setItem("todo", JSON.stringify(data));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error("Storage limit exceeded", error);
      showNotification("Storage limit exceeded", "error");
    } else if (error.name === 'SecurityError') {
      console.error("Local storage is disabled or unavailable", error);
      showNotification("Local storage is disabled or unavailable", "error");
    } else {
      console.error("Error writing to local storage", error);
      showNotification("Error Saving task to local storage", "error");
    }
  }
}

// get data from local storage
function getLocalStorageData() {
  try {
    return JSON.parse(localStorage.getItem("todo"));
  } catch (error) {
    if (error.name === 'SyntaxError') {
      console.error("Error parsing JSON from local storage", error);
      showNotification("Error parsing data from local storage", "error");
    } else if (error.name === 'SecurityError') {
      console.error("Local storage is disabled or unavailable", error);
      showNotification("Local storage is disabled or unavailable", "error");
    } else {
      console.error("Error reading from local storage", error);
      showNotification("Error reading data from local storage", "error");
    }
    return [];
  }
}


// accepting data
let acceptData = () => {
  data.push({
    text: input.value
  });
  addDataToLocalStorage(data);
  createTasks();
  resetForm();
  showNotification("Task has been created successfully.", "success");
};

// creating tasks
let createTasks = () => {
  taskContainer.innerHTML = "";
  data.forEach((x, y) => {
    return (taskContainer.innerHTML += `
      <article class="tasks" id=${y}>
        <div class="task-txt">
          <input type="checkbox" class="task-checkbox" data-index="${y}" />
          <p>${x.text}</p>
        </div>
        <span class="icon-options">
          <i class="fa-solid fa-pen-to-square edit-icon" data-index="${y}"></i>
          <i class="fa-solid fa-trash delete-icon" data-index="${y}"></i>
        </span>
      </article>
  `);
  })

  // Adding event listeners to checkboxes
  const checkboxes = document.querySelectorAll('.task-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckboxChange);
  });

  // Adding event listeners to edit icons
  const editIcons = document.querySelectorAll(".edit-icon");
  editIcons.forEach(editIcon => {
    editIcon.addEventListener("click", editTask);
  })
  // Adding event listeners to delete icons
  const deleteIcons = document.querySelectorAll(".delete-icon");
  deleteIcons.forEach(deleteIcon => {
    deleteIcon.addEventListener("click", deleteTask);
  })
};

// Handle checkbox change
function handleCheckboxChange(event) {
  const checkbox = event.target;
  const index = checkbox.getAttribute('data-index');
  const article = checkbox.parentElement.parentElement;
  const taskText = checkbox.nextElementSibling;
  if (checkbox.checked) {
    article.classList.add("task-complete");
    taskText.classList.add("task-completed-text");
    deleteTimeouts[index] = setTimeout(() => {
      deleteTask(event, notify = false);
      showNotification("Congratulations! you have completed a task.", "success");
    }, 3000);
  } else {
    clearTimeout(deleteTimeouts[index]);
    article.classList.remove("task-complete");
    taskText.classList.remove("task-completed-text");
  }
};

// reset the form
let resetForm = () => {
  input.value = "";
  editIndex = null;
}

// delete task
function deleteTask(event, notify = true) {
  const deleteIcon = event.target;
  const index = deleteIcon.getAttribute("data-index");
  data.splice(index, 1); // remove the element at partcular index.
  addDataToLocalStorage(data); // update local storage.
  createTasks(); // create tasks with updated local storage.
  // and when the task is created notify the user about it w/t a message.
  showNotification("Task has been deleted successfully.", "success", notify);
}

// edit task
function editTask(event) {
  const editIcon = event.target;
  const index = editIcon.getAttribute("data-index");
  input.value = data[index].text;
  editIndex = index;
  button.innerText = "Update Task";
}

// Function to update task
function updateTask() {
  data[editIndex].text = input.value;
  addDataToLocalStorage(data);
  createTasks();
  showNotification("Task has been updated successfully.", "success");
}

document.addEventListener("DOMContentLoaded", createTasks());
