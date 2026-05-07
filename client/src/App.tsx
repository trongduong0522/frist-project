import { useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Avatar, Badge, Layout, Menu, Typography } from 'antd';
import {
  BellOutlined,
  DashboardOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Toaster } from 'react-hot-toast';
import 'antd/dist/reset.css';
import './App.css';
import AddTodoPage from './pages/add';
import EditTodoPage from './pages/edit';
import ListTodoPage from './pages/list';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const selectedKey = useMemo(() => {
    if (location.pathname.includes('/add')) {
      return 'add';
    }

    return 'todos';
  }, [location.pathname]);

  return (
    <Layout className="app-shell">
      <Toaster />
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        className="app-sidebar"
      >
        <div className="app-logo">{collapsed ? 'TD' : 'TODO ADMIN'}</div>
        <Menu
          theme="light"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={[
            {
              key: 'todos',
              icon: <UnorderedListOutlined />,
              label: <Link to="/todos">Quan ly Todo</Link>,
            },
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Thong ke' },
            { key: 'account', icon: <UserOutlined />, label: 'Tai khoan' },
            { key: 'setting', icon: <SettingOutlined />, label: 'Cai dat' },
          ]}
        />
      </Sider>

      <Layout>
        <Header className="app-header">
          <div>
            <Text strong>Todo-list</Text>
          </div>
          <div className="app-header-actions">
            <Badge >
              <BellOutlined className="app-header-icon" />
            </Badge>
            <div className="app-user">
              <Avatar icon={<UserOutlined />} />
              <span>Trong Duong</span>
            </div>
          </div>
        </Header>

        <Content className="app-content">
          <div className="app-content-inner">
            <Routes>
              <Route path="/" element={<Navigate to="/todos" replace />} />
              <Route path="/todos" element={<ListTodoPage />} />
              <Route path="/todos/add" element={<AddTodoPage />} />
              <Route path="/todos/:id/edit" element={<EditTodoPage />} />
              <Route path="*" element={<Navigate to="/todos" replace />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
