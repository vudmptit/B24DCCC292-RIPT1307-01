import React, { useState, useMemo, useEffect } from 'react';
import {
    Tabs,
    Card,
    List,
    Tag,
    Input,
    Button,
    Pagination,
    Table,
    Form,
    Modal,
    Popconfirm,
    Select,
    message,
    Space,
    Typography,
    Row,
    Col,
    Avatar,
    Divider,
} from 'antd';
import {
    ReadOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    EyeOutlined,
    ArrowLeftOutlined,
    GithubOutlined,
    TwitterOutlined,
    LinkedinOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import debounce from 'lodash.debounce';

import { initialPosts, initialTags, authorInfo, Post, Tag as BlogTag } from './data';

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const BlogApp: React.FC = () => {
    // Data States
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [tags, setTags] = useState<BlogTag[]>(initialTags);

    // View States
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Modal & Form States (Bài viết)
    const [isPostModalVisible, setIsPostModalVisible] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [postForm] = Form.useForm();
    
    // Modal & Form States (Thẻ)
    const [isTagModalVisible, setIsTagModalVisible] = useState(false);
    const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
    const [tagForm] = Form.useForm();

    const pageSize = 9;

    // --- XỬ LÝ TRANG CHỦ ---
    const handleSearch = useMemo(
        () => debounce((value: string) => {
            setSearchText(value);
            setCurrentPage(1); // Reset page on search
        }, 300),
        []
    );

    const filteredPosts = useMemo(() => {
        let result = posts.filter(p => p.status === 'published'); // Chỉ hiển thị bài đã đăng
        
        if (searchText) {
            result = result.filter(p => p.title.toLowerCase().includes(searchText.toLowerCase()));
        }
        if (selectedTag) {
            result = result.filter(p => p.tags.includes(selectedTag));
        }
        
        // Sắp xếp bài mới nhất lên trước
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return result;
    }, [posts, searchText, selectedTag]);

    const paginatedPosts = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredPosts.slice(start, start + pageSize);
    }, [filteredPosts, currentPage]);

    const handleReadPost = (post: Post) => {
        // Tăng view count
        const updatedPosts = posts.map(p => {
            if (p.id === post.id) {
                return { ...p, views: p.views + 1 };
            }
            return p;
        });
        setPosts(updatedPosts);
        setCurrentPost({ ...post, views: post.views + 1 });
    };

    // --- XỬ LÝ QUẢN LÝ BÀI VIẾT ---
    const handleOpenPostModal = (post?: Post) => {
        if (post) {
            setEditingPost(post);
            postForm.setFieldsValue({
                ...post,
                // Chuyển tags từ mảng ID sang ID cho select multiple
            });
        } else {
            setEditingPost(null);
            postForm.resetFields();
            postForm.setFieldsValue({ status: 'draft', author: 'Hoàng Văn Coding' });
        }
        setIsPostModalVisible(true);
    };

    const handleSavePost = (values: any) => {
        if (editingPost) {
            const updated = posts.map(p => p.id === editingPost.id ? { ...p, ...values } : p);
            setPosts(updated);
            message.success('Cập nhật bài viết thành công');
        } else {
            const newPost: Post = {
                id: 'p' + new Date().getTime(),
                views: 0,
                date: new Date().toISOString().split('T')[0],
                authorAvatar: authorInfo.avatar,
                ...values
            };
            setPosts([...posts, newPost]);
            message.success('Thêm bài viết thành công');
        }
        setIsPostModalVisible(false);
    };

    const handleDeletePost = (id: string) => {
        setPosts(posts.filter(p => p.id !== id));
        message.success('Đã xoá bài viết');
    };

    // --- XỬ LÝ QUẢN LÝ THẺ ---
    const handleOpenTagModal = (tag?: BlogTag) => {
        if (tag) {
            setEditingTag(tag);
            tagForm.setFieldsValue(tag);
        } else {
            setEditingTag(null);
            tagForm.resetFields();
            tagForm.setFieldsValue({ color: 'blue' });
        }
        setIsTagModalVisible(true);
    };

    const handleSaveTag = (values: any) => {
        if (editingTag) {
            const updated = tags.map(t => t.id === editingTag.id ? { ...t, ...values } : t);
            setTags(updated);
            message.success('Cập nhật thẻ thành công');
        } else {
            const newTag: BlogTag = {
                id: 't' + new Date().getTime(),
                ...values
            };
            setTags([...tags, newTag]);
            message.success('Thêm thẻ thành công');
        }
        setIsTagModalVisible(false);
    };

    const handleDeleteTag = (id: string) => {
        // Kiểm tra xem thẻ có đang được dùng không
        const isUsed = posts.some(p => p.tags.includes(id));
        if (isUsed) {
            message.error('Không thể xoá thẻ đang được sử dụng trong bài viết!');
            return;
        }
        setTags(tags.filter(t => t.id !== id));
        message.success('Đã xoá thẻ');
    };

    // RENDER: Chi tiết bài viết
    if (currentPost) {
        const related = posts.filter(
            p => p.id !== currentPost.id && p.status === 'published' && p.tags.some(t => currentPost.tags.includes(t))
        ).slice(0, 3);

        return (
            <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
                <Button 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => setCurrentPost(null)}
                    style={{ marginBottom: 20 }}
                >
                    Quay lại danh sách
                </Button>
                
                <Card bodyStyle={{ padding: '40px' }} style={{ borderRadius: 12 }}>
                    <Title level={1}>{currentPost.title}</Title>
                    <Space style={{ marginBottom: 20 }}>
                        <Avatar src={currentPost.authorAvatar} />
                        <Text strong>{currentPost.author}</Text>
                        <Text type="secondary">| {currentPost.date}</Text>
                        <Text type="secondary">| <EyeOutlined /> {currentPost.views} lượt xem</Text>
                    </Space>
                    
                    <div style={{ marginBottom: 30 }}>
                        {currentPost.tags.map(tid => {
                            const tagObj = tags.find(t => t.id === tid);
                            return tagObj ? <Tag key={tid} color={tagObj.color}>{tagObj.name}</Tag> : null;
                        })}
                    </div>
                    
                    {currentPost.coverImage && (
                        <div style={{ textAlign: 'center', marginBottom: 30 }}>
                            <img src={currentPost.coverImage} alt="cover" style={{ maxWidth: '100%', borderRadius: 8, maxHeight: 400, objectFit: 'cover' }} />
                        </div>
                    )}

                    <Typography style={{ fontSize: 16 }}>
                        <ReactMarkdown>{currentPost.content}</ReactMarkdown>
                    </Typography>
                </Card>

                {related.length > 0 && (
                    <div style={{ marginTop: 40 }}>
                        <Title level={3}>Bài viết liên quan</Title>
                        <Row gutter={[16, 16]}>
                            {related.map(rp => (
                                <Col xs={24} sm={12} md={8} key={rp.id}>
                                    <Card 
                                        hoverable 
                                        onClick={() => handleReadPost(rp)}
                                        style={{ height: '100%', borderRadius: 8 }}
                                    >
                                        <Card.Meta title={rp.title} description={rp.summary.slice(0, 80) + '...'} />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
            <Tabs defaultActiveKey="1" size="large">
                
                {/* TRANG CHỦ */}
                <TabPane tab={<Space><ReadOutlined /> Trang chủ</Space>} key="1">
                    <Row gutter={24}>
                        <Col span={24} style={{ marginBottom: 20 }}>
                            <Card style={{ borderRadius: 8 }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Input.Search 
                                        placeholder="Tìm kiếm bài viết..." 
                                        size="large"
                                        allowClear
                                        onChange={e => handleSearch(e.target.value)}
                                        style={{ maxWidth: 400 }}
                                    />
                                    <div style={{ marginTop: 10 }}>
                                        <Text strong style={{ marginRight: 10 }}>Lọc theo thẻ:</Text>
                                        <Tag 
                                            color={selectedTag === null ? 'blue' : 'default'} 
                                            style={{ cursor: 'pointer', padding: '4px 8px' }}
                                            onClick={() => setSelectedTag(null)}
                                        >
                                            Tất cả
                                        </Tag>
                                        {tags.map(t => (
                                            <Tag 
                                                key={t.id} 
                                                color={selectedTag === t.id ? t.color : 'default'}
                                                style={{ cursor: 'pointer', padding: '4px 8px' }}
                                                onClick={() => setSelectedTag(t.id)}
                                            >
                                                {t.name}
                                            </Tag>
                                        ))}
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                        
                        {paginatedPosts.map(post => (
                            <Col xs={24} sm={12} md={8} key={post.id} style={{ marginBottom: 24 }}>
                                <Card
                                    hoverable
                                    cover={<img alt="example" src={post.coverImage || 'https://via.placeholder.com/400x200'} style={{ height: 200, objectFit: 'cover' }} />}
                                    onClick={() => handleReadPost(post)}
                                    style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden' }}
                                    bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                                >
                                    <div style={{ marginBottom: 10 }}>
                                        {post.tags.map(tid => {
                                            const tagObj = tags.find(t => t.id === tid);
                                            return tagObj ? <Tag key={tid} color={tagObj.color}>{tagObj.name}</Tag> : null;
                                        })}
                                    </div>
                                    <Title level={4} style={{ marginTop: 0, flex: 1 }}>{post.title}</Title>
                                    <Paragraph type="secondary" ellipsis={{ rows: 2 }}>{post.summary}</Paragraph>
                                    
                                    <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Space>
                                            <Avatar src={post.authorAvatar} size="small" />
                                            <Text type="secondary" style={{ fontSize: 12 }}>{post.date}</Text>
                                        </Space>
                                        <Text type="secondary" style={{ fontSize: 12 }}><EyeOutlined /> {post.views}</Text>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    
                    <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 40 }}>
                        <Pagination 
                            current={currentPage} 
                            pageSize={pageSize} 
                            total={filteredPosts.length} 
                            showTotal={total => `Tổng ${total} bài viết`}
                            onChange={page => setCurrentPage(page)}
                        />
                    </div>
                </TabPane>

                {/* TRANG GIỚI THIỆU */}
                <TabPane tab="Giới thiệu" key="2">
                    <Card style={{ maxWidth: 800, margin: '0 auto', borderRadius: 12, textAlign: 'center' }}>
                        <Avatar src={authorInfo.avatar} size={120} style={{ marginBottom: 20 }} />
                        <Title level={2}>{authorInfo.name}</Title>
                        <Paragraph style={{ fontSize: 16 }}>{authorInfo.bio}</Paragraph>
                        
                        <Divider>Kỹ năng</Divider>
                        <div>
                            {authorInfo.skills.map(skill => (
                                <Tag key={skill} color="processing" style={{ padding: '6px 12px', fontSize: 14, margin: 5 }}>
                                    {skill}
                                </Tag>
                            ))}
                        </div>
                        
                        <Divider>Liên hệ</Divider>
                        <Space size="large">
                            <Button type="text" icon={<GithubOutlined style={{ fontSize: 24 }} />} href={authorInfo.social.github} target="_blank" />
                            <Button type="text" icon={<TwitterOutlined style={{ fontSize: 24, color: '#1DA1F2' }} />} href={authorInfo.social.twitter} target="_blank" />
                            <Button type="text" icon={<LinkedinOutlined style={{ fontSize: 24, color: '#0A66C2' }} />} href={authorInfo.social.linkedin} target="_blank" />
                        </Space>
                    </Card>
                </TabPane>

                {/* QUẢN LÝ BÀI VIẾT */}
                <TabPane tab="Quản lý bài viết" key="3">
                    <Card style={{ borderRadius: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Title level={4}>Danh sách bài viết</Title>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenPostModal()}>
                                Thêm bài mới
                            </Button>
                        </div>
                        <Table 
                            dataSource={posts} 
                            rowKey="id"
                            columns={[
                                { title: 'Tiêu đề', dataIndex: 'title', width: 300 },
                                { 
                                    title: 'Trạng thái', 
                                    dataIndex: 'status',
                                    render: status => <Tag color={status === 'published' ? 'green' : 'orange'}>{status === 'published' ? 'Đã đăng' : 'Nháp'}</Tag>
                                },
                                { 
                                    title: 'Thẻ', 
                                    dataIndex: 'tags',
                                    render: postTags => (
                                        <>
                                            {postTags.map((tid: string) => {
                                                const tagObj = tags.find(t => t.id === tid);
                                                return tagObj ? <Tag key={tid} color={tagObj.color}>{tagObj.name}</Tag> : null;
                                            })}
                                        </>
                                    )
                                },
                                { title: 'Lượt xem', dataIndex: 'views' },
                                { title: 'Ngày tạo', dataIndex: 'date' },
                                {
                                    title: 'Hành động',
                                    key: 'action',
                                    render: (_, record) => (
                                        <Space size="middle">
                                            <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => handleOpenPostModal(record)} />
                                            <Popconfirm title="Bạn có chắc xoá bài này?" onConfirm={() => handleDeletePost(record.id)}>
                                                <Button type="text" danger icon={<DeleteOutlined />} />
                                            </Popconfirm>
                                        </Space>
                                    )
                                }
                            ]}
                        />
                    </Card>
                </TabPane>

                {/* QUẢN LÝ THẺ */}
                <TabPane tab="Quản lý thẻ" key="4">
                    <Row gutter={24}>
                        <Col span={16}>
                            <Card style={{ borderRadius: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <Title level={4}>Danh sách Thẻ (Tags)</Title>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenTagModal()}>
                                        Thêm thẻ mới
                                    </Button>
                                </div>
                                <Table 
                                    dataSource={tags} 
                                    rowKey="id"
                                    columns={[
                                        { 
                                            title: 'Tên thẻ', 
                                            dataIndex: 'name',
                                            render: (text, record) => <Tag color={record.color}>{text}</Tag>
                                        },
                                        { title: 'Màu sắc', dataIndex: 'color' },
                                        { 
                                            title: 'Số bài viết sử dụng', 
                                            key: 'usage',
                                            render: (_, record) => {
                                                const count = posts.filter(p => p.tags.includes(record.id)).length;
                                                return count;
                                            }
                                        },
                                        {
                                            title: 'Hành động',
                                            key: 'action',
                                            render: (_, record) => (
                                                <Space size="middle">
                                                    <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => handleOpenTagModal(record)} />
                                                    <Popconfirm title="Xoá thẻ này?" onConfirm={() => handleDeleteTag(record.id)}>
                                                        <Button type="text" danger icon={<DeleteOutlined />} />
                                                    </Popconfirm>
                                                </Space>
                                            )
                                        }
                                    ]}
                                />
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>

            {/* MODAL THÊM/SỬA BÀI VIẾT */}
            <Modal
                title={editingPost ? "Sửa bài viết" : "Thêm bài viết mới"}
                visible={isPostModalVisible}
                onCancel={() => setIsPostModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={postForm}
                    layout="vertical"
                    onFinish={handleSavePost}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
                                <Input placeholder="Nhập tiêu đề" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="slug" label="Đường dẫn (Slug)" rules={[{ required: true }]}>
                                <Input placeholder="vi-du-bai-viet" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="summary" label="Tóm tắt" rules={[{ required: true }]}>
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <Form.Item name="coverImage" label="URL Ảnh đại diện" rules={[{ required: true }]}>
                        <Input placeholder="https://..." />
                    </Form.Item>
                    
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="tags" label="Gắn thẻ" rules={[{ required: true }]}>
                                <Select mode="multiple" placeholder="Chọn thẻ">
                                    {tags.map(t => (
                                        <Option key={t.id} value={t.id}>{t.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="status" label="Trạng thái xuất bản">
                                <Select>
                                    <Option value="draft">Bản nháp</Option>
                                    <Option value="published">Đã đăng</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="author" label="Tác giả" rules={[{ required: true }]} hidden>
                         <Input />
                    </Form.Item>

                    <Form.Item name="content" label="Nội dung (Markdown)" rules={[{ required: true }]}>
                        <Input.TextArea rows={10} placeholder="# Tiêu đề\nNội dung văn bản..." style={{ fontFamily: 'monospace' }} />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Button onClick={() => setIsPostModalVisible(false)} style={{ marginRight: 8 }}>Hủy</Button>
                        <Button type="primary" htmlType="submit">Lưu lại</Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* MODAL THÊM/SỬA THẺ */}
            <Modal
                title={editingTag ? "Sửa thẻ" : "Thêm thẻ mới"}
                visible={isTagModalVisible}
                onCancel={() => setIsTagModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={tagForm}
                    layout="vertical"
                    onFinish={handleSaveTag}
                >
                    <Form.Item name="name" label="Tên thẻ" rules={[{ required: true }]}>
                        <Input placeholder="VD: React" />
                    </Form.Item>
                    
                    <Form.Item name="color" label="Màu sắc" rules={[{ required: true }]}>
                        <Select>
                            <Option value="blue">Blue</Option>
                            <Option value="cyan">Cyan</Option>
                            <Option value="green">Green</Option>
                            <Option value="magenta">Magenta</Option>
                            <Option value="gold">Gold</Option>
                            <Option value="red">Red</Option>
                            <Option value="purple">Purple</Option>
                            <Option value="orange">Orange</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Button onClick={() => setIsTagModalVisible(false)} style={{ marginRight: 8 }}>Hủy</Button>
                        <Button type="primary" htmlType="submit">Lưu lại</Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
};

export default BlogApp;
