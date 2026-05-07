import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Checkbox, Form, Input, Result, Select, Skeleton, Space, Typography } from 'antd';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { getErrorMessage, todoApi } from '../api/todos';
import type { TodoPayload } from '../api/todos';

const { Title } = Typography;

const EditTodoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm<TodoPayload>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchTodo = async () => {
      if (!id) { setNotFound(true); setLoading(false); return; }
      try {
        setLoading(true);
        const todo = await todoApi.getOne(id);
        form.setFieldsValue({
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          priority: todo.priority ?? 'medium',
        });
      } catch (error) {
        setNotFound(true);
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    void fetchTodo();
  }, [form, id]);

  const handleSubmit = async (values: TodoPayload) => {
    if (!id) return;
    try {
      setSubmitting(true);
      await todoApi.update(id, {
        title: values.title.trim(),
        description: values.description?.trim() ?? '',
        completed: Boolean(values.completed),
        priority: values.priority,
      });
      toast.success(t('edit.toast_success'));
      navigate('/todos');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Card><Skeleton active paragraph={{ rows: 6 }} /></Card>;

  if (notFound) return (
    <Result
      status="404"
      title={t('edit.not_found')}
      extra={<Button onClick={() => navigate('/todos')}>{t('edit.back')}</Button>}
    />
  );

  return (
    <Card
      title={
        <Space direction="vertical" size={0}>
          <Title level={3}>{t('edit.title')}</Title>
        </Space>
      }
    >
      <Form<TodoPayload> form={form} layout="vertical" onFinish={(values) => void handleSubmit(values)}>
        <Form.Item
          label={t('edit.label_title')}
          name="title"
          rules={[
            { required: true, message: t('edit.rule_required') },
            { min: 3, message: t('edit.rule_min') },
            { max: 100, message: t('edit.rule_max_title') },
          ]}
        >
          <Input placeholder={t('edit.placeholder_title')} maxLength={100} showCount />
        </Form.Item>

        <Form.Item
          label={t('edit.label_desc')}
          name="description"
          rules={[{ max: 500, message: t('edit.rule_max_desc') }]}
        >
          <Input.TextArea rows={5} placeholder={t('edit.placeholder_desc')} maxLength={500} showCount />
        </Form.Item>

        <Form.Item
          label={t('edit.label_priority')}
          name="priority"
          rules={[{ required: true, message: t('edit.rule_priority') }]}
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
          <Checkbox>{t('edit.checkbox_done')}</Checkbox>
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {t('edit.btn_update')}
          </Button>
          <Button onClick={() => navigate('/todos')}>{t('edit.btn_cancel')}</Button>
        </Space>
      </Form>
    </Card>
  );
};

export default EditTodoPage;