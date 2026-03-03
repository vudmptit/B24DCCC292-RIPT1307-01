import { Tabs } from "antd";
import OrderManager from "./OrderManager";

const { TabPane } = Tabs;

const Baitap2 = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Game" key="1">
        <OrderManager />
      </TabPane>
    </Tabs>
    
    
  );
};

export default Baitap2;