import taskReducer, {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  setFilter,
  setSearchQuery,
  selectFilteredTasks,
} from './taskSlice';

// Mock the API
jest.mock('../services/mockApi');

describe('taskSlice', () => {
  const initialState = {
    items: [],
    filter: 'All',
    searchQuery: '',
    loading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(taskReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setFilter', () => {
      const actual = taskReducer(initialState, setFilter('Completed'));
      expect(actual.filter).toEqual('Completed');
    });

    it('should handle setSearchQuery', () => {
      const actual = taskReducer(initialState, setSearchQuery('test'));
      expect(actual.searchQuery).toEqual('test');
    });
  });

  describe('async thunks', () => {
    it('should handle fetchTasks.pending', () => {
      const action = { type: fetchTasks.pending.type };
      const state = taskReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle fetchTasks.fulfilled', () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', status: 'Pending' },
        { id: 2, title: 'Task 2', status: 'Completed' },
      ];
      const action = {
        type: fetchTasks.fulfilled.type,
        payload: mockTasks,
      };
      const state = taskReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockTasks);
    });

    it('should handle fetchTasks.rejected', () => {
      const action = {
        type: fetchTasks.rejected.type,
        error: { message: 'Failed to fetch' },
      };
      const state = taskReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch');
    });

    it('should handle addTask.fulfilled', () => {
      const newTask = { id: 1, title: 'New Task', status: 'Pending' };
      const action = {
        type: addTask.fulfilled.type,
        payload: newTask,
      };
      const state = taskReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.items).toContainEqual(newTask);
      expect(state.items[0]).toEqual(newTask);
    });

    it('should handle updateTask.fulfilled', () => {
      const existingState = {
        ...initialState,
        items: [
          { id: 1, title: 'Task 1', status: 'Pending' },
          { id: 2, title: 'Task 2', status: 'Pending' },
        ],
      };
      const updatedTask = { id: 1, title: 'Updated Task', status: 'Completed' };
      const action = {
        type: updateTask.fulfilled.type,
        payload: updatedTask,
      };
      const state = taskReducer(existingState, action);
      expect(state.loading).toBe(false);
      expect(state.items[0]).toEqual(updatedTask);
      expect(state.items[1]).toEqual(existingState.items[1]);
    });

    it('should handle deleteTask.fulfilled', () => {
      const existingState = {
        ...initialState,
        items: [
          { id: 1, title: 'Task 1', status: 'Pending' },
          { id: 2, title: 'Task 2', status: 'Pending' },
        ],
      };
      const action = {
        type: deleteTask.fulfilled.type,
        payload: 1,
      };
      const state = taskReducer(existingState, action);
      expect(state.loading).toBe(false);
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe(2);
    });
  });

  describe('selectors', () => {
    it('selectFilteredTasks should filter by status', () => {
      const state = {
        tasks: {
          items: [
            { id: 1, title: 'Task 1', status: 'Pending' },
            { id: 2, title: 'Task 2', status: 'Completed' },
            { id: 3, title: 'Task 3', status: 'Pending' },
          ],
          filter: 'Completed',
          searchQuery: '',
        },
      };
      const result = selectFilteredTasks(state);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('Completed');
    });

    it('selectFilteredTasks should filter by search query', () => {
      const state = {
        tasks: {
          items: [
            { id: 1, title: 'React Task', status: 'Pending' },
            { id: 2, title: 'Vue Task', status: 'Pending' },
            { id: 3, title: 'React Component', status: 'Completed' },
          ],
          filter: 'All',
          searchQuery: 'react',
        },
      };
      const result = selectFilteredTasks(state);
      expect(result).toHaveLength(2);
      expect(result.every(task => task.title.toLowerCase().includes('react'))).toBe(true);
    });

    it('selectFilteredTasks should combine filter and search', () => {
      const state = {
        tasks: {
          items: [
            { id: 1, title: 'React Task', status: 'Pending' },
            { id: 2, title: 'Vue Task', status: 'Pending' },
            { id: 3, title: 'React Component', status: 'Completed' },
          ],
          filter: 'Completed',
          searchQuery: 'react',
        },
      };
      const result = selectFilteredTasks(state);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('Completed');
      expect(result[0].title.toLowerCase().includes('react')).toBe(true);
    });
  });
});

