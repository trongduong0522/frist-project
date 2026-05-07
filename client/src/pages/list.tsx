import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Empty,
  Flex,
  Popconfirm,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import toast from 'react-hot-toast';
import { getErrorMessage, todoApi } from '../api/todos';
import type { Todo } from '../api/todos';
import type { TodoPriority } from '../api/todos';

const { Text, Title } = Typography;

const priorityConfig: Record<TodoPriority, { color: string; label: string }> = {
  low: { color: 'default', label: 'Thap' },
  medium: { color: 'orange', label: 'Trung binh' },
  high: { color: 'red', label: 'Cao' },
};

const ListTodoPage = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string>();

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetching initial data on mount is an intentional external synchronization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTodos();
  }, [fetchTodos]);

  const handleToggleCompleted = async (todo: Todo, completed: boolean) => {
    try {
      setUpdatingId(todo._id);
      const updatedTodo = await todoApi.update(todo._id, {
        title: todo.title,
        description: todo.description,
        completed,
        priority: todo.priority,
      });

      setTodos((currentTodos) =>
        currentTodos.map((item) => (item._id === updatedTodo._id ? updatedTodo : item)),
      );
      toast.success('Da cap nhat trang thai');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUpdatingId(undefined);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setUpdatingId(id);
      await todoApi.remove(id);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo._id !== id));
      toast.success('Da xoa todo');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUpdatingId(undefined);
    }
  };

  const columns = useMemo<ColumnsType<Todo>>(
    () => [
      {
        title: 'Cong viec',
        dataIndex: 'title',
        key: 'title',
        render: (title: string, todo) => (
          <Space direction="vertical" size={2}>
            <Text strong>{title}</Text>
            <Text type="secondary">{todo.description || 'Khong co mo ta'}</Text>
          </Space>
        ),
      },
      {
        title: 'Trang thai',
        dataIndex: 'completed',
        key: 'completed',
        width: 150,
        render: (completed: boolean) =>
          completed ? <Tag color="green">Hoan thanh</Tag> : <Tag color="blue">Dang lam</Tag>,
      },
      {
        title: 'Uu tien',
        dataIndex: 'priority',
        key: 'priority',
        width: 130,
        render: (priority: TodoPriority = 'medium') => {
          const config = priorityConfig[priority];
          return <Tag color={config.color}>{config.label}</Tag>;
        },
      },
      {
        title: 'Cap nhat',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 160,
        render: (updatedAt?: string) =>
          updatedAt ? new Date(updatedAt).toLocaleDateString('vi-VN') : '-',
      },
      {
        title: 'Hoan thanh',
        key: 'toggle',
        width: 130,
        render: (_, todo) => (
          <Switch
            checked={todo.completed}
            checkedChildren={<CheckCircleOutlined />}
            loading={updatingId === todo._id}
            onChange={(checked) => void handleToggleCompleted(todo, checked)}
          />
        ),
      },
      {
        title: 'Thao tac',
        key: 'actions',
        width: 150,
        render: (_, todo) => (
          <Space>
            <Button
              aria-label="Sua todo"
              icon={<EditOutlined />}
              onClick={() => navigate(`/todos/${todo._id}/edit`)}
            />
            <Popconfirm
              title="Xoa todo nay?"
              description="Du lieu da xoa se khong the khoi phuc."
              okText="Xoa"
              cancelText="Huy"
              onConfirm={() => void handleDelete(todo._id)}
            >
              <Button aria-label="Xoa todo" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [navigate, updatingId],
  );

  return (
    <Card
      title={
        <Space direction="vertical" size={0}>
          <Title level={3}>Quan ly Todo</Title>
        </Space>
      }
      extra={
        <Flex gap={8} wrap="wrap">
          <Button icon={<ReloadOutlined />} onClick={() => void fetchTodos()}>
            Tai lai
          </Button>
          <Link to="/todos/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Them todo
            </Button>
          </Link>
        </Flex>
      }
    >
      <Spin spinning={loading}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={todos}
          pagination={{ pageSize: 8 }}
          locale={{
            emptyText: <Empty description="Chua co todo nao" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
          scroll={{ x: 760 }}
        />
      </Spin>
    </Card>
  );
};

export default ListTodoPage;
