// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: [],
  reducers: {
    setUser: (state, action) => {     
      state.push(action?.payload[0])
    },
    clearUser: () => { return []},
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
