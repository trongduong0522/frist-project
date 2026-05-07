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

      toast.success('Đã cập nhật todo');
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
        title="Không tìm thấy todo"
        extra={<Button onClick={() => navigate('/todos')}>Quay lại danh sách</Button>}
      />
    );
  }

  return (
    <Card
      title={
        <Space direction="vertical" size={0}>
          <Title level={3}>Sửa Todo</Title>
          <Text type="secondary">Cập nhật thông tin theo schema của backend.</Text>
        </Space>
      }
    >
      <Form<TodoPayload> form={form} layout="vertical" onFinish={(values) => void handleSubmit(values)}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề' },
            { min: 3, message: 'Tiêu đề phải có ít nhất 3 ký tự' },
            { max: 100, message: 'Tiêu đề không được vượt quá 100 ký tự' },
          ]}
        >
          <Input placeholder="Nhập tên công việc" maxLength={100} showCount />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ max: 500, message: 'Mô tả không được vượt quá 500 ký tự' }]}
        >
          <Input.TextArea rows={5} placeholder="Nhập mô tả nếu có" maxLength={500} showCount />
        </Form.Item>

        <Form.Item
          label="Mức độ ưu tiên"
          name="priority"
          rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}
        >
          <Select
            options={[
              { value: 'low', label: 'Thấp' },
              { value: 'medium', label: 'Trung bình' },
              { value: 'high', label: 'Cao' },
            ]}
          />
        </Form.Item>

        <Form.Item name="completed" valuePropName="checked">
          <Checkbox>Đã hoàn thành</Checkbox>
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Cập nhật
          </Button>
          <Button onClick={() => navigate('/todos')}>Hủy</Button>
        </Space>
      </Form>
    </Card>
  );
};

export default EditTodoPage;
