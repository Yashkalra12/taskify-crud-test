import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../store/taskSlice';
import { useTheme } from '../context/ThemeContext';

export default function TaskInput() {
  const [taskTitle, setTaskTitle] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation: title is mandatory
    if (!taskTitle.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      await dispatch(addTask({ title: taskTitle.trim() })).unwrap();
      setTaskTitle('');
    } catch (err) {
      setError('Failed to add task. Please try again.');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`w-full max-w-2xl mx-auto mb-6 ${
        theme === 'light' 
          ? 'bg-white/80 backdrop-blur-sm border-gray-200' 
          : 'glass-card'
      } p-6 rounded-xl shadow-lg`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => {
              setTaskTitle(e.target.value);
              setError('');
            }}
            placeholder="Enter task title..."
            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
              theme === 'light'
                ? error
                  ? 'bg-white border-red-300 focus:border-red-500 focus:ring-red-200 text-gray-900'
                  : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-gray-900'
                : error
                  ? 'bg-dark-surface border-red-500/50 focus:border-red-500 focus:ring-red-500/20 text-white'
                  : 'bg-dark-surface border-white/10 focus:border-neon-primary focus:ring-neon-primary/20 text-white'
            } placeholder-gray-500 font-medium`}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
        <button
          type="submit"
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap ${
            theme === 'light'
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
              : 'btn-neon'
          }`}
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
