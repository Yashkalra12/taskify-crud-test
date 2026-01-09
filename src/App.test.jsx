import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import taskReducer from './store/taskSlice';
import { ThemeProvider } from './context/ThemeContext';
import * as taskSlice from './store/taskSlice';

// Mock the API
jest.mock('./services/mockApi', () => ({
  mockApi: {
    fetchTasks: jest.fn(() => Promise.resolve({
      data: [
        { id: 1, title: 'Task 1', status: 'Pending', createdAt: Date.now() },
        { id: 2, title: 'Task 2', status: 'Completed', createdAt: Date.now() },
      ],
    })),
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
  });

  it('should render app with header', () => {
    renderWithProviders(<App />);
    
    expect(screen.getByText(/task management dashboard/i)).toBeInTheDocument();
  });

  it('should fetch tasks on mount', async () => {
    const fetchTasksSpy = jest.spyOn(taskSlice, 'fetchTasks');
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(fetchTasksSpy).toHaveBeenCalled();
    });
  });

  it('should display loading state', () => {
    const store = createMockStore({
      tasks: {
        items: [],
        filter: 'All',
        searchQuery: '',
        loading: true,
        error: null,
      },
    });
    
    renderWithProviders(<App />, { store });
    
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  it('should display error state', () => {
    const store = createMockStore({
      tasks: {
        items: [],
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: 'Failed to fetch tasks',
      },
    });
    
    renderWithProviders(<App />, { store });
    
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch tasks/i)).toBeInTheDocument();
  });

  it('should render all main components', () => {
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
    
    expect(screen.getByPlaceholderText(/enter task title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search tasks by title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('should display task count', () => {
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
    
    expect(screen.getByText(/showing 2 tasks/i)).toBeInTheDocument();
  });

  it('should display empty state when no tasks match filter', () => {
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
    
    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });

  it('should render theme toggle button', () => {
    renderWithProviders(<App />);
    
    const themeButton = screen.getByTitle(/switch to/i);
    expect(themeButton).toBeInTheDocument();
  });
});

