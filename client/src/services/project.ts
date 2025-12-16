import request from '@/utils/request';

export interface FileItem {
  uid: string;
  name: string;
  status: 'uploading' | 'done' | 'error';
  url?: string;
}

export interface ApprovalCommonFields {
  status?: string;
  approvalItem?: string;
  approvalDepartment?: string;
}

export interface ApprovalItem extends ApprovalCommonFields {
  key?: number;
  createTime?: string;
  approvalTime?: string;
  approvalContent?: string;
  executionTime?: string;
  fileList?: FileItem[];
  excelFile?: FileItem;
}

export interface ApprovalListResponse {
  total: number;
  currentPage: number;
  pageSize: number;
  list: ApprovalItem[];
}

export type ApprovalListParams = ApprovalCommonFields & {
  createTimeStart?: string;
  createTimeEnd?: string;
  approvalTimeStart?: string;
  approvalTimeEnd?: string;
  currentPage?: number;
}

export interface Data<T> {
  code: number;
  msg: string;
  data: T;
}

// 获取项目列表
export function fetchApprovalListAPI(params?: ApprovalListParams) {
  return request<ApprovalListResponse>({
    url: '/get',
    method: 'get',
    params
  });
}

// 获取审批单详情
export function fetchApprovalDetailAPI(key: number) {
  return request<ApprovalItem>({
    url: '/getDetail',
    method: 'get',
    params: { key }
  });
}

// 修改审批单
export function updateApprovalAPI(key: number, params: ApprovalItem) {
  return request({
    url: '/update',
    method: 'put',
    params: { key },
    data: params
  });
}

// 新建审批单
export function createApprovalAPI(params: ApprovalItem) {
  return request({
    url: '/create',
    method: 'post',
    data: params
  });
}

// 撤回审批单
export function withdrawApprovalAPI(key: number) {
  return request({
    url: '/withdraw',
    method: 'put',
    params: { key }
  });
}

// 处理审批单
export function handleApprovalAPI(params: { key: number; status: string }) {
  return request({
    url: '/handle',
    method: 'post',
    data: params,
  });
}