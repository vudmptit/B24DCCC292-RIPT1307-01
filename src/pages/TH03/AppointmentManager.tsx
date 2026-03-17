import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  message
} from "antd";

interface Appointment {
  id: number;
  employee: string;
  service: string;
  time: string;
  status: string;
}

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const addAppointment = () => {
    form.validateFields().then((values) => {
      const newItem: Appointment = {
        id: Date.now(),
        employee: values.employee,
        service: values.service,
        time: values.time.format("YYYY-MM-DD HH:mm"),
        status: "Chờ duyệt"
      };

      const conflict = appointments.some(
        (a) =>
          a.employee === newItem.employee &&
          a.time === newItem.time
      );

      if (conflict) {
        message.error("Nhân viên đã có lịch vào thời gian này");
        return;
      }

      setAppointments([...appointments, newItem]);
      setVisible(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "employee"
    },
    {
      title: "Dịch vụ",
      dataIndex: "service"
    },
    {
      title: "Thời gian",
      dataIndex: "time"
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        let color = "blue";

        if (status === "Xác nhận") color = "green";
        if (status === "Hủy") color = "red";

        return <Tag color={color}>{status}</Tag>;
      }
    }
  ];

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Đặt lịch
      </Button>

      <Table
        dataSource={appointments}
        columns={columns}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        title="Đặt lịch hẹn"
        visible={visible}
        onOk={addAppointment}
        onCancel={() => setVisible(false)}
      >
        <Form form={form}>
          <Form.Item
            name="employee"
            label="Nhân viên"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Nhân viên A">Nhân viên A</Select.Option>
              <Select.Option value="Nhân viên B">Nhân viên B</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="service"
            label="Dịch vụ"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Cắt tóc">Cắt tóc</Select.Option>
              <Select.Option value="Spa">Spa</Select.Option>
              <Select.Option value="Khám bệnh">Khám bệnh</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="time"
            label="Thời gian"
            rules={[{ required: true }]}
          >
            <DatePicker showTime />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AppointmentManager;