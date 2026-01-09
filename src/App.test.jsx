import { render, screen, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import taskReducer from './store/taskSlice';
import { ThemeProvider } from './context/ThemeContext';
import * as taskSlice from './store/taskSlice';

// Mock the API
const mockFetchTasks = jest.fn(() => Promise.resolve({
  data: [
    { id: 1, title: 'Task 1', status: 'Pending', createdAt: Date.now() },
    { id: 2, title: 'Task 2', status: 'Completed', createdAt: Date.now() },
  ],
}));

jest.mock('./services/mockApi', () => ({
  mockApi: {
    fetchTasks: mockFetchTasks,
    addTask: jest.fn((taskData) => Promise.resolve({
      data: { id: 3, title: taskData.title, status: 'Pending', createdAt: Date.now() },
    })),
    updateTask: jest.fn((id, updates) => Promise.resolve({
      data: { id, ...updates, createdAt: Date.now() },
    })),
    deleteTask: jest.fn((id) => Promise.resolve({ data: { id } })),
  },
}));

const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: { tasks: taskReducer },
    preloadedState,
  });
};

const renderWithProviders = (ui, { store = createMockStore(), theme = 'dark' } = {}) => {
  localStorage.setItem('theme', theme);
  return {
    store,
    ...render(
      <Provider store={store}>
        <ThemeProvider>{ui}</ThemeProvider>
      </Provider>
    ),
  };
};

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // Reset mock to return resolved promise immediately
    mockFetchTasks.mockResolvedValue({
      data: [
        { id: 1, title: 'Task 1', status: 'Pending', createdAt: Date.now() },
        { id: 2, title: 'Task 2', status: 'Completed', createdAt: Date.now() },
      ],
    });
  });

  it('should render app with header', async () => {
    await act(async () => {
      renderWithProviders(<App />);
    });
    
    expect(screen.getByText(/task management dashboard/i)).toBeInTheDocument();
  });

  it('should fetch tasks on mount', async () => {
    const fetchTasksSpy = jest.spyOn(taskSlice, 'fetchTasks');
    
    await act(async () => {
      renderWithProviders(<App />);
    });
    
    await waitFor(() => {
      expect(fetchTasksSpy).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should display loading state', async () => {
    const store = createMockStore({
      tasks: {
        items: [],
        filter: 'All',
        searchQuery: '',
        loading: true,
        error: null,
      },
    });
    
    await act(async () => {
      renderWithProviders(<App />, { store });
    });
    
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  it('should display error state', async () => {
    const store = createMockStore({
      tasks: {
        items: [],
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: 'Failed to fetch tasks',
      },
    });
    
    await act(async () => {
      renderWithProviders(<App />, { store });
    });
    
    // Wait a bit for render to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch tasks/i)).toBeInTheDocument();
  });

  it('should render all main components', async () => {
    const store = createMockStore({
      tasks: {
        items: [
          { id: 1, title: 'Task 1', status: 'Pending' },
        ],
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<App />, { store });
    
    // Wait for fetchTasks to complete and component to update
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter task title/i)).toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(screen.getByPlaceholderText(/search tasks by title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    
    // TaskList should render when not loading
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should display task count', async () => {
    const store = createMockStore({
      tasks: {
        items: [
          { id: 1, title: 'Task 1', status: 'Pending' },
          { id: 2, title: 'Task 2', status: 'Completed' },
        ],
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<App />, { store });
    
    // Wait for fetchTasks to complete and component to update
    await waitFor(() => {
      expect(screen.getByText(/showing 2 tasks/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should display empty state when no tasks match filter', async () => {
    const store = createMockStore({
      tasks: {
        items: [
          { id: 1, title: 'Task 1', status: 'Pending' },
        ],
        filter: 'Completed',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<App />, { store });
    
    // Wait for fetchTasks to complete and component to update
    await waitFor(() => {
      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should render theme toggle button', async () => {
    await act(async () => {
      renderWithProviders(<App />);
    });
    
    const themeButton = screen.getByTitle(/switch to/i);
    expect(themeButton).toBeInTheDocument();
  });
});

