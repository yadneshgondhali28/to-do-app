// IIFE
(function () {
  let form = document.getElementById("form"); //form element
  let input = document.getElementById("input"); // input element
  const button = document.querySelector(".add-btn");
  let msg = document.querySelector(".msg"); // error msg element
  let taskContainer = document.getElementById("task-container"); // task container element

  let editIndex = null;

  // creating data array
  let data = getLocalStorageData() || [];

  // Adding event listener on form
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
  })

  // validating form
  let formValidation = () => {
    const messageValue = "Task field cannot be empty";
    const messageType = "error";
    if (input.value === "") {
      showNotification(message = messageValue, type = messageType);
    } else {
      if (editIndex !== null) {
        updateTask();
        resetForm();
      } else {
        console.log("success");
        msg.innerHTML = "";
        acceptData();
      }
    }
  };

  function showNotification(message, type) {
    msg.innerHTML = message;
    msg.classList.add(type);
    setTimeout(() => {
      msg.innerHTML = "";
      msg.type = "";
      msg.classList.remove(type)
    }, 3000);
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
    const messageValue = "Task has been created successfully.";
    const messageType = "success";
    showNotification(message = messageValue, type = messageType);
  };

  // creating tasks
  let createTasks = () => {
    taskContainer.innerHTML = "";
    data.forEach((x, y) => {
      return (taskContainer.innerHTML += `
      <article class="tasks" id=${y}>
        <div class="task-txt">
          <p>${x.text}</p>
        </div>
        <span class="icon-options">
          <i onClick="editTask(${y})"  class="fa-solid fa-pen-to-square edit-icon"></i>
          <i onClick="deleteTask(${y})" class="fa-solid fa-trash delete-icon"></i>
        </span>
      </article>
  `);
    })
  }

  // reset the form
  let resetForm = () => {
    input.value = "";
    editIndex = null;
    button.innerText = "Add Task";
  }

  // delete task
  function deleteTask(index) {
    data.splice(index, 1);
    addDataToLocalStorage(data);
    createTasks();
    const messageValue = "Task has been deleted successfully.";
    const messageType = "success";
    showNotification(message = messageValue, type = messageType);
  }

  // edit task
  function editTask(index) {
    input.value = data[index].text;
    editIndex = index;
    button.innerText = "Update Task";
  }

  // Function to update task
  function updateTask() {
    data[editIndex].text = input.value;
    addDataToLocalStorage(data);
    createTasks();
    const messageValue = "Task has been updated successfully.";
    const messageType = "success";
    showNotification(message = messageValue, type = messageType);
  }

  document.addEventListener("DOMContentLoaded", createTasks());
})();