import { Tabs } from "antd";
import App from "./degreeManagement";

const { TabPane } = Tabs;

const TH04 = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Management" key="1">
        <App />
      </TabPane>
    </Tabs>
  );
};

export default TH04;