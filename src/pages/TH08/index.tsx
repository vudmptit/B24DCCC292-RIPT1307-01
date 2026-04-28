import React, { useState } from 'react';
import {
    Card, Row, Col, Tag, Progress, Button, Drawer, Form,
    Input, InputNumber, Select, Popconfirm, Segmented, List, Modal, Space, Typography, message
} from 'antd';
import { DeleteOutlined, InfoCircleOutlined, PlusOutlined, RocketOutlined } from '@ant-design/icons';
import { initialGoals, initialExercises, GoalType } from './data';

const { Title, Text } = Typography;

const TH08: React.FC = () => {
    const [goals, setGoals] = useState<GoalType[]>(initialGoals);
    const [filterStatus, setFilterStatus] = useState<string>('Đang thực hiện');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [form] = Form.useForm();

    const handleAddGoal = (values: any) => {
        const newGoal: GoalType = { ...values, id: Date.now(), status: 'Đang thực hiện' };
        setGoals([newGoal, ...goals]);
        setIsDrawerOpen(false);
        form.resetFields();
        message.success('Đã thêm mục tiêu mới thành công!');
    };

    const updateGoalValue = (id: number, newValue: number) => {
        setGoals(goals.map(g => g.id === id ? { ...g, current: newValue } : g));
    };

    const deleteGoal = (id: number) => {
        setGoals(goals.filter(g => g.id !== id));
        message.error('Đã xóa mục tiêu.');
    };

    return (
        <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <Title level={2} style={{ marginBottom: 0 }}>Quản lý Hiệu suất</Title>
                    <Text type="secondary">Theo dõi mục tiêu và thư viện bài tập của bạn</Text>
                </div>
                <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => setIsDrawerOpen(true)}
                    style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                    Thiết lập mục tiêu
                </Button>
            </div>

            <Card bordered={false} style={{ marginBottom: 32, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ marginBottom: 24 }}>
                    <Segmented
                        size="large"
                        options={['Đang thực hiện', 'Đã đạt', 'Đã hủy']}
                        value={filterStatus}
                        onChange={(val) => setFilterStatus(val as string)}
                    />
                </div>

                <Row gutter={[24, 24]}>
                    {goals.filter(g => g.status === filterStatus).map(item => {
                        const percent = Math.min(Math.round((item.current / item.target) * 100), 100);
                        return (
                            <Col xs={24} sm={12} lg={8} key={item.id}>
                                <Card
                                    hoverable
                                    bordered
                                    style={{ borderRadius: '8px', borderLeft: '4px solid #1890ff' }}
                                    actions={[
                                        <Popconfirm
                                            title="Xác nhận xóa mục tiêu này?"
                                            onConfirm={() => deleteGoal(item.id)}
                                            okText="Xóa"
                                            cancelText="Hủy"
                                            key="popconfirm"
                                        >
                                            <DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} />
                                        </Popconfirm>
                                    ]}
                                >
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Text strong style={{ fontSize: '16px', maxWidth: '150px' }}>{item.title}</Text>
                                            <Tag color="processing">{item.type}</Tag>
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <Text type="secondary">Tiến độ hiện tại</Text>
                                                <Text strong>{item.current}/{item.target}</Text>
                                            </div>
                                            <Progress
                                                percent={percent}
                                                status="active"
                                                strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                                            />
                                        </div>

                                        <div style={{ background: '#fafafa', padding: '12px', borderRadius: '6px' }}>
                                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                                                Cập nhật nhanh:
                                            </Text>
                                            <InputNumber
                                                min={0}
                                                bordered={false}
                                                style={{ width: '100%', fontWeight: 'bold' }}
                                                value={item.current}
                                                onChange={(val) => updateGoalValue(item.id, val || 0)}
                                            />
                                        </div>
                                    </Space>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Card>

            <Title level={3} style={{ marginBottom: 20 }}>
                <RocketOutlined /> Thư viện bài tập chuyên sâu
            </Title>

            <List
                grid={{ gutter: 24, xs: 1, sm: 2, md: 3 }}
                dataSource={initialExercises}
                renderItem={item => (
                    <List.Item>
                        <Card
                            hoverable
                            style={{ borderRadius: '12px', overflow: 'hidden' }}
                            cover={<div style={{ height: '8px', background: item.color === 'red' ? '#ff4d4f' : item.color === 'orange' ? '#faad14' : '#52c41a' }} />}
                        >
                            <div style={{ marginBottom: 16 }}>
                                <Title level={4} style={{ marginBottom: 4 }}>{item.name}</Title>
                                <Tag color={item.color}>{item.level}</Tag>
                            </div>
                            <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                                <Text type="secondary">Nhóm cơ: <Text strong>{item.muscle}</Text></Text>
                                <Text type="secondary">Năng lượng: <Text strong style={{ color: '#cf1322' }}>{item.calo} kcal/h</Text></Text>
                            </Space>
                            <Button
                                block
                                shape="round"
                                icon={<InfoCircleOutlined />}
                                onClick={() => Modal.info({
                                    title: `Kỹ thuật thực hiện: ${item.name}`,
                                    width: 500,
                                    content: <div style={{ paddingTop: 16 }}><p>{item.desc}</p></div>,
                                    okText: 'Đã hiểu'
                                })}
                            >
                                Hướng dẫn chi tiết
                            </Button>
                        </Card>
                    </List.Item>
                )}
            />

            <Drawer
                title={<Title level={4} style={{ margin: 0 }}>Thiết lập mục tiêu mới</Title>}
                width={420}
                visible={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Form form={form} layout="vertical" onFinish={handleAddGoal}>
                    <Form.Item name="title" label="Tên mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}>
                        <Input size="large" placeholder="Ví dụ: Marathon 21km" />
                    </Form.Item>

                    <Form.Item name="type" label="Phân loại" initialValue="Giảm cân">
                        <Select size="large">
                            <Select.Option value="Giảm cân">Giảm cân</Select.Option>
                            <Select.Option value="Tăng cơ">Tăng cơ</Select.Option>
                            <Select.Option value="Sức bền">Cải thiện sức bền</Select.Option>
                            <Select.Option value="Khác">Khác</Select.Option>
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="target" label="Giá trị đích">
                                <InputNumber size="large" style={{ width: '100%' }} min={1} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="current" label="Giá trị đầu">
                                <InputNumber size="large" style={{ width: '100%' }} min={0} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="deadline" label="Ngày dự kiến hoàn thành">
                        <Input size="large" type="date" style={{ width: '100%' }} />
                    </Form.Item>

                    <div style={{ position: 'absolute', right: 0, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right', zIndex: 1 }}>
                        <Space>
                            <Button onClick={() => setIsDrawerOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">Kích hoạt mục tiêu</Button>
                        </Space>
                    </div>
                </Form>
            </Drawer>
        </div>
    );
};

export default TH08;