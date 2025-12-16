
/**
 * 审批状态枚举（用于逻辑判断和类型约束）
 */
export enum ApprovalStatus {
  ALL = 'all',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

// 导出所有状态值
export const APPROVAL_STATUS_OPTIONS = [
  { value: ApprovalStatus.ALL, label: '全部' },
  { value: ApprovalStatus.PENDING, label: '待审批' },
  { value: ApprovalStatus.APPROVED, label: '已审批' },
  { value: ApprovalStatus.REJECTED, label: '已拒绝' },
  { value: ApprovalStatus.WITHDRAWN, label: '已撤回' },
]