import { Card, Divider, Radio, Space, Switch, Typography, message } from 'antd';
import { MoonOutlined, TranslationOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const SettingsPage = () => {
  const currentTheme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  const currentLanguage = localStorage.getItem('language') || 'vi';

  const updateTheme = (checked: boolean) => {
    localStorage.setItem('theme', checked ? 'dark' : 'light');
    message.success('Da luu giao dien');
    window.location.reload();
  };

  const updateLanguage = (language: string) => {
    localStorage.setItem('language', language);
    message.success('Da luu ngon ngu');
    window.location.reload();
  };

  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Card className="page-card">
        <Title level={3}>Cai dat</Title>
        <Text type="secondary">Tuy chinh giao dien va ngon ngu hien thi cua ung dung.</Text>
      </Card>

      <Card className="page-card" title="Giao dien">
        <Space direction="vertical" size={16} className="page-stack">
          <div className="settings-row">
            <Space>
              <MoonOutlined />
              <div>
                <Text strong>Dark mode</Text>
                <div>
                  <Text type="secondary">Doi mau nen va mau chu cua bang dieu khien.</Text>
                </div>
              </div>
            </Space>
            <Switch defaultChecked={currentTheme === 'dark'} onChange={updateTheme} />
          </div>
        </Space>
      </Card>

      <Card className="page-card" title="Ngon ngu">
        <Space direction="vertical" size={16} className="page-stack">
          <Space>
            <TranslationOutlined />
            <Text type="secondary">Chon ngon ngu mac dinh cho menu va noi dung.</Text>
          </Space>
          <Divider className="settings-divider" />
          <Radio.Group
            value={currentLanguage}
            onChange={(event) => updateLanguage(event.target.value)}
            optionType="button"
            buttonStyle="solid"
            options={[
              { label: 'VI', value: 'vi' },
              { label: 'EN', value: 'en' },
            ]}
          />
        </Space>
      </Card>
    </Space>
  );
};

export default SettingsPage;
