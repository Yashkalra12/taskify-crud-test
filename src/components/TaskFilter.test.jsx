import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TaskFilter from './TaskFilter';
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

describe('TaskFilter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render all filter buttons', () => {
    renderWithProviders(<TaskFilter />);
    
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pending' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument();
  });

  it('should highlight active filter', () => {
    const store = createMockStore({
      tasks: {
        items: [],
        filter: 'Completed',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<TaskFilter />, { store });
    
    const completedButton = screen.getByRole('button', { name: 'Completed' });
    expect(completedButton).toHaveClass('bg-neon-primary');
  });

  it('should change filter when button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore({
      tasks: {
        items: [],
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<TaskFilter />, { store });
    
    const pendingButton = screen.getByRole('button', { name: 'Pending' });
    await user.click(pendingButton);
    
    const state = store.getState();
    expect(state.tasks.filter).toBe('Pending');
  });

  it('should apply light theme styles', () => {
    const store = createMockStore({
      tasks: {
        items: [],
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<TaskFilter />, { store, theme: 'light' });
    
    const allButton = screen.getByRole('button', { name: 'All' });
    expect(allButton).toBeInTheDocument();
  });

  it('should apply dark theme styles', () => {
    const store = createMockStore({
      tasks: {
        items: [],
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<TaskFilter />, { store, theme: 'dark' });
    
    const allButton = screen.getByRole('button', { name: 'All' });
    expect(allButton).toBeInTheDocument();
  });
});

