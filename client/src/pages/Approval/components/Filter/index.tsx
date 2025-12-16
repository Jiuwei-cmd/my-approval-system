import './index.css'
import { Form, Select, DatePicker, Input, Cascader, Button } from 'antd';
import { useEffect } from 'react';
import type { Dayjs } from 'dayjs';
import type { RootState, AppDispatch } from '@/store';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage } from '@/store/modules/projectStore';
import { fetchProjectList } from '@/store/modules/project/thunks';
import { options } from '@/constants/departments';
import { ApprovalStatus, APPROVAL_STATUS_OPTIONS } from '@/constants/approvalStatus';

const { RangePicker } = DatePicker;

interface FormValues {
  status: string | null;
  createTime: [Dayjs | null, Dayjs | null] | null;
  approvalTime: [Dayjs | null, Dayjs | null] | null;
  project: string | null;
  department: string[] | null;
}

// 格式化 RangePicker 值为字符串数组
const formatRangePickerValue = (range: [Dayjs | null, Dayjs | null] | null): [string, string] | null => {
  if (!range || !range[0] || !range[1]) {
    return null;
  }
  return [
    range[0].format('YYYY-MM-DD HH:mm:ss'),
    range[1].format('YYYY-MM-DD HH:mm:ss')
  ];
};

const Filter = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const currentRole = useSelector((state: RootState) => state.user.userInfo); // 从 Redux 状态中获取当前角色

  useEffect(() => {
    form.resetFields();
    if (currentRole === '审批员') {
      form.setFieldsValue({ status: APPROVAL_STATUS_OPTIONS[1].value });
      dispatch(fetchProjectList({ status: ApprovalStatus.PENDING }));
    } else {
      form.setFieldsValue({ status: APPROVAL_STATUS_OPTIONS[0].value });
      dispatch(fetchProjectList());
    }
  }, [dispatch, currentRole, form]);

  const onFinish = async (values: FormValues) => {
    console.log('values', values);
    const { status, createTime, approvalTime, project, department } = values;
    // 格式化时间范围
    const formattedCreateTime = formatRangePickerValue(createTime);
    const formattedApprovalTime = formatRangePickerValue(approvalTime);

    // 构造最终请求参数
    const queryParams = {
      status: status || undefined,
      approvalItem: project || undefined,
      approvalDepartment: department?.length ? department.join('/') : undefined, // 或按需处理层级
      ...(formattedCreateTime && {
        createTimeStart: formattedCreateTime[0],
        createTimeEnd: formattedCreateTime[1],
      }),
      ...(formattedApprovalTime && {
        approvalTimeStart: formattedApprovalTime[0],
        approvalTimeEnd: formattedApprovalTime[1],
      }),
    };
    console.log('queryParams', queryParams);
    // 重置分页为第一页
    dispatch(setCurrentPage(1));
    // 发起异步请求
    dispatch(fetchProjectList(queryParams));
  };

  const clear = () => {
    form.resetFields();
    // 重置分页为第一页
    dispatch(setCurrentPage(1));
    if (currentRole === '审批员') {
      form.setFieldsValue({ status: APPROVAL_STATUS_OPTIONS[1].value });
      dispatch(fetchProjectList({ status: ApprovalStatus.PENDING }));
    } else {
      form.setFieldsValue({ status: APPROVAL_STATUS_OPTIONS[0].value });
      dispatch(fetchProjectList());
    }

  }


  return (
    <div className='filter'>
      <Form
        name="layout-multiple-horizontal"
        layout="horizontal"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item layout="vertical" label="审批状态" name="status">
          <Select
            style={{ width: 180 }}
            options={currentRole === '审批员'
              ? [APPROVAL_STATUS_OPTIONS[1]]
              : APPROVAL_STATUS_OPTIONS
            }
          />
        </Form.Item>
        <Form.Item layout="vertical" label="创建时间" name="createTime">
          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>
        {currentRole !== '审批员' && (
          <Form.Item layout="vertical" label="审批时间" name="approvalTime">
            <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
        )}
        <Form.Item layout="vertical" label="审批项目" name="project">
          <Input style={{ width: 300 }} />
        </Form.Item>
        <Form.Item layout="vertical" label="申请部门" name="department">
          <Cascader options={options} changeOnSelect style={{ width: 372 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 12 }}>
            查询
          </Button>
          <Button onClick={clear}>
            清空已选
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Filter;