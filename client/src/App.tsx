import { useMemo, useState, useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Button, Avatar } from 'antd';
import {
  DashboardOutlined, SettingOutlined, UnorderedListOutlined,
  UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined,
  SunOutlined, MoonOutlined, BellOutlined,
} from '@ant-design/icons';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ConfigProvider, theme } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

import AddTodoPage from './pages/add';
import EditTodoPage from './pages/edit';
import ListTodoPage from './pages/list';

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

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

  const selectedKey = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/todos')) return 'todos';
    if (path === '/dashboard') return 'dashboard';
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
    {
      key: 'account',
      icon: <UserOutlined />,
      label: <Link to="/account">{t('menu.account')}</Link>,
    },
    {
      key: 'setting',
      icon: <SettingOutlined />,
      label: <Link to="/setting">{t('menu.setting')}</Link>,
    },
  ];

  const getBreadcrumb = () => {
    if (location.pathname.includes('add')) return t('breadcrumb.add');
    if (location.pathname.includes('edit')) return t('breadcrumb.edit');
    return t('breadcrumb.list');
  };

  return (
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Layout className="app-shell">
        <Toaster position="top-center" />

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

        <Layout>
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

            {/* Action buttons */}
            <div className="app-header-actions">
              {/* Nút chuyển ngôn ngữ */}
              <Button
                className="app-header-icon-btn"
                onClick={toggleLang}
                title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
                style={{ fontWeight: 600, fontSize: '12px', width: 'auto', padding: '0 10px' }}
              >
                {lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
              </Button>

              {/* Nút dark mode */}
              <Button
                className="app-header-icon-btn"
                icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                onClick={() => setIsDark(!isDark)}
              />

              <Button className="app-header-icon-btn" icon={<BellOutlined />} />

              <Avatar
                size={34}
                icon={<UserOutlined />}
                style={{
                  background: isDark ? 'transparent' : '#eef0ff',
                  color: isDark ? '#a855f7' : '#6366f1',
                  border: isDark ? '1.5px solid #a855f7' : '1.5px solid #818cf8',
                  cursor: 'pointer',
                }}
              />
            </div>
          </Header>

          <Content className="app-content">
            <div className="app-content-inner">
              <Routes>
                <Route path="/" element={<Navigate to="/todos" replace />} />
                <Route path="/todos" element={<ListTodoPage />} />
                <Route path="/todos/add" element={<AddTodoPage />} />
                <Route path="/todos/:id/edit" element={<EditTodoPage />} />
                <Route path="/dashboard" element={<div style={{ padding: 24 }}>Dashboard</div>} />
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