import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  isLoggedIn: false
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    signUp: (state, action) => {
      state.users.push(action.payload);
    },
    signIn: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    }
  }
});

export default userSlice.reducer;

export const { signUp, logout, signIn } = userSlice.actions;
