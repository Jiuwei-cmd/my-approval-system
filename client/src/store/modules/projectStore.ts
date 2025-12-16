import { createSlice } from '@reduxjs/toolkit';
import { type ApprovalListParams, type ApprovalListResponse } from '@/services/project';
export interface ApprovalItem {
  key: number;
  status: string;
  createTime: string;
  approvalTime: string;
  approvalItem: string;
  approvalDepartment: string;
}

const projectStore = createSlice({
  name: 'project',
  initialState: {
    projectListResponse: {} as ApprovalListResponse,
    loading: false,
    queryParams: {} as ApprovalListParams,
    currentPage: 1,
  },
  reducers: {
    setProjectList(state, action) {
      state.projectListResponse = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setQueryParams(state, action) {
      state.queryParams = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
});

// 异步请求部分
const { setProjectList, setLoading, setQueryParams, setCurrentPage } = projectStore.actions;

export { setCurrentPage, setProjectList, setLoading, setQueryParams };

export default projectStore.reducer;