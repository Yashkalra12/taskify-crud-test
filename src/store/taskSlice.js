import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import { mockApi } from '../services/mockApi';

// Async thunks for API calls
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await mockApi.fetchTasks();
    return response.data;
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (taskData) => {
    const response = await mockApi.addTask(taskData);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }) => {
    const response = await mockApi.updateTask(id, updates);
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id) => {
    await mockApi.deleteTask(id);
    return id;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    filter: 'All', // All, Completed, Pending
    searchQuery: '',
    loading: false,
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add task
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilter, setSearchQuery } = taskSlice.actions;

// Selectors
export const selectAllTasks = (state) => state.tasks.items;
export const selectFilter = (state) => state.tasks.filter;
export const selectSearchQuery = (state) => state.tasks.searchQuery;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;

// Computed selector for filtered and searched tasks (memoized)
export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectFilter, selectSearchQuery],
  (tasks, filter, searchQuery) => {
    const query = searchQuery.toLowerCase();
    let filtered = tasks;

    // Apply filter
    if (filter === 'Completed') {
      filtered = filtered.filter(task => task.status === 'Completed');
    } else if (filter === 'Pending') {
      filtered = filtered.filter(task => task.status === 'Pending');
    }

    // Apply search
    if (query) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export default taskSlice.reducer;

