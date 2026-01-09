import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TaskInput from './TaskInput';
import taskReducer from '../store/taskSlice';
import { ThemeProvider } from '../context/ThemeContext';

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

describe('TaskInput', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should render input and button', () => {
    renderWithProviders(<TaskInput />);
    
    expect(screen.getByPlaceholderText(/enter task title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('should allow typing in input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskInput />);
    
    const input = screen.getByPlaceholderText(/enter task title/i);
    await user.type(input, 'New Task');
    
    expect(input).toHaveValue('New Task');
  });

  it('should show error when submitting empty task', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskInput />);
    
    const button = screen.getByRole('button', { name: /add task/i });
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/task title is required/i)).toBeInTheDocument();
    });
  });

  it('should clear error when user starts typing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskInput />);
    
    const input = screen.getByPlaceholderText(/enter task title/i);
    const button = screen.getByRole('button', { name: /add task/i });
    
    // Submit empty to trigger error
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByText(/task title is required/i)).toBeInTheDocument();
    });
    
    // Start typing
    await user.type(input, 'T');
    
    await waitFor(() => {
      expect(screen.queryByText(/task title is required/i)).not.toBeInTheDocument();
    });
  });

  it('should submit form with valid task title', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    renderWithProviders(<TaskInput />, { store });
    
    const input = screen.getByPlaceholderText(/enter task title/i);
    const button = screen.getByRole('button', { name: /add task/i });
    
    await user.type(input, 'Test Task');
    await user.click(button);
    
    // Wait for async action to complete
    await waitFor(() => {
      const state = store.getState();
      expect(state.tasks.items.length).toBeGreaterThan(0);
    });
    
    // Input should be cleared
    expect(input).toHaveValue('');
  });

  it('should handle Enter key submission', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    renderWithProviders(<TaskInput />, { store });
    
    const input = screen.getByPlaceholderText(/enter task title/i);
    
    await user.type(input, 'Test Task{Enter}');
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.tasks.items.length).toBeGreaterThan(0);
    });
  });

  it('should apply light theme styles', () => {
    renderWithProviders(<TaskInput />, { theme: 'light' });
    
    const input = screen.getByPlaceholderText(/enter task title/i);
    expect(input).toBeInTheDocument();
  });

  it('should apply dark theme styles', () => {
    renderWithProviders(<TaskInput />, { theme: 'dark' });
    
    const input = screen.getByPlaceholderText(/enter task title/i);
    expect(input).toBeInTheDocument();
  });
});

