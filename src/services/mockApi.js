// Mock API service for task operations
// Simulates API calls with delays

const API_DELAY = 100; // milliseconds

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock tasks storage (simulating a backend)
let mockTasks = [
  { id: 1, title: 'Complete project documentation', status: 'Pending', createdAt: Date.now() },
  { id: 2, title: 'Review code changes', status: 'Completed', createdAt: Date.now() - 86400000 },
];

let nextId = 3;

export const mockApi = {
  // Fetch all tasks
  async fetchTasks() {
    await delay(API_DELAY);
    return { data: [...mockTasks] };
  },

  // Add a new task
  async addTask(taskData) {
    await delay(API_DELAY);
    const newTask = {
      id: nextId++,
      title: taskData.title,
      status: 'Pending',
      createdAt: Date.now()
    };
    mockTasks.push(newTask);
    return { data: newTask };
  },

  // Update a task
  async updateTask(id, updates) {
    await delay(API_DELAY);
    const taskIndex = mockTasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
    return { data: mockTasks[taskIndex] };
  },

  // Delete a task
  async deleteTask(id) {
    await delay(API_DELAY);
    const taskIndex = mockTasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    mockTasks.splice(taskIndex, 1);
    return { data: { id } };
  }
};

