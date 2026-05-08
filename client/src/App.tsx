import { useMemo, useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, message } from 'antd';
import {
  DashboardOutlined, SettingOutlined, UnorderedListOutlined,
  UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined,
  SunOutlined, MoonOutlined, LogoutOutlined,
} from '@ant-design/icons';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ConfigProvider, theme } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

// Import các trang
import AddTodoPage from './pages/add';
import EditTodoPage from './pages/edit';
import ListTodoPage from './pages/list';
import LoginPage from './pages/login'; 
import RegisterPage from './pages/register';
import DashboardPage from './pages/dashboard';
import AccountPage from './pages/account';
import SettingsPage from './pages/settings';

const { Header, Sider, Content } = Layout;

// ===== COMPONENT BẢO VỆ ROUTE =====
const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const token = localStorage.getItem('token');
  // Nếu không có token, chuyển hướng về trang login
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  // ===== THÔNG TIN USER =====
  const user = useMemo(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }, [location.pathname]); // Cập nhật lại khi chuyển trang

  // ===== DARK MODE =====
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // ===== LANGUAGE =====
  const [lang, setLang] = useState<string>(() => {
    return localStorage.getItem('language') || 'vi';
  });

  const toggleLang = () => {
    const newLang = lang === 'vi' ? 'en' : 'vi';
    setLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  // ===== LOGOUT =====
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success(t('auth.logout_success') || 'Đã đăng xuất');
    navigate('/login');
  };

  const selectedKey = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/todos')) return 'todos';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/account') return 'account';
    if (path === '/setting') return 'setting';
    return 'todos';
  }, [location.pathname]);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">{t('menu.dashboard')}</Link>,
    },
    {
      key: 'todos',
      icon: <UnorderedListOutlined />,
      label: <Link to="/todos">{t('menu.todos')}</Link>,
    },
    // {
    //   key: 'account',
    //   icon: <UserOutlined />,
    //   label: <Link to="/account">{t('menu.account')}</Link>,
    // },
    {
      key: 'setting',
      icon: <SettingOutlined />,
      label: <Link to="/setting">{t('menu.setting')}</Link>,
    },
  ];

  const getBreadcrumb = () => {
    if (location.pathname === '/dashboard') return t('menu.dashboard');
    if (location.pathname === '/account') return t('menu.account');
    if (location.pathname === '/setting') return t('menu.setting');
    if (location.pathname.includes('add')) return t('breadcrumb.add');
    if (location.pathname.includes('edit')) return t('breadcrumb.edit');
    return t('breadcrumb.list');
  };

  // Menu cho Avatar Dropdown
  const userMenu = {
    items: [
      { key: 'profile', label: t('menu.account'), icon: <UserOutlined />, onClick: () => navigate('/account') },
      { type: 'divider' as const },
      { key: 'logout', label: t('auth.logout'), icon: <LogoutOutlined />, onClick: handleLogout, danger: true },
    ],
  };

  return (
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Layout className="app-shell">
        <Toaster position="top-center" />

        {/* Chỉ hiện Sidebar nếu không phải ở trang Login/Register */}
        {!isAuthPage && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme={isDark ? 'dark' : 'light'}
            className="app-sidebar"
            breakpoint="lg"
            collapsedWidth="0"
          >
            <div className="app-logo">
              {collapsed ? 'TD' : 'TODO ADMIN'}
            </div>
            <Menu
              theme={isDark ? 'dark' : 'light'}
              selectedKeys={[selectedKey]}
              mode="inline"
              items={menuItems}
            />
          </Sider>
        )}

        <Layout>
          {/* Chỉ hiện Header nếu không phải ở trang Login/Register */}
          {!isAuthPage && (
            <Header className="app-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  className="mobile-toggle"
                />
                <div className="app-header-left">
                  <span className="app-header-title">{t('header.title')}</span>
                  <span className="app-header-breadcrumb">
                    {t('breadcrumb.admin')} / {getBreadcrumb()}
                  </span>
                </div>
              </div>

              <div className="app-header-actions">
                <Button
                  className="app-header-icon-btn"
                  onClick={toggleLang}
                  style={{ fontWeight: 600, fontSize: '12px', width: 'auto', padding: '0 10px' }}
                >
                  {lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
                </Button>

                <Button
                  className="app-header-icon-btn"
                  icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                  onClick={() => setIsDark(!isDark)}
                />

                <Dropdown menu={userMenu} placement="bottomRight" arrow>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginLeft: '8px' }}>
                    <Avatar
                      size={34}
                      icon={<UserOutlined />}
                      style={{
                        background: isDark ? 'transparent' : '#eef0ff',
                        color: isDark ? '#a855f7' : '#6366f1',
                        border: isDark ? '1.5px solid #a855f7' : '1.5px solid #818cf8',
                      }}
                    />
                    <span className="user-name-header">{user?.fullName || 'User'}</span>
                  </div>
                </Dropdown>
              </div>
            </Header>
          )}

          <Content className={isAuthPage ? 'auth-content' : 'app-content'}>
            <div className="app-content-inner">
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* PRIVATE ROUTES (Cần đăng nhập) */}
                <Route path="/" element={<PrivateRoute><Navigate to="/todos" replace /></PrivateRoute>} />
                <Route path="/todos" element={<PrivateRoute><ListTodoPage /></PrivateRoute>} />
                <Route path="/todos/add" element={<PrivateRoute><AddTodoPage /></PrivateRoute>} />
                <Route path="/todos/:id/edit" element={<PrivateRoute><EditTodoPage /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
                <Route path="/setting" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
                
                <Route path="*" element={<Navigate to="/todos" replace />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
