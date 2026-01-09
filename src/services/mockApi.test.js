import { mockApi } from './mockApi';

describe('mockApi', () => {
  beforeEach(() => {
    // Reset the mock tasks storage
    jest.clearAllMocks();
  });

  describe('fetchTasks', () => {
    it('should fetch all tasks', async () => {
      const result = await mockApi.fetchTasks();
      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should return tasks with correct structure', async () => {
      const result = await mockApi.fetchTasks();
      if (result.data.length > 0) {
        const task = result.data[0];
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('title');
        expect(task).toHaveProperty('status');
      }
    });
  });

  describe('addTask', () => {
    it('should add a new task', async () => {
      const taskData = { title: 'Test Task' };
      const result = await mockApi.addTask(taskData);
      
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('id');
      expect(result.data.title).toBe('Test Task');
      expect(result.data.status).toBe('Pending');
    });

    it('should assign unique IDs', async () => {
      const task1 = await mockApi.addTask({ title: 'Task 1' });
      const task2 = await mockApi.addTask({ title: 'Task 2' });
      
      expect(task1.data.id).not.toBe(task2.data.id);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      // First add a task
      const added = await mockApi.addTask({ title: 'Original Title' });
      const taskId = added.data.id;

      // Then update it
      const result = await mockApi.updateTask(taskId, { title: 'Updated Title' });
      
      expect(result.data.id).toBe(taskId);
      expect(result.data.title).toBe('Updated Title');
    });

    it('should update task status', async () => {
      const added = await mockApi.addTask({ title: 'Test Task' });
      const taskId = added.data.id;

      const result = await mockApi.updateTask(taskId, { status: 'Completed' });
      
      expect(result.data.status).toBe('Completed');
    });

    it('should throw error for non-existent task', async () => {
      await expect(mockApi.updateTask(99999, { title: 'Test' })).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', async () => {
      // First add a task
      const added = await mockApi.addTask({ title: 'Task to Delete' });
      const taskId = added.data.id;

      // Then delete it
      const result = await mockApi.deleteTask(taskId);
      
      expect(result.data.id).toBe(taskId);

      // Verify it's deleted by trying to update it
      await expect(mockApi.updateTask(taskId, { title: 'Test' })).rejects.toThrow('Task not found');
    });

    it('should throw error for non-existent task', async () => {
      await expect(mockApi.deleteTask(99999)).rejects.toThrow('Task not found');
    });
  });
});

