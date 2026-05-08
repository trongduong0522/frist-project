import { useMemo } from 'react';
import { Avatar, Button, Card, Descriptions, Space, Typography, message } from 'antd';
import { LogoutOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

type StoredUser = {
  id?: string;
  _id?: string;
  fullName?: string;
  email?: string;
};

const AccountPage = () => {
  const navigate = useNavigate();

  const user = useMemo<StoredUser>(() => {
    try {
      return JSON.parse(localStorage.getItem('user') ?? '{}');
    } catch {
      return {};
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('Da dang xuat');
    navigate('/login');
  };

  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Card className="page-card account-hero">
        <Space size={16} align="center" wrap>
          <Avatar size={72} icon={<UserOutlined />} className="account-avatar" />
          <div>
            <Title level={3}>{user.fullName || 'Nguoi dung'}</Title>
            <Text type="secondary">{user.email || 'Chua co email'}</Text>
          </div>
        </Space>
      </Card>

      <Card className="page-card" title="Thong tin tai khoan">
        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
          <Descriptions.Item label="Ho va ten">
            <Space>
              <UserOutlined />
              {user.fullName || 'Chua cap nhat'}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <Space>
              <MailOutlined />
              {user.email || 'Chua cap nhat'}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="User ID" span={2}>
            {user.id || user._id || 'Khong co du lieu'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className="page-card" title="Bao mat">
        <Space direction="vertical" size={12}>
          <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Dang xuat
          </Button>
        </Space>
      </Card>
    </Space>
  );
};

export default AccountPage;
