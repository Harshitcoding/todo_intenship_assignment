import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Check, X } from 'lucide-react';

const API_URL = 'https://todo-intenship-assignment.vercel.app//tasks';

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Create task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      const createdTask = await response.json();
      setTasks([...tasks, createdTask]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Update task
  const handleUpdateTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingTask),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-indigo-600 text-white p-6">
          <h1 className="text-3xl font-bold">Task Management</h1>
        </div>

        {/* Task Creation Form */}
        <form onSubmit={handleCreateTask} className="p-6 bg-gray-50 border-b">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="flex-grow p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="flex-grow p-2 border rounded"
            />
            <button 
              type="submit" 
              className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition flex items-center"
            >
              <Plus className="mr-2" /> Add Task
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="divide-y">
          {tasks.map(task => (
            <div key={task.id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
              {editingTask && editingTask.id === task.id ? (
                // Editing Mode
                <div className="flex-grow flex space-x-4">
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    className="flex-grow p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    className="flex-grow p-2 border rounded"
                  />
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
                    className="p-2 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="In-process">In-process</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleUpdateTask(task.id)}
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                      <Check />
                    </button>
                    <button 
                      onClick={() => setEditingTask(null)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      <X />
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex-grow">
                  <div className="font-bold text-lg">{task.title}</div>
                  <div className="text-gray-600">{task.description}</div>
                  <span 
                    className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                      task.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              {!editingTask && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setEditingTask(task)}
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded"
                  >
                    <Edit />
                  </button>
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded"
                  >
                    <Trash2 />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Todo;