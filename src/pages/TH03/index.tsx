import { Tabs } from "antd";
import AppointmentManager from "./AppointmentManager";

const { TabPane } = Tabs;

const TH03 = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Management" key="1">
        <AppointmentManager />
      </TabPane>
    </Tabs>
  );
};

export default TH03;