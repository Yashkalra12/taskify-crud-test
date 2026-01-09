import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TaskSearch from './TaskSearch';
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

describe('TaskSearch', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render search input', () => {
    renderWithProviders(<TaskSearch />);
    
    const input = screen.getByPlaceholderText(/search tasks by title/i);
    expect(input).toBeInTheDocument();
  });

  it('should update search query when typing', async () => {
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
    
    renderWithProviders(<TaskSearch />, { store });
    
    const input = screen.getByPlaceholderText(/search tasks by title/i);
    await user.type(input, 'test query');
    
    const state = store.getState();
    expect(state.tasks.searchQuery).toBe('test query');
  });

  it('should clear search query when clear button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore({
      tasks: {
        items: [],
        filter: 'All',
        searchQuery: 'test',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<TaskSearch />, { store });
    
    const clearButton = screen.getByRole('button');
    await user.click(clearButton);
    
    const state = store.getState();
    expect(state.tasks.searchQuery).toBe('');
  });

  it('should not show clear button when search is empty', () => {
    const store = createMockStore({
      tasks: {
        items: [],
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<TaskSearch />, { store });
    
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });

  it('should show clear button when search has value', () => {
    const store = createMockStore({
      tasks: {
        items: [],
        filter: 'All',
        searchQuery: 'test',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<TaskSearch />, { store });
    
    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();
  });

  it('should apply light theme styles', () => {
    renderWithProviders(<TaskSearch />, { theme: 'light' });
    
    const input = screen.getByPlaceholderText(/search tasks by title/i);
    expect(input).toBeInTheDocument();
  });

  it('should apply dark theme styles', () => {
    renderWithProviders(<TaskSearch />, { theme: 'dark' });
    
    const input = screen.getByPlaceholderText(/search tasks by title/i);
    expect(input).toBeInTheDocument();
  });
});

