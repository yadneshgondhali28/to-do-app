
let form = document.getElementById("form"); //form element
let input = document.getElementById("input"); // input element
let msg = document.getElementById("msg"); // error msg element
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
  if (input.value === "") {
    msg.innerHTML = "task field cannot be blank";
    console.log("failure");
  } else {
    if (editIndex !== null) {
      updateTask();
    } else {
      console.log("success");
      msg.innerHTML = "";
      acceptData();
    }
  }
};



// add data to local storage
function addDataToLocalStorage(data) {
  return localStorage.setItem("todo", JSON.stringify(data));
}

// get data from local storage
function getLocalStorageData() {
  return JSON.parse(localStorage.getItem("todo")) || [];
}


// accepting data
let acceptData = () => {
  data.push({
    text: input.value
  });
  addDataToLocalStorage(data);
  createTasks();
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
  resetForm();
}

// reset the form
let resetForm = () => {
  input.value = "";
  editIndex = null;
}

// delete task
function deleteTask(index) {
  data.splice(index, 1);
  addDataToLocalStorage(data);
  createTasks();
}

// edit task
function editTask(index) {
  input.value = data[index].text;
  editIndex = index;
}

// Function to update task
function updateTask() {
  data[editIndex].text = input.value;
  addDataToLocalStorage(data);
  createTasks();
}

createTasks();