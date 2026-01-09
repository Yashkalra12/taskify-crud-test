import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../store/taskSlice';
import { useTheme } from '../context/ThemeContext';

export default function TaskList({ tasks }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) {
      alert('Task title cannot be empty');
      return;
    }
    try {
      await dispatch(updateTask({ id, updates: { title: editTitle.trim() } })).unwrap();
      setEditingId(null);
      setEditTitle('');
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await dispatch(updateTask({ id: task.id, updates: { status: newStatus } })).unwrap();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(id)).unwrap();
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  if (tasks.length === 0) {
    return (
      <div className={`text-center py-12 ${
        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
      }`}>
        <p className="text-lg font-medium">No tasks found</p>
        <p className="text-sm mt-2">Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`group transition-all duration-200 ${
            theme === 'light'
              ? 'bg-white border border-gray-200 hover:shadow-md'
              : 'glass-card hover:border-white/20'
          } p-4 rounded-xl ${
            task.status === 'Completed' ? 'opacity-75' : ''
          }`}
        >
          {editingId === task.id ? (
            // Edit mode
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit(task.id);
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
                className={`flex-1 px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 ${
                  theme === 'light'
                    ? 'bg-white border-blue-500 focus:ring-blue-200 text-gray-900'
                    : 'bg-dark-surface border-neon-primary focus:ring-neon-primary/20 text-white'
                }`}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveEdit(task.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    theme === 'light'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-600/80 hover:bg-green-600 text-white'
                  }`}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    theme === 'light'
                      ? 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    task.status === 'Completed'
                      ? theme === 'light'
                        ? 'bg-green-500 border-green-500'
                        : 'bg-green-500 border-green-500'
                      : theme === 'light'
                        ? 'bg-transparent border-gray-400 hover:border-green-500'
                        : 'bg-transparent border-gray-500 hover:border-green-500'
                  }`}
                >
                  {task.status === 'Completed' && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span
                  className={`font-medium flex-1 ${
                    task.status === 'Completed'
                      ? 'line-through opacity-60'
                      : ''
                  } ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    task.status === 'Completed'
                      ? theme === 'light'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : theme === 'light'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}
                >
                  {task.status}
                </span>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(task)}
                    className={`p-1.5 rounded-lg transition-all ${
                      theme === 'light'
                        ? 'hover:bg-blue-100 text-blue-600'
                        : 'hover:bg-blue-500/20 text-blue-400'
                    }`}
                    title="Edit task"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className={`p-1.5 rounded-lg transition-all ${
                      theme === 'light'
                        ? 'hover:bg-red-100 text-red-600'
                        : 'hover:bg-red-500/20 text-red-400'
                    }`}
                    title="Delete task"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
