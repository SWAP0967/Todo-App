const input = document.getElementById("input");
const tasklist = document.querySelector(".tasklist");
const addbutton = document.querySelector(".addbutton");
const clearallButton = document.querySelector(".clearall");
const pendingbutton = document.querySelector(".pendingbutton");
const completedbutton = document.querySelector(".completedbutton");
const alltaskbutton = document.querySelector(".alltaskbutton");
const errorMessageDiv = document.getElementById("errorMessage");
let taskdata = getData();
window.addEventListener("load", function () {
  taskdata = getData();
  updateTaskList(taskdata);
});

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    add();
  }
});

addbutton.addEventListener("click", function () {
  add();
});

function saveData(task) {
    let existingData = JSON.parse(localStorage.getItem("data"));
    existingData.push(task);
    localStorage.setItem("data", JSON.stringify(existingData));
  }

function displayErrorMessage(message) {
  errorMessageDiv.textContent = message;
}

function add() {
  errorMessageDiv.textContent = "";

  if (input.value === "") {
    displayErrorMessage("Task cannot be empty");
    input.focus();
    return;
  }

  let task = {
    text: input.value,
    completed: false,
  };

  let li = createTaskElement(task);
  tasklist.appendChild(li);
  input.value = "";

  taskdata.push(task);
  saveData();
}

completedbutton.addEventListener("click", function () {
  showTasks("completed");
});

pendingbutton.addEventListener("click", function () {
  showTasks("pending");
});

alltaskbutton.addEventListener("click", function () {
  showTasks("all");
});

clearallButton.addEventListener("click", function () {
  clearAll();
});
tasklist.addEventListener("click", function (event) {
  const targetitem = event.target;
  if (targetitem.classList.contains("deletebutton") || targetitem.parentElement.classList.contains("deletebutton")) {
    deleteTask(targetitem.closest(".task-item"));
  } else if (targetitem.classList.contains("checkbox")) {
    taskstatus(targetitem);
  } else if (targetitem.classList.contains("editbutton") || targetitem.parentElement.classList.contains("editbutton")) {
    editTask(targetitem.closest(".task-item"));
  }
});
function showTasks(taskType) {
  let filteredTasks;

  if (taskType === "completed") {
    filteredTasks = taskdata.filter((task) => task.completed);
  } else if (taskType === "pending") {
    filteredTasks = taskdata.filter((task) => !task.completed);
  } else {
    filteredTasks = taskdata;
  }

  updateTaskList(filteredTasks);
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.innerHTML = `
    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}>
    <span class="${task.completed ? "completed" : ""}">${task.text}</span>
    <button type="button" class="deletebutton btn btn-primary btn-lg "><i class="bi bi-trash3"></i></button>
    <button type="button" class="editbutton btn btn-primary btn-lg"><i class="bi bi-pencil-square"></i></button>
  `;
  return li;
}
function updateTaskList(tasks) {
  tasklist.innerHTML = "";

  if (tasks.length === 0) {
    tasklist.innerHTML = "<p>No tasks to show</p>";
  } else {
    tasks.forEach((task) => {
      let li = createTaskElement(task);
      tasklist.appendChild(li);
    });
  }
  saveData();
}

function clearAll() {
  tasklist.innerHTML = "";
  taskdata = [];
  saveData();
}

function deleteTask(taskItem) {
  taskItem.remove();
  const taskText = taskItem.querySelector("span").textContent;
  taskdata = taskdata.filter((task) => task.text.toLowerCase() !== taskText.toLowerCase());
  saveData();
}

function taskstatus(checkbox) {
    const taskitem = checkbox.parentElement;
    const span = taskitem.querySelector("span");
    const taskId = taskdata.findIndex((task) => task.text === span.textContent);
  
    taskdata[taskId].completed = checkbox.checked;
  
    if (checkbox.checked) {
      span.classList.add("completed");
    } else {
      span.classList.remove("completed");
    }
    saveData();
  }

function editTask(taskItem) {
  const span = taskItem.querySelector("span");
  const taskId = taskdata.findIndex((task) => task.text.toLowerCase() === span.textContent.toLowerCase());

  const newText = prompt("Edit task:", span.textContent);
  if (newText !== null) {
    taskdata[taskId].text = newText;
    span.textContent = newText;
    saveData();
  }
}
function saveData() {
    localStorage.setItem("data", JSON.stringify(taskdata));
  }

function getData() {
  return JSON.parse(localStorage.getItem("data")) || [];
}
