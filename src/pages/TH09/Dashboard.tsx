import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { ITask } from './data';
import moment from 'moment';

interface DashboardProps {
  tasks: ITask[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'DONE') return false;
    if (!t.deadline) return false;
    return moment(t.deadline).isBefore(moment(), 'day');
  }).length;

  return (
    <div style={{ padding: '20px 0' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card hoverable>
            <Statistic
              title="Tổng số công việc"
              value={totalTasks}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
              prefix={<UnorderedListOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable>
            <Statistic
              title="Công việc hoàn thành"
              value={completedTasks}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable>
            <Statistic
              title="Công việc quá hạn"
              value={overdueTasks}
              valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
