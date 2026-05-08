import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Empty, Progress, Row, Skeleton, Space, Statistic, Tag, Typography } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import toast from 'react-hot-toast';
import { getErrorMessage, todoApi } from '../api/todos';
import type { Todo, TodoPriority } from '../api/todos';

const { Text, Title } = Typography;

const DashboardPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

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

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const doing = total - completed;
    const high = todos.filter((todo) => todo.priority === 'high').length;
    const donePercent = total ? Math.round((completed / total) * 100) : 0;

    const byPriority: Record<TodoPriority, number> = {
      low: todos.filter((todo) => todo.priority === 'low').length,
      medium: todos.filter((todo) => todo.priority === 'medium').length,
      high,
    };

    const recent = [...todos]
      .sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() - new Date(a.updatedAt ?? a.createdAt ?? 0).getTime())
      .slice(0, 5);

    return { total, completed, doing, high, donePercent, byPriority, recent };
  }, [todos]);

  if (loading) {
    return (
      <Card className="page-card">
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  return (
    <Space direction="vertical" size={16} className="page-stack">
      <Card className="page-card">
        <Title level={3}>Thong ke</Title>
        <Text type="secondary">Tong quan tien do va muc uu tien cua danh sach todo.</Text>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic title="Tong cong viec" value={stats.total} prefix={<UnorderedListOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic title="Da hoan thanh" value={stats.completed} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic title="Dang lam" value={stats.doing} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic title="Uu tien cao" value={stats.high} prefix={<ExclamationCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card className="page-card" title="Tien do hoan thanh">
            <Progress type="circle" percent={stats.donePercent} />
            <div className="dashboard-progress-note">
              <Text type="secondary">
                {stats.completed}/{stats.total} cong viec da hoan thanh
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card className="page-card" title="Phan bo muc uu tien">
            <Space direction="vertical" size={12} className="page-stack">
              <Progress percent={stats.total ? Math.round((stats.byPriority.high / stats.total) * 100) : 0} status="exception" />
              <Text>High: {stats.byPriority.high}</Text>
              <Progress percent={stats.total ? Math.round((stats.byPriority.medium / stats.total) * 100) : 0} strokeColor="#f59e0b" />
              <Text>Medium: {stats.byPriority.medium}</Text>
              <Progress percent={stats.total ? Math.round((stats.byPriority.low / stats.total) * 100) : 0} strokeColor="#64748b" />
              <Text>Low: {stats.byPriority.low}</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card className="page-card" title="Cap nhat gan day">
        {stats.recent.length ? (
          <Space direction="vertical" size={10} className="page-stack">
            {stats.recent.map((todo) => (
              <div className="recent-todo" key={todo._id}>
                <div>
                  <Text strong>{todo.title}</Text>
                  <div>
                    <Text type="secondary">{todo.description || 'Khong co mo ta'}</Text>
                  </div>
                </div>
                <Space wrap>
                  <Tag color={todo.completed ? 'green' : 'blue'}>{todo.completed ? 'Done' : 'Doing'}</Tag>
                  <Tag color={todo.priority === 'high' ? 'red' : todo.priority === 'medium' ? 'orange' : 'default'}>
                    {todo.priority}
                  </Tag>
                </Space>
              </div>
            ))}
          </Space>
        ) : (
          <Empty description="Chua co cong viec nao" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>
    </Space>
  );
};

export default DashboardPage;
