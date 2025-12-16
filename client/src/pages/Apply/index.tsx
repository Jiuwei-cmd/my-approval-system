import './index.css'
import { Form, Input, Cascader, DatePicker, Button, message, Upload, Image } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import type { Dayjs } from 'dayjs';
import Navbar from '@/components/Navbar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { createApprovalAPI, fetchApprovalDetailAPI, updateApprovalAPI, type FileItem } from '@/services/project';
import { options } from '@/constants/departments';
import TableExcel from './components/ExcelExport';



export interface FormValues {
  approvalItem: string;
  approvalContent: string;
  approvalDepartment: string[] | null;
  approvalDate: Dayjs | null;
}



type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Apply = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const [SearchKey, setSearchKey] = useState<number | null>(null);
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState<FormValues>({
    approvalItem: '',
    approvalContent: '',
    approvalDepartment: null,
    approvalDate: null,
  });
  const currentRole = useSelector((state: RootState) => state.user.userInfo);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [excelFile, setExcelFile] = useState<FileItem>();
  const [isReuploading, setIsReuploading] = useState(false);

  // 检查当前角色是否为审批员，如果是则跳转到审批列表页面
  useEffect(() => {
    if (currentRole && currentRole === '审批员') {
      message.info('审批员无权访问申请页面');
      setTimeout(() => {
        navigate('/approval');
      }, 1000);
    }
  }, [currentRole, navigate]);

  const onFinish = async (values: FormValues) => {
    console.log(values);
    if (fileList.length === 0) {
      message.error('请上传图片');
      return;
    }
    if (!excelFile) {
      message.error('请上传Excel文件');
      return;
    }
    const { approvalItem, approvalContent, approvalDepartment, approvalDate } = values;
    const queryParams = {
      approvalItem,
      approvalContent,
      approvalDepartment: approvalDepartment?.length ? approvalDepartment.join('/') : undefined,
      executionTime: approvalDate?.format('YYYY-MM-DD'),
      fileList: fileList,
      excelFile: excelFile,
    };
    if (SearchKey !== null) {
      await updateApprovalAPI(SearchKey!, queryParams);
      // 修改成功提示弹窗
      message.success('审批单更新成功');
      // 路由跳转到列表页，传递来源信息
      setTimeout(() => {
        navigate('/approval');
      }, 1000);
    } else {
      await createApprovalAPI(queryParams);
      message.success('审批单新建成功');
      setTimeout(() => {
        navigate('/approval');
      }, 1000);
    }
  };

  // 从URL参数中获取商品ID
  useEffect(() => {
    const key = searchParams.get('key')
    if (key) {
      setSearchKey(Number(key));
    }
  }, [searchParams])

  // 当SearchKey变化时，从服务器获取审批详情
  useEffect(() => {
    // 定义一个内部 async 函数
    const fetchData = async () => {
      if (SearchKey !== null) {
        // dispatch(fetchSelectedProject(SearchKey));
        const res = await fetchApprovalDetailAPI(SearchKey);
        console.log(res)
        setSearchItem({
          approvalItem: res.data.approvalItem!,
          approvalContent: res.data.approvalContent!,
          approvalDepartment: res.data.approvalDepartment!.split('/'),
          approvalDate: dayjs(res.data.executionTime),
        })
        setFileList(res.data.fileList || []);
        setExcelFile(res.data.excelFile || {} as FileItem);
      } else {
        setSearchItem({
          approvalItem: '',
          approvalContent: '',
          approvalDepartment: null,
          approvalDate: null,
        })
      }
    };
    // 调用它
    fetchData();
  }, [SearchKey]);

  // 把searchItem赋值给form
  useEffect(() => {
    form.setFieldsValue(searchItem);
  }, [searchItem, form]);



  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const beforeUpload = (file: FileType) => {
    // jpeg png gif bmp
    const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/jpg', 'image/webp'].includes(file.type)
    // 大小从B转换为MB
    const isLt2M = file.size / 1024 / 1024 < 8

    if (!isJPG) {
      message.error('上传头像图片只能是 JPG PNG GIF BMP JPG WEBP 格式!')
    }
    if (!isLt2M) {
      message.error('上传头像图片大小不能超过 8MB!')
    }
    return isJPG && isLt2M
  }

  // 通用上传函数：上传单个文件到 /api/upload，返回 { url: string }
  const uploadFileToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('上传请求失败');
    }

    const result = await res.json();
    if (!result.url) {
      throw new Error('服务器未返回文件地址');
    }

    return result.url;
  };

  const handleChange: UploadProps['onChange'] = async (e) => {
    const file = e.file.originFileObj;
    if (!file) return;

    // 添加 "uploading" 状态
    const tempUid = String(Date.now());
    const uploadingFile: FileItem = {
      uid: tempUid,
      name: file.name,
      status: 'uploading',
      url: '',
    };

    setFileList((prev) => [...prev, uploadingFile]);

    try {
      // 执行上传
      const url = await uploadFileToServer(file);

      // 上传成功：更新为 "done"
      setFileList((prev) =>
        prev.map((f) =>
          f.uid === tempUid
            ? { ...f, status: 'done', url }
            : f
        )
      );
    } catch (err) {
      // 上传失败：更新为 "error"
      setFileList((prev) =>
        prev.map((f) =>
          f.uid === tempUid
            ? { ...f, status: 'error' }
            : f
        )
      );
      message.error('图片上传失败：' + (err));
    }
  };
  const excelChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setExcelFile(undefined);
    setIsReuploading(true);

    const file = e.target.files?.[0];
    if (!file || !file.name.match(/\.(xlsx|xls)$/i)) {
      message.error('请选择 Excel 文件');
      setIsReuploading(false);
      return;
    }

    try {
      const url = await uploadFileToServer(file);
      const newFile: FileItem = {
        uid: String(Date.now()),
        name: file.name,
        status: 'done',
        url,
      };
      setExcelFile(newFile);
    } catch (err) {
      message.error('Excel 上传失败：' + (err));
    } finally {
      setIsReuploading(false);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className='apply'>
      <Navbar />
      <div className='apply-form'>
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Form.Item
            name='approvalItem'
            label='审批项目'
            rules={[
              { required: true, message: '请输入审批项目' },
              { max: 20, message: '审批项目不能超过20个字符' }
            ]}
          >
            <Input style={{ width: 372 }} />
          </Form.Item>
          <Form.Item
            name='approvalContent'
            label='审批内容'
            rules={[
              { required: true, message: '请输入审批内容' },
              { max: 300, message: '审批内容不能超过300个字符' }
            ]}
          >
            <TextArea rows={4} style={{ width: 372 }} />
          </Form.Item>
          <Form.Item
            name='approvalDepartment'
            label='申请部门'
            rules={[{ required: true, message: '请选择申请部门' }]}
          >
            <Cascader options={options} changeOnSelect style={{ width: 372 }} />
          </Form.Item>
          <Form.Item
            name='approvalDate'
            label='执行日期'
            rules={[{ required: true, message: '请选择执行日期' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="图片附件" valuePropName="fileList" >
            <Upload
              listType="picture-card"
              beforeUpload={beforeUpload}
              fileList={fileList as UploadFile[]}
              onPreview={handlePreview}
              onChange={handleChange}
              onRemove={(file) => {
                setFileList(fileList.filter((f) => f.uid !== file.uid));
              }}
            >
              {fileList.length >= 3 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                styles={{ root: { display: 'none' } }}
                preview={{
                  open: previewOpen,
                  onOpenChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
          <Form.Item label="表格附件" >
            <div style={{ fontSize: 12 }}>
              请根据<TableExcel ></TableExcel>格式上传内容
            </div>
            {/* 监听上传，拿到上传文件的对象 */}
            {(!excelFile || isReuploading) && (
              <input
                type="file"
                onChange={excelChange}
                style={{ marginTop: 8 }}
              />
            )}

            {excelFile && !isReuploading && (
              <div style={{ marginTop: 8, marginBottom: 8 }}>
                <span>当前文件：</span>
                <a href={excelFile.url} target="_blank" rel="noopener noreferrer">
                  {excelFile.name}
                </a>
                <Button
                  type="link"
                  size="small"
                  onClick={() => { setExcelFile(undefined); setIsReuploading(true) }}
                  style={{ marginLeft: 8 }}
                >
                  （重新上传）
                </Button>
              </div>
            )}

          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 12 }}>
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Apply;