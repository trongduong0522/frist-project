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

      toast.success('Đã thêm thành công');
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
          <Title level={3}>Thêm Todo</Title>
        </Space>
      }
    >
      <Form<TodoPayload>
        layout="vertical"
        initialValues={{ title: '', description: '', completed: false, priority: 'medium' }}
        onFinish={(values) => void handleSubmit(values)}
      >
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
          <Checkbox>Đánh dấu đã hoàn thành</Checkbox>
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Lưu
          </Button>
          <Button onClick={() => navigate('/todos')}>Hủy</Button>
        </Space>
      </Form>
    </Card>
  );
};

export default AddTodoPage;
