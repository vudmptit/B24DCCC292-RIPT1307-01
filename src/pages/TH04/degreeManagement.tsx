import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  InputNumber,
  Table,
  message,
  Divider,
} from "antd";

const { Option } = Select;

const App = () => {
  const [soList, setSoList] = useState([
    { id: 1, year: 2025, currentNumber: 0 },
  ]);

  const [quyetDinhs, setQuyetDinhs] = useState<any[]>([]);

  const [fields, setFields] = useState<any[]>([
    { name: "Điểm TB", type: "number" },
    { name: "Nơi sinh", type: "string" },
  ]);

  const [vanBangs, setVanBangs] = useState<any[]>([]);

  const [result, setResult] = useState<any[]>([]);
  const [countMap, setCountMap] = useState<any>({});

  const getNextNumber = (soId: number) => {
    const newList = [...soList];
    const so = newList.find((s) => s.id === soId);
    if (!so) return 1;

    so.currentNumber += 1;
    setSoList(newList);

    return so.currentNumber;
  };

  const renderField = (f: any) => {
    if (f.type === "string") return <Input />;
    if (f.type === "number")
      return <InputNumber style={{ width: "100%" }} />;
    if (f.type === "date")
      return <DatePicker style={{ width: "100%" }} />;
  };

  const addField = (values: any) => {
    setFields([...fields, values]);
    message.success("Đã thêm field");
  };

  const addQD = (values: any) => {
    setQuyetDinhs([...quyetDinhs, values]);
    message.success("Đã thêm quyết định");
  };

  const addVB = (values: any) => {
    const soVaoSo = getNextNumber(values.soVanBangId);

    const newVB = {
      ...values,
      soVaoSo,
      ngaySinh: values.ngaySinh?.format("YYYY-MM-DD"),
    };

    setVanBangs([...vanBangs, newVB]);
    message.success("Thêm văn bằng thành công");
  };

  const handleSearch = (values: any) => {
    const count = Object.values(values).filter((v) => v).length;

    if (count < 2) {
      message.error("Nhập ít nhất 2 điều kiện");
      return;
    }

    const data = vanBangs.filter(
      (vb) =>
        (!values.soHieu || vb.soHieu === values.soHieu) &&
        (!values.maSV || vb.maSV === values.maSV)
    );

    setResult(data);

    data.forEach((vb) => {
      setCountMap((prev: any) => ({
        ...prev,
        [vb.quyetDinhId]: (prev[vb.quyetDinhId] || 0) + 1,
      }));
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>QUẢN LÝ VĂN BẰNG</h1>

      <Divider>Sổ văn bằng</Divider>
      <Table
        dataSource={soList}
        rowKey="id"
        columns={[
          { title: "Năm", dataIndex: "year" },
          { title: "Số hiện tại", dataIndex: "currentNumber" },
        ]}
      />

      <Divider>Quyết định</Divider>
      <Form layout="inline" onFinish={addQD}>
        <Form.Item name="soQD">
          <Input placeholder="Số QĐ" />
        </Form.Item>

        <Form.Item name="ngay">
          <DatePicker />
        </Form.Item>

        <Form.Item name="soVanBangId">
          <Select placeholder="Chọn sổ" style={{ width: 120 }}>
            {soList.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.year}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Button htmlType="submit">Thêm</Button>
      </Form>

      <Divider>Cấu hình field</Divider>
      <Form layout="inline" onFinish={addField}>
        <Form.Item name="name">
          <Input placeholder="Tên field" />
        </Form.Item>

        <Form.Item name="type">
          <Select style={{ width: 120 }}>
            <Option value="string">String</Option>
            <Option value="number">Number</Option>
            <Option value="date">Date</Option>
          </Select>
        </Form.Item>

        <Button htmlType="submit">Thêm</Button>
      </Form>

      <Divider>Thêm văn bằng</Divider>
      <Form layout="vertical" onFinish={addVB}>
        <Form.Item name="soHieu" label="Số hiệu">
          <Input />
        </Form.Item>

        <Form.Item name="maSV" label="Mã SV">
          <Input />
        </Form.Item>

        <Form.Item name="hoTen" label="Họ tên">
          <Input />
        </Form.Item>

        <Form.Item name="ngaySinh" label="Ngày sinh">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="soVanBangId" label="Sổ">
          <Select>
            {soList.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.year}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="quyetDinhId" label="Quyết định">
          <Select>
            {quyetDinhs.map((qd, index) => (
              <Option key={index} value={index}>
                {qd.soQD}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {fields.map((f) => (
          <Form.Item
            key={f.name}
            name={["dynamic", f.name]}
            label={f.name}
          >
            {renderField(f)}
          </Form.Item>
        ))}

        <Button type="primary" htmlType="submit">
          Thêm
        </Button>
      </Form>

      <Divider>Danh sách văn bằng</Divider>
      <Table
        dataSource={vanBangs}
        rowKey="soVaoSo"
        columns={[
          { title: "Số vào sổ", dataIndex: "soVaoSo" },
          { title: "Số hiệu", dataIndex: "soHieu" },
          { title: "Mã SV", dataIndex: "maSV" },
          { title: "Họ tên", dataIndex: "hoTen" },
        ]}
      />

      <Divider>Tra cứu</Divider>
      <Form layout="inline" onFinish={handleSearch}>
        <Form.Item name="soHieu">
          <Input placeholder="Số hiệu" />
        </Form.Item>

        <Form.Item name="maSV">
          <Input placeholder="Mã SV" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Tìm
        </Button>
      </Form>

      <Table
        style={{ marginTop: 20 }}
        dataSource={result}
        rowKey="soVaoSo"
        columns={[
          { title: "Số vào sổ", dataIndex: "soVaoSo" },
          { title: "Số hiệu", dataIndex: "soHieu" },
          { title: "Mã SV", dataIndex: "maSV" },
          { title: "Họ tên", dataIndex: "hoTen" },
        ]}
      />

      <Divider>Lượt tra cứu theo quyết định</Divider>
      <pre>{JSON.stringify(countMap, null, 2)}</pre>
    </div>
  );
};

export default App;