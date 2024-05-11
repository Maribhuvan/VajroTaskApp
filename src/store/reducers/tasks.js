import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  id: 1
};
const taskIdPrefix = 'VAJ-';

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const taskId = `${taskIdPrefix}${state.id.toString().padStart(3, '0')}`;
      const newTask = { ...action.payload, taskId: taskId };
      state.tasks.push(newTask);
      state.id++;
    },
    updateTask: (state, action) => {
      const { taskId, updates } = action.payload;
      const taskToUpdate = state.tasks.find((task) => task.taskId === taskId);
      if (taskToUpdate) {
        Object.assign(taskToUpdate, updates);
      }
    },
    deleteTask: (state, action) => {
      const { taskId } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.taskId === taskId);
      if (taskIndex !== -1) {
        state.tasks.splice(taskIndex, 1);
      }
    }
  }
});

export default taskSlice.reducer;

export const { addTask, updateTask, deleteTask } = taskSlice.actions;
