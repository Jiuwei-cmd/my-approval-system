import './index.css';
import { HomeOutlined, UserOutlined, ScanOutlined, DownOutlined } from '@ant-design/icons';
import { Breadcrumb, Avatar, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { useLocation } from 'react-router-dom'; //  添加 useLocation
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '@/store/modules/userStore';
import type { RootState } from '@/store';


const roleOptions = [
  { key: 'approval-admin', label: '申请人' },
  { key: 'apply-admin', label: '审批员' },
];

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch(); // 添加 useDispatch
  const currentPath = location.pathname;
  const breadcrumbTitle = currentPath === '/apply' ? '审批申请页' : '审批查询页';
  const currentRole = useSelector((state: RootState) => state.user.userInfo); // 从 Redux 状态中获取当前角色

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const selected = roleOptions.find(r => r.key === key);
    if (selected) {
      dispatch(setUserInfo(selected.label)); //  Dispatch 到 Redux 状态中更新当前角色
    }
  };

  const items: MenuProps['items'] = roleOptions
    .filter(role => role.label !== currentRole)
    .map(role => ({
      key: role.key,
      label: role.label,
    }));


  return (
    <div className='navbar'>
      <div className='navbar-left'>
        <Breadcrumb
          items={[
            { title: <HomeOutlined /> },
            {
              title: (
                <>
                  <UserOutlined />
                  <span>审批系统</span>
                </>
              ),
            },
            { title: breadcrumbTitle },
          ]}
        />
      </div>
      <div className='navbar-right'>
        <ScanOutlined style={{ fontSize: 24 }} />
        <Avatar size={25} style={{ backgroundColor: '#87d068', marginLeft: 12 }} icon={<UserOutlined />} />
        <Dropdown
          menu={{
            items,
            onClick: handleMenuClick, // 绑定点击事件
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space style={{ marginLeft: 12 }}>
              {currentRole} {/* 动态显示当前角色 */}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;