let time = 0;
let totalTime = 0;
let timer = null;

function speak(text) {
  let speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speech);
}

function setCustomTime() {
  let minutes = parseInt(document.getElementById("minutesInput").value) || 0;
  let seconds = parseInt(document.getElementById("secondsInput").value) || 0;

  if (minutes === 0 && seconds === 0) {
    alert("Enter valid time");
    return;
  }

  time = (minutes * 60) + seconds;
  totalTime = time;

  speak(`Timer set for ${minutes} minutes and ${seconds} seconds`);
  updateDisplay();
}

function updateDisplay() {
  let min = Math.floor(time / 60);
  let sec = time % 60;

  document.getElementById("time").innerText =
    `${min}:${sec < 10 ? "0" : ""}${sec}`;

  if (totalTime > 0) {
    let percent = (time / totalTime) * 100;
    document.getElementById("progress").style.width = percent + "%";
  }
}

function startTimer() {
  if (timer || time === 0) return;

  speak("Timer started");

  timer = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
    } else {
      clearInterval(timer);
      timer = null;
      speak("Time is up");
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  time = totalTime;

  speak("Timer reset");
  updateDisplay();
}

function addTask() {
  let input = document.getElementById("taskInput");
  let taskText = input.value.trim();

  if (taskText === "") return;

  createTaskElement(taskText);
  speak("Task added");

  input.value = "";
  saveTasks();
}

function createTaskElement(taskText) {
  let li = document.createElement("li");

  li.innerHTML = `
    ${taskText}
    <div>
      <button onclick="completeTask(this)">✔</button>
      <button onclick="deleteTask(this)">❌</button>
    </div>
  `;

  document.getElementById("taskList").appendChild(li);
}

function completeTask(btn) {
  let task = btn.closest("li");

  speak("Task completed");

  task.classList.add("completed");

  setTimeout(() => {
    task.remove();
    saveTasks();
  }, 500);
}

function deleteTask(btn) {
  let task = btn.closest("li");

  speak("Task deleted");

  task.remove();
  saveTasks();
}

function saveTasks() {
  let tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    let text = li.childNodes[0].textContent.trim();
    tasks.push(text);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTaskElement(task));
}

loadTasks();

function toggleDark() {
  document.body.classList.toggle("dark");
  speak("Theme changed");
}