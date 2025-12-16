import { useState, useEffect } from 'react';
import { Space, Table, Button, Tag, Drawer, Form, Input, Spin, Popconfirm, message } from 'antd';
import type { TableProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import './index.css'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '@/store/modules/projectStore';
import { fetchProjectList } from '@/store/modules/project/thunks';
import type { RootState, AppDispatch } from '@/store';
import { fetchApprovalDetailAPI, handleApprovalAPI, withdrawApprovalAPI } from '@/services/project';
import { ApprovalStatus } from '@/constants/approvalStatus';
import type { FileItem } from '@/services/project';
import { LoadingImage } from '../LoadingImage';
import { setPrevRole } from '@/store/modules/userStore';

// 复用mock中的接口类型
interface ApprovalItem {
  key: number;
  status: string;
  createTime: string;
  approvalTime: string;
  approvalItem: string;
  approvalDepartment: string;
  approvalContent: string;
  executionTime: string;
}
const List = () => {
  const dispatch = useDispatch<AppDispatch>();
  // 抽屉状态
  const [open, setOpen] = useState(false);
  // 抽屉大小
  const [size, setSize] = useState(500);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [excelFile, setExcelFile] = useState<FileItem | null>(null);

  const { projectListResponse, loading, currentPage } = useSelector((state: RootState) => state.approval);
  const { userInfo: currentRole, prevRole } = useSelector((state: RootState) => state.user); // 从 Redux 状态中获取当前角色


  useEffect(() => {
    console.log(prevRole, currentRole);
    // 判断是否是 currentRole 发生了变化
    const roleChanged = prevRole !== currentRole;

    // 如果角色变了，强制使用第 1 页
    const pageToUse = roleChanged ? 1 : currentPage;

    // 更新 ref
    // prevRoleRef.current = currentRole;
    dispatch(setPrevRole(currentRole));

    // 安全校验
    if (!currentRole || pageToUse < 1) return;

    // 构造参数
    const params = currentRole === '审批员'
      ? { status: ApprovalStatus.PENDING, currentPage: pageToUse }
      : { currentPage: pageToUse };
    // 如果角色变了，也要同步更新全局 currentPage 状态（可选，如果你有 UI 显示页码）
    if (roleChanged && pageToUse !== currentPage) {
      dispatch(setCurrentPage(pageToUse));
    }

    dispatch(fetchProjectList(params));


  }, [dispatch, currentRole, currentPage]);

  // 处理查看或审批
  const handleViewOrApprove = async (key: number) => {
    form.setFieldsValue({ key });
    const res = await fetchApprovalDetailAPI(key);
    form.setFieldsValue(res.data);
    setFileList(res.data.fileList || []);
    setExcelFile(res.data.excelFile || null);
    setOpen(true);
  };

  // 处理通过审批和修改申请
  const passApproval = async () => {
    const wasLastItemOnPage = projectListResponse.list.length === 1;
    if (currentRole === '审批员') {
      await handleApprovalAPI({
        key: form.getFieldValue('key'),
        status: ApprovalStatus.APPROVED,
      });
      message.success('审批通过');
      setOpen(false);
      let newPage = currentPage;
      if (wasLastItemOnPage && currentPage > 1) {
        newPage = currentPage - 1; // 跳回上一页
      }
      // 刷新列表
      setTimeout(() => {
        dispatch(setCurrentPage(newPage));
        dispatch(fetchProjectList({ status: ApprovalStatus.PENDING, currentPage: newPage }));
      }, 1000);
    } else {
      navigate(`/apply?key=${form.getFieldValue('key')}`)
    }
  };

  // 处理驳回审批和撤回申请
  const rejectApproval = async () => {
    if (currentRole === '审批员') {
      const wasLastItemOnPage = projectListResponse.list.length === 1;
      await handleApprovalAPI({
        key: form.getFieldValue('key'),
        status: ApprovalStatus.REJECTED,
      });
      message.error('审批驳回');
      setOpen(false);
      let newPage = currentPage;
      if (wasLastItemOnPage && currentPage > 1) {
        newPage = currentPage - 1; // 跳回上一页
      }
      // 刷新列表
      setTimeout(() => {
        dispatch(fetchProjectList({ status: ApprovalStatus.PENDING, currentPage: newPage }));
        dispatch(setCurrentPage(newPage));
      }, 1000);
    } else {
      await withdrawApprovalAPI(form.getFieldValue('key'));
      // 刷新列表
      message.success('撤回成功');
      setOpen(false);
      setTimeout(() => {
        dispatch(fetchProjectList({ currentPage }));
        dispatch(setCurrentPage(currentPage));
      }, 1000);
    }
  };

  const columns: TableProps<ApprovalItem>['columns'] = [
    {
      title: '序号',
      width: 70, // 固定宽度
      rowScope: 'row',
      align: 'center', // 居中对齐
      render: (_, __, index) => index + 1, // 使用rowIndex实现自增序号
    },
    {
      title: '审批项目',
      dataIndex: 'approvalItem',
      key: 'approvalItem',
      width: 220, // 固定宽度
      ellipsis: true, // 超出显示省略号
      align: 'center', // 左对齐
    },
    {
      title: '申请部门',
      key: 'approvalDepartment',
      dataIndex: 'approvalDepartment',
      width: 240, // 固定宽度
      ellipsis: true, // 超出显示省略号
      align: 'center', // 左对齐
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center'
    },
    {
      title: '审批时间',
      dataIndex: 'approvalTime',
      key: 'approvalTime',
      align: 'center'
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      width: 100, // 固定宽度
      align: 'center', // 左对齐
      render: (text: string) => {
        let color = '';
        switch (text) {
          case 'approved':
            color = 'success'; // 绿色
            break;
          case 'pending':
            color = 'processing'; // 蓝色
            break;
          case 'rejected':
            color = 'error'; // 红色
            break;
          case 'withdrawn':
            color = 'default'; // 灰色
            break;
          default:
            color = 'default'; // 默认灰色
        }

        const statusMap: Record<string, string> = {
          approved: '已审批',
          pending: '待审批',
          rejected: '已拒绝',
          withdrawn: '已撤回',
        };
        return <Tag color={color}>{statusMap[text] || text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 130, // 固定宽度
      align: 'center', // 左对齐
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleViewOrApprove(record.key)}>{currentRole === '审批员' ? '审批' : '查看'}</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='list'>
      {/* 审批列表 */}
      <Spin spinning={loading} tip="加载中...">
        <Table<ApprovalItem>
          columns={columns}
          dataSource={projectListResponse.list as ApprovalItem[]}
          pagination={{
            pageSize: 6, // 每页显示6条数据
            current: currentPage,
            total: projectListResponse.total,
            onChange: (page) => {
              dispatch(setCurrentPage(page));
            },
            showTotal: () => ` 共 ${projectListResponse.total} 条`, // 显示总数和当前范围
          }}
        />
      </Spin>
      {/* 审批详情抽屉 */}
      <Drawer
        title={currentRole === '审批员' ? '审批详情' : '查看详情'}
        onClose={() => setOpen(false)}
        open={open}
        size={size}
        resizable={{
          onResize: (newSize) => setSize(newSize),
        }}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          disabled={true}
          style={{ maxWidth: 600 }}
          form={form}
        >
          <Form.Item label="项目" name="approvalItem">
            <Input />
          </Form.Item>
          <Form.Item label="审批内容" name="approvalContent">
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item label="申请部门" name="approvalDepartment">
            <Input />
          </Form.Item>
          <Form.Item label="创建时间" name="createTime">
            <Input />
          </Form.Item>
          <Form.Item label="执行日期" name="executionTime">
            <Input />
          </Form.Item>
          <Form.Item label="图片附件" name="fileList">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {/* 可能没有图片 */}
              {fileList.length === 0 ? (
                <div>无图片附件</div>
              ) : (
                fileList.map((item) => (
                  <LoadingImage key={item.uid} url={item.url!} uid={item.uid} />
                ))
              )}
            </div>
          </Form.Item>
          <Form.Item label="excel附件" name="fileList">
            <div>
              {excelFile ? (
                <a href={excelFile.url} download={excelFile.name}>{excelFile.name}</a>
              ) : (
                '无'
              )}
            </div>
          </Form.Item>
        </Form>
        <Button color="cyan" variant="solid" disabled={currentRole === '申请人' && (form.getFieldValue('status') === ApprovalStatus.APPROVED || form.getFieldValue('status') === ApprovalStatus.WITHDRAWN)} onClick={passApproval} style={{ marginRight: 20, marginLeft: 30 }}>
          {currentRole === '审批员' ? '通过' : '修改'}
        </Button>
        {currentRole === '审批员' ? (
          <Button color="danger" variant="solid" onClick={rejectApproval}>
            驳回
          </Button>
        ) : (
          <Popconfirm
            title="确认撤回吗？"
            okText="确认"
            cancelText="取消"
            onConfirm={rejectApproval}
          >
            <Button
              color="danger"
              variant="solid"
              disabled={currentRole === '申请人' && (form.getFieldValue('status') !== ApprovalStatus.PENDING)}
            >
              撤回
            </Button>
          </Popconfirm>
        )}
      </Drawer>
    </div>
  );
};

export default List;