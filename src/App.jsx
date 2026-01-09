import { useState, useEffect } from 'react'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'

function App() {
  // Load tasks from localStorage initially (optional but nice)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-primary via-white to-neon-secondary mb-4 drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
            TASK TRACKER
          </h1>
          <p className="text-gray-400 font-rajdhani tracking-[0.3em] text-lg">
            SYSTEM STATUS: ONLINE
          </p>
        </header>

        <TaskInput onAdd={addTask} />
        <TaskList tasks={tasks} onToggle={toggleTask} />
      </div>
    </div>
  )
}

export default App
