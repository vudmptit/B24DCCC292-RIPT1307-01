import React, { useState, useEffect, useMemo } from "react";
import {
  Tabs,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  DatePicker,
  Card,
  Statistic,
  Row,
  Col,
} from "antd";
import moment from "moment";

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const initialProducts = [
  { id: 1, name: "Laptop Dell XPS 13", category: "Laptop", price: 25000000, quantity: 15 },
  { id: 2, name: "iPhone 15 Pro Max", category: "Điện thoại", price: 30000000, quantity: 8 },
  { id: 3, name: "Samsung Galaxy S24", category: "Điện thoại", price: 22000000, quantity: 20 },
  { id: 4, name: "iPad Air M2", category: "Máy tính bảng", price: 18000000, quantity: 5 },
  { id: 5, name: "MacBook Air M3", category: "Laptop", price: 28000000, quantity: 12 },
  { id: 6, name: "AirPods Pro 2", category: "Phụ kiện", price: 6000000, quantity: 0 },
  { id: 7, name: "Samsung Galaxy Tab S9", category: "Máy tính bảng", price: 15000000, quantity: 7 },
  { id: 8, name: "Logitech MX Master 3", category: "Phụ kiện", price: 2500000, quantity: 25 },
];

export default function TH01() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [detailOrder, setDetailOrder] = useState<any>(null);

  const [form] = Form.useForm();

  // ================= LOAD DATA =================
  useEffect(() => {
    const p = localStorage.getItem("products");
    const o = localStorage.getItem("orders");

    setProducts(p ? JSON.parse(p) : initialProducts);
    setOrders(o ? JSON.parse(o) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // ================= STATUS TAG =================
  const getStatusTag = (q: number) => {
    if (q === 0) return <Tag color="red">Hết hàng</Tag>;
    if (q <= 10) return <Tag color="orange">Sắp hết</Tag>;
    return <Tag color="green">Còn hàng</Tag>;
  };

  // ================= DASHBOARD =================
  const totalInventoryValue = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    [products]
  );

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status === "Hoàn thành")
        .reduce((sum, o) => sum + o.totalAmount, 0),
    [orders]
  );

  // ================= CREATE ORDER =================
  const handleCreateOrder = (values: any) => {
    const selectedProducts = values.products.map((id: number) => {
      const p = products.find((x) => x.id === id);
      return {
        productId: p.id,
        productName: p.name,
        quantity: values[`qty_${id}`],
        price: p.price,
      };
    });

    // Validate tồn kho
    for (let item of selectedProducts) {
      const product = products.find((p) => p.id === item.productId);
      if (item.quantity > product.quantity) {
        message.error(`Sản phẩm ${product.name} không đủ tồn kho`);
        return;
      }
    }

    const total = selectedProducts.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );

    const newOrder = {
      id: "DH" + Date.now(),
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      products: selectedProducts,
      totalAmount: total,
      status: "Chờ xử lý",
      createdAt: new Date().toISOString(),
    };

    setOrders([...orders, newOrder]);
    setVisible(false);
    form.resetFields();
  };

  // ================= CHANGE STATUS =================
  const changeStatus = (order: any, newStatus: string) => {
    let updatedProducts = [...products];

    if (newStatus === "Hoàn thành" && order.status !== "Hoàn thành") {
      order.products.forEach((item: any) => {
        updatedProducts = updatedProducts.map((p) =>
          p.id === item.productId
            ? { ...p, quantity: p.quantity - item.quantity }
            : p
        );
      });
    }

    if (newStatus === "Đã hủy" && order.status === "Hoàn thành") {
      order.products.forEach((item: any) => {
        updatedProducts = updatedProducts.map((p) =>
          p.id === item.productId
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      });
    }

    setProducts(updatedProducts);

    setOrders(
      orders.map((o) =>
        o.id === order.id ? { ...o, status: newStatus } : o
      )
    );
  };

  // ================= TABLE COLUMNS =================
  const productColumns = [
    { title: "STT", render: (_: any, __: any, i: number) => i + 1 },
    { title: "Tên", dataIndex: "name", sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
    { title: "Danh mục", dataIndex: "category" },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: (a: any, b: any) => a.price - b.price,
      render: (v: number) => v.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },
    {
      title: "Trạng thái",
      render: (_: any, r: any) => getStatusTag(r.quantity),
    },
  ];

  const orderColumns = [
    { title: "Mã", dataIndex: "id" },
    { title: "Khách hàng", dataIndex: "customerName" },
    {
      title: "Số SP",
      render: (_: any, r: any) => r.products.length,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
      render: (v: number) => v.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Trạng thái",
      render: (_: any, r: any) => (
        <Select
          value={r.status}
          style={{ width: 140 }}
          onChange={(v) => changeStatus(r, v)}
        >
          <Option value="Chờ xử lý">Chờ xử lý</Option>
          <Option value="Đang giao">Đang giao</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Đã hủy">Đã hủy</Option>
        </Select>
      ),
    },
    {
      title: "Ngày tạo",
      render: (_: any, r: any) =>
        moment(r.createdAt).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      render: (_: any, r: any) => (
        <Button onClick={() => setDetailOrder(r)}>Chi tiết</Button>
      ),
    },
  ];

  return (
    <>
      {/* DASHBOARD */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card><Statistic title="Tổng sản phẩm" value={products.length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Giá trị tồn kho" value={totalInventoryValue} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Tổng đơn hàng" value={orders.length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Doanh thu" value={totalRevenue} /></Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Quản lý Sản phẩm" key="1">
          <Table
            rowKey="id"
            columns={productColumns}
            dataSource={products}
            pagination={{ pageSize: 5 }}
          />
        </TabPane>

        <TabPane tab="Quản lý Đơn hàng" key="2">
          <Button type="primary" onClick={() => setVisible(true)}>
            Tạo đơn hàng
          </Button>

          <Table
            rowKey="id"
            columns={orderColumns}
            dataSource={orders}
            style={{ marginTop: 20 }}
          />
        </TabPane>
      </Tabs>

      {/* MODAL TẠO ĐƠN */}
      <Modal
        title="Tạo đơn hàng"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrder}>
          <Form.Item name="customerName" label="Tên KH" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="SĐT" rules={[
            { required: true },
            { pattern: /^[0-9]{10,11}$/, message: "Sai định dạng" }
          ]}>
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="products" label="Chọn sản phẩm" rules={[{ required: true }]}>
            <Select mode="multiple">
              {products.map(p => (
                <Option key={p.id} value={p.id}>{p.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL CHI TIẾT */}
      <Modal
        visible={!!detailOrder}
        footer={null}
        onCancel={() => setDetailOrder(null)}
        title="Chi tiết đơn hàng"
      >
        {detailOrder && (
          <>
            <p><b>Khách:</b> {detailOrder.customerName}</p>
            <p><b>SĐT:</b> {detailOrder.phone}</p>
            <p><b>Địa chỉ:</b> {detailOrder.address}</p>
            <Table
              rowKey="productId"
              pagination={false}
              columns={[
                { title: "Tên", dataIndex: "productName" },
                { title: "SL", dataIndex: "quantity" },
                { title: "Giá", dataIndex: "price" },
              ]}
              dataSource={detailOrder.products}
            />
          </>
        )}
      </Modal>
    </>
  );
}