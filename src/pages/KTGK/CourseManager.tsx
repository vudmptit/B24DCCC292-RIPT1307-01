import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Table,
  message,
  Divider,
} from "antd";

const { Option } = Select;

const App = () => {
  const [courses, setCourses] = useState<any[]>([
    {
      id: "C01",
      name: "ReactJS Cơ bản",
      instructor: "Nguyễn Văn A",
      studentsCount: 150,
      description: "Khóa học React cơ bản",
      status: "Đang mở",
    },
    {
      id: "C02",
      name: "NodeJS Cơ bản",
      instructor: "Trần Thị B",
      studentsCount: 0,
      description: "Khóa học Backend",
      status: "Tạm dừng",
    },
  ]);

  const [result, setResult] = useState<any[]>([...courses]);

  const [form] = Form.useForm();

  const addCourse = (values: any) => {
    const exists = courses.find(
      (c) => c.name.toLowerCase() === values.name.toLowerCase()
    );
    if (exists) {
      message.error("Tên khóa học đã tồn tại, vui lòng chọn tên khác!");
      return;
    }

    const newCourse = {
      ...values,
      id: "C" + Date.now().toString().slice(-4),
    };

    const newData = [...courses, newCourse];
    setCourses(newData);
    setResult(newData);
    message.success("Thêm khóa học thành công");

    form.resetFields();
  };

  const deleteCourse = (record: any) => {
    if (record.studentsCount > 0) {
      message.error("Không thể xóa khóa học đã có học viên!");
      return;
    }

    if (window.confirm(`Bạn có chắc muốn xóa khóa học "${record.name}" không?`)) {
      const newData = courses.filter((c) => c.id !== record.id);
      setCourses(newData);
      setResult(newData);
      message.success("Đã xóa khóa học");
    }
  };

  const handleSearch = (values: any) => {
    let data = courses;

    if (values.name) {
      data = data.filter((c) => c.name.toLowerCase().includes(values.name.toLowerCase()));
    }
    if (values.instructor) {
      data = data.filter((c) => c.instructor === values.instructor);
    }
    if (values.status) {
      data = data.filter((c) => c.status === values.status);
    }

    setResult(data);
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên khóa học", dataIndex: "name" },
    { title: "Giảng viên", dataIndex: "instructor" },
    {
      title: "Số HV",
      dataIndex: "studentsCount",
      sorter: (a: any, b: any) => a.studentsCount - b.studentsCount
    },
    { title: "Trạng thái", dataIndex: "status" },
    {
      title: "Thao tác",
      render: (_: any, record: any) => (
        <Button danger type="link" onClick={() => deleteCourse(record)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>QUẢN LÝ KHÓA HỌC ONLINE</h1>

      <Divider>Thêm khóa học mới</Divider>
      <Form form={form} layout="vertical" onFinish={addCourse}>
        <Form.Item
          name="name"
          label="Tên khóa học"
          rules={[
            { required: true, message: "Vui lòng nhập tên khóa học" },
            { max: 100, message: "Tên khóa học tối đa 100 ký tự" },
          ]}
        >
          <Input placeholder="Nhập tên khóa học..." />
        </Form.Item>

        <Form.Item
          name="instructor"
          label="Giảng viên"
          rules={[{ required: true, message: "Vui lòng chọn giảng viên" }]}
        >
          <Select placeholder="Chọn giảng viên">
            <Option value="Nguyễn Văn A">Nguyễn Văn A</Option>
            <Option value="Trần Thị B">Trần Thị B</Option>
            <Option value="Lê Văn C">Lê Văn C</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="studentsCount"
          label="Số lượng học viên"
          rules={[{ required: true, message: "Vui lòng nhập số học viên" }]}
          initialValue={0}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="description" label="Mô tả khóa học (HTML)">
          <Input.TextArea placeholder="Ví dụ: <b>Nội dung HTML</b>" rows={3} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="Đang mở">Đang mở</Option>
            <Option value="Tạm dừng">Tạm dừng</Option>
            <Option value="Đã kết thúc">Đã kết thúc</Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Thêm khóa học
        </Button>
      </Form>

      <Divider>Tra cứu và Lọc</Divider>
      <Form layout="inline" onFinish={handleSearch}>
        <Form.Item name="name">
          <Input placeholder="Tìm theo tên..." />
        </Form.Item>

        <Form.Item name="instructor">
          <Select placeholder="Lọc giảng viên" style={{ width: 150 }} allowClear>
            <Option value="Nguyễn Văn A">Nguyễn Văn A</Option>
            <Option value="Trần Thị B">Trần Thị B</Option>
            <Option value="Lê Văn C">Lê Văn C</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status">
          <Select placeholder="Lọc trạng thái" style={{ width: 150 }} allowClear>
            <Option value="Đang mở">Đang mở</Option>
            <Option value="Tạm dừng">Tạm dừng</Option>
            <Option value="Đã kết thúc">Đã kết thúc</Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Tìm / Lọc
        </Button>
        <Button
          style={{ marginLeft: 8 }}
          onClick={() => setResult(courses)}
        >
          Hủy lọc
        </Button>
      </Form>

      <Divider>Danh sách khóa học</Divider>
      <Table
        dataSource={result}
        rowKey="id"
        columns={columns}
      />
    </div>
  );
};

export default App;
