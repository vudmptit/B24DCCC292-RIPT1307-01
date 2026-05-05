import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, Tag, Button, Typography, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { ITask } from './data';
import moment from 'moment';

const { Title, Text } = Typography;

interface KanbanBoardProps {
  tasks: ITask[];
  onUpdateStatus: (id: string, newStatus: ITask['status']) => void;
  onEdit: (task: ITask) => void;
  onDelete: (id: string) => void;
}

const columns = [
  { id: 'TODO', title: 'Cần làm' },
  { id: 'IN_PROGRESS', title: 'Đang làm' },
  { id: 'DONE', title: 'Hoàn thành' },
];

const priorityColors = {
  High: 'red',
  Medium: 'orange',
  Low: 'green',
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onUpdateStatus, onEdit, onDelete }) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    onUpdateStatus(draggableId, destination.droppableId as ITask['status']);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: '20px', padding: '20px 0', overflowX: 'auto', minHeight: '60vh' }}>
        {columns.map(column => {
          const columnTasks = tasks.filter(t => t.status === column.id);

          return (
            <div key={column.id} style={{ flex: 1, minWidth: 320, background: '#f5f7f9', padding: '16px 16px 8px', borderRadius: 8 }}>
              <Title level={5} style={{ marginBottom: 16 }}>
                {column.title} <Tag style={{ marginLeft: 8 }} shape="round">{columnTasks.length}</Tag>
              </Title>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ 
                      minHeight: 150, 
                      height: '100%',
                      background: snapshot.isDraggingOver ? '#e6f7ff' : 'transparent',
                      transition: 'background-color 0.2s ease',
                      borderRadius: 4
                    }}
                  >
                    {columnTasks.map((task, index) => {
                      const isOverdue = task.status !== 'DONE' && task.deadline && moment(task.deadline).isBefore(moment(), 'day');
                      return (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                marginBottom: 16,
                                ...provided.draggableProps.style,
                              }}
                            >
                              <Card 
                                size="small" 
                                title={<span style={{ whiteSpace: 'normal', display: 'block', lineHeight: '1.2' }}>{task.name}</span>}
                                extra={
                                  <Space size="small">
                                    <Button size="small" type="text" icon={<EditOutlined />} onClick={() => onEdit(task)} />
                                    <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => onDelete(task.id)}>
                                      <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                  </Space>
                                }
                                style={{ 
                                  boxShadow: snapshot.isDragging ? '0 8px 16px rgba(0,0,0,0.15)' : '0 1px 2px rgba(0,0,0,0.05)',
                                  border: isOverdue ? '1px solid #ffa39e' : '1px solid #f0f0f0',
                                }}
                                headStyle={{ borderBottom: '1px solid #f0f0f0', backgroundColor: isOverdue ? '#fff1f0' : '#fff' }}
                              >
                                {task.description && (
                                  <p style={{ margin: '0 0 12px 0', fontSize: 13 }}><Text type="secondary">{task.description}</Text></p>
                                )}
                                <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  <Tag color={priorityColors[task.priority]}>{task.priority}</Tag>
                                  {task.tags?.map(tag => (
                                    <Tag key={tag} color="blue">{tag}</Tag>
                                  ))}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <ClockCircleOutlined style={{ color: isOverdue ? '#cf1322' : '#8c8c8c', marginRight: 4 }} />
                                  <Text type="secondary" style={{ fontSize: 12, color: isOverdue ? '#cf1322' : undefined }}>
                                    {task.deadline ? moment(task.deadline).format('DD/MM/YYYY') : 'Không có hạn'}
                                  </Text>
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
