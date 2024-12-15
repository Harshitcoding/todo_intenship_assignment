const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

let tasks = [];

// POST /tasks
app.post('/tasks', (req, res) => {
  const { title, description, status = 'pending' } = req.body;
  const newTask = { id: tasks.length + 1, title, description, status };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// GET /tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, status } = req.body;
  const updatedTask = { ...tasks[taskIndex], title, description, status };
  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.json(deletedTask);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
