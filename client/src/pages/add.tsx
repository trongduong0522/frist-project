import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Checkbox, Form, Input, Select, Space, Typography } from 'antd';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { getErrorMessage, todoApi } from '../api/todos';
import type { TodoPayload } from '../api/todos';

const { Title } = Typography;

const AddTodoPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: TodoPayload) => {
    try {
      setSubmitting(true);
      await todoApi.create({
        title: values.title.trim(),
        description: values.description?.trim() ?? '',
        completed: Boolean(values.completed),
        priority: values.priority,
      });
      toast.success(t('add.toast_success'));
      navigate('/todos');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      className="page-card todo-form-card"
      title={
        <Space direction="vertical" size={0}>
          <Title level={3}>{t('add.title')}</Title>
        </Space>
      }
    >
      <Form<TodoPayload>
        layout="vertical"
        initialValues={{ title: '', description: '', completed: false, priority: 'medium' }}
        onFinish={(values) => void handleSubmit(values)}
      >
        <Form.Item
          label={t('add.label_title')}
          name="title"
          rules={[
            { required: true, message: t('add.rule_required') },
            { min: 3, message: t('add.rule_min') },
            { max: 100, message: t('add.rule_max_title') },
          ]}
        >
          <Input placeholder={t('add.placeholder_title')} maxLength={100} showCount />
        </Form.Item>

        <Form.Item
          label={t('add.label_desc')}
          name="description"
          rules={[{ max: 500, message: t('add.rule_max_desc') }]}
        >
          <Input.TextArea rows={5} placeholder={t('add.placeholder_desc')} maxLength={500} showCount />
        </Form.Item>

        <Form.Item
          label={t('add.label_priority')}
          name="priority"
          rules={[{ required: true, message: t('add.rule_priority') }]}
        >
          <Select
            options={[
              { value: 'low', label: t('list.priority_low') },
              { value: 'medium', label: t('list.priority_medium') },
              { value: 'high', label: t('list.priority_high') },
            ]}
          />
        </Form.Item>

        <Form.Item name="completed" valuePropName="checked">
          <Checkbox>{t('add.checkbox_done')}</Checkbox>
        </Form.Item>

        <Space className="form-actions" wrap>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {t('add.btn_save')}
          </Button>
          <Button onClick={() => navigate('/todos')}>{t('add.btn_cancel')}</Button>
        </Space>
      </Form>
    </Card>
  );
};

export default AddTodoPage;
