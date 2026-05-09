import { useState } from 'react';
import { Button, Card, Divider, Form, Input, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { authApi, getErrorMessage } from '../api/todos';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const res = await authApi.login(values);

      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));

      message.success('Dang nhap thanh cong');
      navigate('/todos');
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential?: string) => {
    if (!credential) {
      message.error('Khong nhan duoc credential tu Google');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.googleLogin(credential);

      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));

      message.success('Dang nhap Google thanh cong');
      navigate('/todos');
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
              Quan ly cong viec trong mot bang dieu khien gon gang.
            </Text>
          </div>
        </div>
      </section>

      <section className="auth-form-wrap">
        <Card className="auth-card">
          <div className="auth-card-header">
            <Title level={2}>Dang nhap</Title>
            <Text type="secondary">Nhap email va mat khau de tiep tuc.</Text>
          </div>

          <Form form={form} onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui long nhap email' },
                { type: 'email', message: 'Email khong hop le' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="email@example.com" autoComplete="email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mat khau"
              rules={[{ required: true, message: 'Vui long nhap mat khau' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhap mat khau" autoComplete="current-password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading} className="auth-submit">
              Dang nhap
            </Button>

            <Divider plain>hoac</Divider>

            <GoogleLogin
              onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse.credential)}
              onError={() => message.error('Dang nhap Google that bai')}
              width="100%"
            />

            <div className="auth-switch">
              <Text type="secondary">Chua co tai khoan?</Text>
              <Button type="link" onClick={() => navigate('/register')}>
                Dang ky ngay
              </Button>
            </div>
          </Form>
        </Card>
      </section>
    </main>
  );
};

export default LoginPage;
