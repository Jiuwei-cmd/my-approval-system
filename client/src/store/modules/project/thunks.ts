import { fetchApprovalListAPI, type ApprovalListParams } from '@/services/project';
import type { Dispatch } from 'redux';
import type { RootState } from '@/store';
import { setProjectList, setLoading, setQueryParams } from '../projectStore';

const fetchProjectList = (params?: ApprovalListParams) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setLoading(true));
    if (params?.currentPage) {
      dispatch(setQueryParams({
        ...getState().approval.queryParams,
        currentPage: params.currentPage,
      }));
    } else {
      dispatch(setQueryParams(params));
    }
    const res = await fetchApprovalListAPI(getState().approval.queryParams);
    console.log(res.data.list.length)
    dispatch(setProjectList(res.data));
    dispatch(setLoading(false));
  };
};

export { fetchProjectList };