import { Tabs } from "antd";
import App from "./CourseManager";

const { TabPane } = Tabs;

const KTGK = () => {
    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab="Quản lý Khóa học" key="1">
                <App />
            </TabPane>
        </Tabs>
    );
};

export default KTGK;
