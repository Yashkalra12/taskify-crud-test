import { useDispatch, useSelector } from 'react-redux';
import { setFilter, selectFilter } from '../store/taskSlice';
import { useTheme } from '../context/ThemeContext';

export default function TaskFilter() {
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const { theme } = useTheme();

  const filters = ['All', 'Pending', 'Completed'];

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {filters.map((filterOption) => (
        <button
          key={filterOption}
          onClick={() => dispatch(setFilter(filterOption))}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            filter === filterOption
              ? theme === 'light'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-neon-primary text-black font-bold shadow-neon-blue'
              : theme === 'light'
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-dark-surface text-gray-300 hover:bg-dark-card border border-white/10'
          }`}
        >
          {filterOption}
        </button>
      ))}
    </div>
  );
}

