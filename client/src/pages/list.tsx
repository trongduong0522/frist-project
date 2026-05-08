import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button, Card, Empty, Flex, Input, Popconfirm,
  Select, Space, Spin, Switch, Table, Tag, Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined, DeleteOutlined, EditOutlined,
  PlusOutlined, ReloadOutlined, SearchOutlined,
} from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { getErrorMessage, todoApi } from '../api/todos';
import type { Todo, TodoPriority } from '../api/todos';

const { Text, Title } = Typography;

const ListTodoPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string>();

  // ===== FILTER STATE =====
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'done' | 'doing'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | TodoPriority>('all');

  const priorityConfig: Record<TodoPriority, { color: string; label: string }> = {
    low: { color: 'default', label: t('list.priority_low') },
    medium: { color: 'orange', label: t('list.priority_medium') },
    high: { color: 'red', label: t('list.priority_high') },
  };

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
    void fetchTodos();
  }, [fetchTodos]);

  // ===== FILTERED DATA =====
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchSearch = todo.title.toLowerCase().includes(search.toLowerCase()) ||
        (todo.description ?? '').toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        filterStatus === 'all' ? true :
        filterStatus === 'done' ? todo.completed :
        !todo.completed;

      const matchPriority =
        filterPriority === 'all' ? true :
        todo.priority === filterPriority;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [todos, search, filterStatus, filterPriority]);

  const hasActiveFilter = search !== '' || filterStatus !== 'all' || filterPriority !== 'all';

  const resetFilters = () => {
    setSearch('');
    setFilterStatus('all');
    setFilterPriority('all');
  };

  const handleToggleCompleted = async (todo: Todo, completed: boolean) => {
    try {
      setUpdatingId(todo._id);
      const updatedTodo = await todoApi.update(todo._id, {
        title: todo.title,
        description: todo.description,
        completed,
        priority: todo.priority,
      });
      setTodos((cur) => cur.map((item) => (item._id === updatedTodo._id ? updatedTodo : item)));
      toast.success(t('list.toast_updated'));
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
      setTodos((cur) => cur.filter((todo) => todo._id !== id));
      toast.success(t('list.toast_deleted'));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUpdatingId(undefined);
    }
  };

  const columns = useMemo<ColumnsType<Todo>>(
    () => [
      {
        title: t('list.col_task'),
        dataIndex: 'title',
        key: 'title',
        render: (title: string, todo) => (
          <Space direction="vertical" size={2}>
            <Text strong>{title}</Text>
            <Text type="secondary">{todo.description || t('list.no_description')}</Text>
          </Space>
        ),
      },
      {
        title: t('list.col_status'),
        dataIndex: 'completed',
        key: 'completed',
        width: 150,
        render: (completed: boolean) =>
          completed
            ? <Tag color="green">{t('list.status_done')}</Tag>
            : <Tag color="blue">{t('list.status_doing')}</Tag>,
      },
      {
        title: t('list.col_priority'),
        dataIndex: 'priority',
        key: 'priority',
        width: 150,
        render: (priority: TodoPriority = 'medium') => {
          const config = priorityConfig[priority];
          return <Tag color={config.color}>{config.label}</Tag>;
        },
      },
      {
        title: t('list.col_updated'),
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 160,
        render: (updatedAt?: string) =>
          updatedAt ? new Date(updatedAt).toLocaleDateString('vi-VN') : '-',
      },
      {
        title: t('list.col_done'),
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
        title: t('list.col_actions'),
        key: 'actions',
        width: 150,
        render: (_, todo) => (
          <Space>
            <Button
              aria-label="edit"
              icon={<EditOutlined />}
              onClick={() => navigate(`/todos/${todo._id}/edit`)}
            />
            <Popconfirm
              title={t('list.delete_confirm')}
              description={t('list.delete_desc')}
              okText={t('list.delete_ok')}
              cancelText={t('list.delete_cancel')}
              onConfirm={() => void handleDelete(todo._id)}
            >
              <Button aria-label="delete" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [navigate, updatingId, t],
  );

  return (
    <Card
      className="page-card todo-list-card"
      title={
        <Space direction="vertical" size={0}>
          <Title level={3}>{t('list.title')}</Title>
        </Space>
      }
      extra={
        <Flex gap={8} wrap="wrap">
          <Button icon={<ReloadOutlined />} onClick={() => void fetchTodos()}>
            {t('list.reload')}
          </Button>
          <Link to="/todos/add">
            <Button type="primary" icon={<PlusOutlined />}>
              {t('list.add')}
            </Button>
          </Link>
        </Flex>
      }
    >
      {/* ===== FILTER BAR ===== */}
      <Flex className="todo-filter" gap={8} wrap="wrap" style={{ marginBottom: 16 }}>
        <Input
          className="todo-filter-control todo-filter-search"
          prefix={<SearchOutlined />}
          placeholder={t('list.search_placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: 220 }}
        />
        <Select
          className="todo-filter-control"
          value={filterStatus}
          onChange={(val) => setFilterStatus(val)}
          style={{ width: 150 }}
          options={[
            { value: 'all', label: t('list.filter_all') },
            { value: 'done', label: t('list.filter_done') },
            { value: 'doing', label: t('list.filter_doing') },
          ]}
        />
        <Select
          className="todo-filter-control"
          value={filterPriority}
          onChange={(val) => setFilterPriority(val)}
          style={{ width: 150 }}
          options={[
            { value: 'all', label: t('list.filter_all') },
            { value: 'low', label: t('list.filter_low') },
            { value: 'medium', label: t('list.filter_medium') },
            { value: 'high', label: t('list.filter_high') },
          ]}
        />
        {hasActiveFilter && (
          <Button onClick={resetFilters}>{t('list.filter_reset')}</Button>
        )}
      </Flex>

      {/* ===== TABLE ===== */}
      <Spin spinning={loading}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredTodos}
          pagination={{ pageSize: 8 }}
          locale={{
            emptyText: (
              <Empty description={t('list.empty')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ),
          }}
          scroll={{ x: 800 }}
        />
      </Spin>
    </Card>
  );
};

export default ListTodoPage;
