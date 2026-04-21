import { Tabs } from 'antd';
import React from 'react';
import BlogApp from './BlogApp';

const TH07: React.FC = () => {
    return (
        <div style={{ padding: 20 }}>
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Blog Cá Nhân" key="1">
                    <BlogApp />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default TH07;
