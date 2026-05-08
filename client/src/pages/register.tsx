import { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { getErrorMessage } from '../api/todos';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { fullName: string; email: string; password: string }) => {
    try {
      setLoading(true);
      await authApi.register(values);
      message.success('Dang ky thanh cong. Hay dang nhap.');
      navigate('/login');
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-label="Todo Admin">
        <div className="auth-brand">
          <div className="auth-mark">TD</div>
          <div>
            <Title level={1} className="auth-brand-title">
              TODO ADMIN
            </Title>
            <Text className="auth-brand-text">
              Tao tai khoan de luu todo rieng cua ban va dong bo danh sach theo nguoi dung.
            </Text>
          </div>
        </div>
      </section>

      <section className="auth-form-wrap">
        <Card className="auth-card">
          <div className="auth-card-header">
            <Title level={2}>Dang ky</Title>
            <Text type="secondary">Tao tai khoan moi chi trong vai giay.</Text>
          </div>

          <Form onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="fullName"
              label="Ho va ten"
              rules={[{ required: true, message: 'Vui long nhap ho ten' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nguyen Van A" autoComplete="name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui long nhap email' },
                { type: 'email', message: 'Email khong hop le' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="email@example.com" autoComplete="email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mat khau"
              rules={[
                { required: true, message: 'Vui long nhap mat khau' },
                { min: 6, message: 'Mat khau toi thieu 6 ky tu' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Toi thieu 6 ky tu" autoComplete="new-password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading} className="auth-submit">
              Dang ky
            </Button>

            <div className="auth-switch">
              <Text type="secondary">Da co tai khoan?</Text>
              <Button type="link" onClick={() => navigate('/login')}>
                Dang nhap
              </Button>
            </div>
          </Form>
        </Card>
      </section>
    </main>
  );
};

export default RegisterPage;
