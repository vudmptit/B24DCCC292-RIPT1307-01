import React, { useState } from 'react';
import { Table, Tag, Button, Space, Popconfirm, Select, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ITask } from './data';
import moment from 'moment';

interface TaskListProps {
  tasks: ITask[];
  onEdit: (task: ITask) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: ITask['status']) => void;
}

const statusColors = {
  TODO: 'default',
  IN_PROGRESS: 'processing',
  DONE: 'success',
};

const priorityColors = {
  High: 'red',
  Medium: 'orange',
  Low: 'green',
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onUpdateStatus }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchName = task.name.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter ? task.status === statusFilter : true;
    return matchName && matchStatus;
  });

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ITask, b: ITask) => a.name.localeCompare(b.name),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (text: string) => text ? moment(text).format('DD/MM/YYYY') : '',
      sorter: (a: ITask, b: ITask) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return moment(a.deadline).valueOf() - moment(b.deadline).valueOf();
      },
    },
    {
      title: 'Mức độ',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: ITask['priority']) => (
        <Tag color={priorityColors[priority]}>{priority}</Tag>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags?.map(tag => (
            <Tag color="blue" key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: ITask['status'], record: ITask) => (
        <Select
          value={status}
          onChange={(val) => onUpdateStatus(record.id, val as ITask['status'])}
          style={{ width: 130 }}
        >
          <Select.Option value="TODO"><Tag color="default">Cần làm</Tag></Select.Option>
          <Select.Option value="IN_PROGRESS"><Tag color="processing">Đang làm</Tag></Select.Option>
          <Select.Option value="DONE"><Tag color="success">Hoàn thành</Tag></Select.Option>
        </Select>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: ITask) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => onEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => onDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          onChange={(val) => setStatusFilter(val)}
          style={{ width: 200 }}
        >
          <Select.Option value="TODO">Cần làm</Select.Option>
          <Select.Option value="IN_PROGRESS">Đang làm</Select.Option>
          <Select.Option value="DONE">Hoàn thành</Select.Option>
        </Select>
      </div>
      <Table 
        columns={columns} 
        dataSource={filteredTasks} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TaskList;
