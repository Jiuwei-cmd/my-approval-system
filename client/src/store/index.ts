import { configureStore } from '@reduxjs/toolkit';
import approvalReducer from './modules/projectStore';
import userReducer from './modules/userStore';

const store = configureStore({
  reducer: {
    approval: approvalReducer,
    user: userReducer,
  },
});

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;