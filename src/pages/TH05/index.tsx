import { Tabs } from "antd";
import App from "./ClubManager";

const { TabPane } = Tabs;

const TH05 = () => {
    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab="Quản lý" key="1">
                <App />
            </TabPane>
        </Tabs>
    );
};

export default TH05;
