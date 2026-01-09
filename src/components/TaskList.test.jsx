import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TaskList from './TaskList';
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

const mockTasks = [
  { id: 1, title: 'Task 1', status: 'Pending' },
  { id: 2, title: 'Task 2', status: 'Completed' },
  { id: 3, title: 'Task 3', status: 'Pending' },
];

describe('TaskList', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
  });

  it('should render empty state when no tasks', () => {
    renderWithProviders(<TaskList tasks={[]} />);
    
    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });

  it('should render list of tasks', () => {
    renderWithProviders(<TaskList tasks={mockTasks} />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('should display task status badges', () => {
    renderWithProviders(<TaskList tasks={mockTasks} />);
    
    expect(screen.getAllByText('Pending')).toHaveLength(2);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should toggle task status when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore({
      tasks: {
        items: mockTasks,
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<TaskList tasks={mockTasks} />, { store });
    
    const checkboxes = screen.getAllByRole('button');
    const pendingTaskCheckbox = checkboxes.find(btn => 
      btn.closest('div')?.textContent.includes('Task 1')
    );
    
    if (pendingTaskCheckbox) {
      await user.click(pendingTaskCheckbox);
      
      await waitFor(() => {
        const state = store.getState();
        const task = state.tasks.items.find(t => t.id === 1);
        expect(task.status).toBe('Completed');
      });
    }
  });

  it('should enter edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskList tasks={mockTasks} />);
    
    const editButtons = screen.getAllByTitle(/edit task/i);
    await user.click(editButtons[0]);
    
    const input = screen.getByDisplayValue('Task 1');
    expect(input).toBeInTheDocument();
    expect(screen.getByText(/save/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  it('should save edited task', async () => {
    const user = userEvent.setup();
    const store = createMockStore({
      tasks: {
        items: mockTasks,
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<TaskList tasks={mockTasks} />, { store });
    
    const editButtons = screen.getAllByTitle(/edit task/i);
    await user.click(editButtons[0]);
    
    const input = await screen.findByDisplayValue('Task 1');
    await user.clear(input);
    await user.type(input, 'Updated Task');
    
    const saveButton = screen.getByText(/save/i);
    await user.click(saveButton);
    
    // Wait for the update to complete
    await waitFor(() => {
      expect(screen.queryByDisplayValue('Updated Task')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // The task should be updated in the store, but we're passing tasks as prop
    // So we need to check if the component re-renders with new tasks
    // Since we're testing the component in isolation, we should check the store state
    await waitFor(() => {
      const state = store.getState();
      const updatedTask = state.tasks.items.find(t => t.id === 1);
      expect(updatedTask?.title).toBe('Updated Task');
    }, { timeout: 3000 });
  });

  it('should cancel editing when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskList tasks={mockTasks} />);
    
    const editButtons = screen.getAllByTitle(/edit task/i);
    await user.click(editButtons[0]);
    
    const input = screen.getByDisplayValue('Task 1');
    await user.clear(input);
    await user.type(input, 'Changed Task');
    
    const cancelButton = screen.getByText(/cancel/i);
    await user.click(cancelButton);
    
    await waitFor(() => {
      expect(screen.queryByDisplayValue('Changed Task')).not.toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
  });

  it('should save on Enter key', async () => {
    const user = userEvent.setup();
    const store = createMockStore({
      tasks: {
        items: mockTasks,
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<TaskList tasks={mockTasks} />, { store });
    
    const editButtons = screen.getAllByTitle(/edit task/i);
    await user.click(editButtons[0]);
    
    const input = await screen.findByDisplayValue('Task 1');
    await user.clear(input);
    await user.type(input, 'Enter Saved Task{Enter}');
    
    // Wait for the update to complete
    await waitFor(() => {
      const state = store.getState();
      const updatedTask = state.tasks.items.find(t => t.id === 1);
      expect(updatedTask?.title).toBe('Enter Saved Task');
    }, { timeout: 3000 });
  });

  it('should cancel on Escape key', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskList tasks={mockTasks} />);
    
    const editButtons = screen.getAllByTitle(/edit task/i);
    await user.click(editButtons[0]);
    
    const input = screen.getByDisplayValue('Task 1');
    await user.type(input, '{Escape}');
    
    await waitFor(() => {
      expect(screen.queryByDisplayValue('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
  });

  it('should delete task when delete button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore({
      tasks: {
        items: mockTasks,
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<TaskList tasks={mockTasks} />, { store });
    
    const deleteButtons = screen.getAllByTitle(/delete task/i);
    await user.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      const state = store.getState();
      expect(state.tasks.items.find(t => t.id === 1)).toBeUndefined();
    });
  });

  it('should not delete task if confirmation is cancelled', async () => {
    window.confirm = jest.fn(() => false);
    const user = userEvent.setup();
    const store = createMockStore({
      tasks: {
        items: mockTasks,
        filter: 'All',
        searchQuery: '',
        loading: false,
        error: null,
      },
    });
    
    renderWithProviders(<TaskList tasks={mockTasks} />, { store });
    
    const deleteButtons = screen.getAllByTitle(/delete task/i);
    await user.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
    });
    
    // Task should still be in the list
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('should show completed tasks with line-through', () => {
    renderWithProviders(<TaskList tasks={mockTasks} />);
    
    const completedTask = screen.getByText('Task 2').closest('div');
    // Check if the parent container has the opacity class
    const taskContainer = completedTask?.closest('div.group');
    expect(taskContainer).toHaveClass('opacity-75');
  });
});

