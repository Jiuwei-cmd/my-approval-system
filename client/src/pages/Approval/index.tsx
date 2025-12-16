import './index.css'
import Navbar from '../../components/Navbar';
import Filter from './components/Filter';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import List from './components/List';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';



const Approval = () => {
  const navigate = useNavigate();
  const currentRole = useSelector((state: RootState) => state.user.userInfo); // 从 Redux 状态中获取当前角色
  return (
    <div className='content'>
      {/* 导航栏 */}
      <Navbar />
      {/* 筛选器 */}
      <Filter />
      {/* 新建 */}
      {currentRole === '申请人' && (
        <Button
          onClick={() => navigate('/apply')}
          type="primary" htmlType="submit"
          style={{ width: 150 }}>
          新建
        </Button>
      )}
      {/* 审批列表 */}
      <List />
    </div>
  );
};

export default Approval;