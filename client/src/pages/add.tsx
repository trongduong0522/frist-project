import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Checkbox, Form, Input, Select, Space, Typography } from 'antd';
import toast from 'react-hot-toast';
import { getErrorMessage, todoApi } from '../api/todos';
import type { TodoPayload } from '../api/todos';

const { Title } = Typography;

const AddTodoPage = () => {
  const navigate = useNavigate();
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

      toast.success('Da them todo');
      navigate('/todos');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      title={
        <Space direction="vertical" size={0}>
          <Title level={3}>Them Todo</Title>
        </Space>
      }
    >
      <Form<TodoPayload>
        layout="vertical"
        initialValues={{ title: '', description: '', completed: false, priority: 'medium' }}
        onFinish={(values) => void handleSubmit(values)}
      >
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
          <Checkbox>Danh dau da hoan thanh</Checkbox>
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Luu
          </Button>
          <Button onClick={() => navigate('/todos')}>Huy</Button>
        </Space>
      </Form>
    </Card>
  );
};

export default AddTodoPage;
