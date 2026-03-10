import { Tabs } from 'antd';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import Dashboard from './Dashboard';

const { TabPane } = Tabs;

const Baitap2 = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Dashboard" key="1">
        <Dashboard />
      </TabPane>

      <TabPane tab="Quản lý sản phẩm" key="2">
        <ProductManager />
      </TabPane>

      <TabPane tab="Quản lý đơn hàng" key="3">
        <OrderManager />
      </TabPane>
    </Tabs>
  );
};

export default Baitap2;