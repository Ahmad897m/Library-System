import { createSlice } from '@reduxjs/toolkit';

const initialPassword = localStorage.getItem('password') || 'admin123';

const passwordSlice = createSlice({
  name: 'password',
  initialState: {
    value: initialPassword,
  },
  reducers: {
    changePassword: (state, action) => {
      state.value = action.payload;
      localStorage.setItem('password', action.payload);
    },
  },
});

export const { changePassword } = passwordSlice.actions;
export default passwordSlice.reducer;
