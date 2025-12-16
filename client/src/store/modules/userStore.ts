import { createSlice } from '@reduxjs/toolkit';

const userStore = createSlice({
  name: 'user',
  initialState: {
    userInfo: '申请人',
    prevRole: '申请人',
  },
  reducers: {
    setUserInfo(state, action) {
      state.prevRole = state.userInfo;
      state.userInfo = action.payload;
    },
    setPrevRole(state, action) {
      state.prevRole = action.payload;
    },
  },
});

export const { setUserInfo, setPrevRole } = userStore.actions;
export default userStore.reducer;