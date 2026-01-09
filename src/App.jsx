import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, selectFilteredTasks, selectTasksLoading, selectTasksError } from './store/taskSlice';
import { useTheme } from './context/ThemeContext';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import TaskSearch from './components/TaskSearch';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectFilteredTasks);
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);
  const { theme } = useTheme();

  useEffect(() => {
    // Fetch tasks on component mount
    const loadTasks = async () => {
      await dispatch(fetchTasks());
    };
    loadTasks();
  }, [dispatch]);

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' 
        : 'bg-dark-bg'
    }`}>
      <ThemeToggle />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className={`text-4xl md:text-6xl font-bold mb-3 ${
            theme === 'light'
              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-neon-primary via-white to-neon-secondary drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]'
          }`}>
            Task Management Dashboard
          </h1>
          <p className={`text-sm md:text-base font-medium ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Organize your tasks efficiently
          </p>
        </header>

        {/* Task Input */}
        <TaskInput />

        {/* Search and Filter */}
        <TaskSearch />
        <TaskFilter />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
              theme === 'light' ? 'border-blue-600' : 'border-neon-primary'
            }`}></div>
            <p className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Loading tasks...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`max-w-2xl mx-auto mb-6 p-4 rounded-lg ${
            theme === 'light'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-red-900/20 border border-red-500/30 text-red-400'
          }`}>
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Task List */}
        {!loading && <TaskList tasks={tasks} />}

        {/* Stats */}
        {!loading && tasks.length > 0 && (
          <div className={`mt-8 text-center text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
