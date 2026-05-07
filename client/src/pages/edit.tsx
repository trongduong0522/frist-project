import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Checkbox, Form, Input, Result, Select, Skeleton, Space, Typography } from 'antd';
import toast from 'react-hot-toast';
import { getErrorMessage, todoApi } from '../api/todos';
import type { TodoPayload } from '../api/todos';

const { Text, Title } = Typography;

const EditTodoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<TodoPayload>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchTodo = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

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
    if (!id) {
      return;
    }

    try {
      setSubmitting(true);
      await todoApi.update(id, {
        title: values.title.trim(),
        description: values.description?.trim() ?? '',
        completed: Boolean(values.completed),
        priority: values.priority,
      });

      toast.success('Da cap nhat todo');
      navigate('/todos');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (notFound) {
    return (
      <Result
        status="404"
        title="Khong tim thay todo"
        extra={<Button onClick={() => navigate('/todos')}>Quay lai danh sach</Button>}
      />
    );
  }

  return (
    <Card
      title={
        <Space direction="vertical" size={0}>
          <Title level={3}>Sua Todo</Title>
          <Text type="secondary">Cap nhat thong tin theo schema cua backend.</Text>
        </Space>
      }
    >
      <Form<TodoPayload> form={form} layout="vertical" onFinish={(values) => void handleSubmit(values)}>
        <Form.Item
          label="Tieu de"
          name="title"
          rules={[
            { required: true, message: 'Vui long nhap tieu de' },
            { min: 3, message: 'Tieu de phai co it nhat 3 ky tu' },
            { max: 100, message: 'Tieu de khong duoc vuot qua 100 ky tu' },
          ]}
        >
          <Input placeholder="Nhap ten cong viec" maxLength={100} showCount />
        </Form.Item>

        <Form.Item
          label="Mo ta"
          name="description"
          rules={[{ max: 500, message: 'Mo ta khong duoc vuot qua 500 ky tu' }]}
        >
          <Input.TextArea rows={5} placeholder="Nhap mo ta neu co" maxLength={500} showCount />
        </Form.Item>

        <Form.Item
          label="Muc do uu tien"
          name="priority"
          rules={[{ required: true, message: 'Vui long chon muc do uu tien' }]}
        >
          <Select
            options={[
              { value: 'low', label: 'Thap' },
              { value: 'medium', label: 'Trung binh' },
              { value: 'high', label: 'Cao' },
            ]}
          />
        </Form.Item>

        <Form.Item name="completed" valuePropName="checked">
          <Checkbox>Da hoan thanh</Checkbox>
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Cap nhat
          </Button>
          <Button onClick={() => navigate('/todos')}>Huy</Button>
        </Space>
      </Form>
    </Card>
  );
};

export default EditTodoPage;
