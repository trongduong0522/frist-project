import { useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Avatar, Badge, Layout, Menu, Typography, Breadcrumb, Button } from 'antd';
import {
  BellOutlined,
  DashboardOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { Toaster } from 'react-hot-toast';
// import { useTranslation } from 'react-i18next'; // Hook đa ngôn ngữ
import 'antd/dist/reset.css';
import './App.css';

// Các trang (Pages)
import AddTodoPage from './pages/add';
import EditTodoPage from './pages/edit';
import ListTodoPage from './pages/list';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  // const { t } = useTranslation(); // Hàm dịch t('key')

  // Tự động xác định menu nào đang active dựa trên đường dẫn URL
  const selectedKey = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/todos')) return 'todos';
    if (path === '/dashboard') return 'dashboard';
    return 'todos'; // Mặc định
  }, [location.pathname]);

  // Tạo danh sách menu (Items)
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">{('Thống kê')}</Link>,
    },
    {
      key: 'todos',
      icon: <UnorderedListOutlined />,
      label: <Link to="/todos">{('Quản lý Todo')}</Link>,
    },
    {
      key: 'account',
      icon: <UserOutlined />,
      label: <Link to="/account">{('Tài khoản')}</Link>,
    },
    {
      key: 'setting',
      icon: <SettingOutlined />,
      label: <Link to="/setting">{('Cài đặt')}</Link>,
    },
  ];

  return (
    <Layout className="app-shell">
      <Toaster position="top-right" />
      
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        className="app-sidebar"
        breakpoint="lg" // Tự ẩn trên mobile
        collapsedWidth="0" // Chiều rộng khi ẩn hẳn là 0
      >
        <div className="app-logo">
          {collapsed ? 'TD' : 'TODO ADMIN'}
        </div>
        <Menu
          theme="light"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Nút đóng mở nhanh sidebar */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="mobile-toggle"
            />
            <Text strong style={{ fontSize: '18px' }}>Todo App</Text>
          </div>

          <div className="app-header-actions">
            <Badge dot color="blue">
              <BellOutlined className="app-header-icon" />
            </Badge>
            <div className="app-user">
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
              <span className="user-name">Dương Trọng</span>
            </div>
          </div>
        </Header>

        <Content className="app-content">
          <div className="app-content-inner">
            {/* Thêm Breadcrumb cho chuyên nghiệp */}
            <Breadcrumb style={{ marginBottom: '16px' }}>
              <Breadcrumb.Item>Admin</Breadcrumb.Item>
              <Breadcrumb.Item>
                {location.pathname.includes('add') ? 'Thêm mới' : 
                 location.pathname.includes('edit') ? 'Chỉnh sửa' : 'Danh sách'}
              </Breadcrumb.Item>
            </Breadcrumb>

            <Routes>
              <Route path="/" element={<Navigate to="/todos" replace />} />
              <Route path="/todos" element={<ListTodoPage />} />
              <Route path="/todos/add" element={<AddTodoPage />} />
              <Route path="/todos/:id/edit" element={<EditTodoPage />} />
              {/* Route cho trang thống kê (nếu bạn làm sau này) */}
              <Route path="/dashboard" element={<div className="p-4">Trang thống kê</div>} />
              <Route path="*" element={<Navigate to="/todos" replace />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;