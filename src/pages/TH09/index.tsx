import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { ITask } from './data';
import Dashboard from './Dashboard';
import KanbanBoard from './KanbanBoard';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const { TabPane } = Tabs;

const TH09: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('th09_tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Failed to parse tasks from localStorage', e);
      }
    }
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    // Only save if tasks have been loaded/modified to avoid overwriting with empty array on first render
    // Actually, setting empty array is fine if they delete everything.
    localStorage.setItem('th09_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalVisible(true);
  };

  const handleEditTask = (task: ITask) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    message.success('Đã xóa công việc');
  };

  const handleSaveTask = (values: any) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => (t.id === editingTask.id ? { ...t, ...values } : t)));
      message.success('Đã cập nhật công việc');
    } else {
      const newTask: ITask = {
        ...values,
        id: Math.random().toString(36).substr(2, 9),
        status: 'TODO',
      };
      setTasks(prev => [...prev, newTask]);
      message.success('Đã thêm công việc mới');
    }
    setIsModalVisible(false);
  };

  const handleUpdateTaskStatus = (id: string, newStatus: ITask['status']) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  return (
    <PageContainer>
      <Card
        title="Quản lý công việc cá nhân (Kanban)"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddTask}>Thêm công việc</Button>}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Dashboard" key="1">
            <Dashboard tasks={tasks} />
          </TabPane>
          <TabPane tab="Kanban Board" key="2">
            <KanbanBoard 
              tasks={tasks} 
              onUpdateStatus={handleUpdateTaskStatus} 
              onEdit={handleEditTask} 
              onDelete={handleDeleteTask} 
            />
          </TabPane>
          <TabPane tab="Danh sách" key="3">
            <TaskList 
              tasks={tasks} 
              onEdit={handleEditTask} 
              onDelete={handleDeleteTask} 
              onUpdateStatus={handleUpdateTaskStatus} 
            />
          </TabPane>
        </Tabs>
      </Card>

      <TaskForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSaveTask}
        initialValues={editingTask}
      />
    </PageContainer>
  );
};

export default TH09;
