const express = require('express');
const cors = require('cors');
const { resolve } = require('path');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());

// Server Side Values
let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

function addTask(tasks, newTask) {
  tasks.push(newTask);
  return tasks;
}

app.get('/tasks/add', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let text = req.query.text;
  let priority = parseInt(req.query.priority);
  let newTask = {
    taskId: taskId,
    text: text,
    priority: priority,
  };

  let results = addTask(tasks, newTask);
  res.json({ tasks: results });
});

app.get('/tasks', (req, res) => {
  res.json({ tasks: tasks });
});

function sortAsendingOrderBasedOnPriority(taskObj1, taskObj2) {
  return taskObj1.priority - taskObj2.priority;
}

app.get('/tasks/sort-by-priority', (req, res) => {
  let tasksCopy = tasks.slice();
  tasksCopy.sort(sortAsendingOrderBasedOnPriority);
  res.json({ tasks: tasksCopy });
});

function updateTaskPriorityById(tasks, taskId, priority) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].priority = priority;
      break;
    }
  }
  return tasks;
}

app.get('/tasks/edit-priority', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let priority = parseInt(req.query.priority);
  let results = updateTaskPriorityById(tasks, taskId, priority);
  res.json({ tasks: results });
});

function updateTaskTextById(tasks, taskId, text) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].text = text;
      break;
    }
  }
  return tasks;
}

app.get('/tasks/edit-text', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let text = req.query.text;
  let results = updateTaskTextById(tasks, taskId, text);
  res.json({ tasks: results });
});

function shouldDeleteById(task, taskId) {
  return task.taskId != taskId;
}

app.get('/tasks/delete', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let results = tasks.filter((task) => shouldDeleteById(task, taskId));
  res.json({ tasks: results });
});

function filterTaskByPriority(task, priority) {
  return task.priority === priority;
}

app.get('/tasks/filter-by-priority', (req, res) => {
  let priority = parseInt(req.query.priority);
  let results = tasks.filter((task) => filterTaskByPriority(task, priority));
  res.json({ tasks: results });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
