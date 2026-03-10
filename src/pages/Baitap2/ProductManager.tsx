import { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Input, Select } from 'antd';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const sampleProducts: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
];

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('products');
    if (saved) setProducts(JSON.parse(saved));
    else setProducts(sampleProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const getStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Hết hàng', color: 'red' };
    if (quantity <= 10) return { text: 'Sắp hết', color: 'orange' };
    return { text: 'Còn hàng', color: 'green' };
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter ? p.category === categoryFilter : true)
    );
  }, [products, search, categoryFilter]);

  const columns = [
    {
      title: 'STT',
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: 'Tên sản phẩm', dataIndex: 'name' },
    { title: 'Danh mục', dataIndex: 'category' },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a: Product, b: Product) => a.price - b.price,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      sorter: (a: Product, b: Product) => a.quantity - b.quantity,
    },
    {
      title: 'Trạng thái',
      render: (_: any, record: Product) => {
        const status = getStatus(record.quantity);
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
  ];

  return (
    <>
      <Input
        placeholder="Tìm theo tên"
        style={{ width: 200, marginRight: 10 }}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        placeholder="Lọc danh mục"
        style={{ width: 200 }}
        onChange={(value) => setCategoryFilter(value)}
        allowClear
      >
        <Select.Option value="Laptop">Laptop</Select.Option>
        <Select.Option value="Điện thoại">Điện thoại</Select.Option>
        <Select.Option value="Máy tính bảng">Máy tính bảng</Select.Option>
      </Select>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredProducts}
        pagination={{ pageSize: 5 }}
        style={{ marginTop: 20 }}
      />
    </>
  );
};

export default ProductManager;