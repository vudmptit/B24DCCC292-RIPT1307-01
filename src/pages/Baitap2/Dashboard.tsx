import { Card, Statistic, Row, Col } from 'antd';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedOrders = localStorage.getItem('orders');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  const revenue = orders
    .filter((o) => o.status === 'Hoàn thành')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic title="Tổng sản phẩm" value={products.length} />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic title="Giá trị tồn kho" value={totalInventoryValue} />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic title="Tổng đơn hàng" value={orders.length} />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic title="Doanh thu" value={revenue} />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;