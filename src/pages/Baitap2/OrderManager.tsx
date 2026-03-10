import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import dayjs from 'dayjs';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: any[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    const savedProducts = localStorage.getItem('products');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const handleCreateOrder = (values: any) => {
    const selectedProducts = values.products.map((id: number) => {
      const product = products.find((p) => p.id === id);
      return {
        productId: product?.id,
        productName: product?.name,
        quantity: values[`quantity_${id}`],
        price: product?.price,
      };
    });

    const totalAmount = selectedProducts.reduce(
      (sum: number, p: any) => sum + p.price * p.quantity,
      0
    );

    const newOrder: Order = {
      id: 'DH' + (orders.length + 1).toString().padStart(3, '0'),
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      products: selectedProducts,
      totalAmount,
      status: 'Chờ xử lý',
      createdAt: dayjs().format('YYYY-MM-DD'),
    };

    setOrders([...orders, newOrder]);
    message.success('Tạo đơn hàng thành công');
    setOpen(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Mã đơn', dataIndex: 'id' },
    { title: 'Khách hàng', dataIndex: 'customerName' },
    { title: 'Tổng tiền', dataIndex: 'totalAmount' },
    { title: 'Trạng thái', dataIndex: 'status' },
    { title: 'Ngày tạo', dataIndex: 'createdAt' },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Tạo đơn hàng
      </Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={orders}
        pagination={{ pageSize: 5 }}
        style={{ marginTop: 20 }}
      />

      <Modal visible={open} onCancel={() => setOpen(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleCreateOrder}>
          <Form.Item name="customerName" label="Tên khách" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="SĐT" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="products" label="Chọn sản phẩm" rules={[{ required: true }]}>
            <Select mode="multiple">
              {products.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OrderManager;