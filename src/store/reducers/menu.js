import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openItem: ['dashboard'],
  drawerOpen: false
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },
    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    }
  }
});

export default menuSlice.reducer;

export const { activeItem, openDrawer } = menuSlice.actions;
