import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, selectSearchQuery } from '../store/taskSlice';
import { useTheme } from '../context/ThemeContext';

export default function TaskSearch() {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const { theme } = useTheme();

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Search tasks by title..."
          className={`w-full px-4 py-3 pl-10 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
            theme === 'light'
              ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-gray-900'
              : 'bg-dark-surface border-white/10 focus:border-neon-primary focus:ring-neon-primary/20 text-white'
          } placeholder-gray-500`}
        />
        <svg
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            theme === 'light' ? 'text-gray-400' : 'text-gray-500'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => dispatch(setSearchQuery(''))}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

