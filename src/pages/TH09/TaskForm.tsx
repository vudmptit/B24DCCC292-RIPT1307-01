import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';
import { ITask } from './data';
import moment from 'moment';

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  initialValues: ITask | null;
}

const { Option } = Select;
const { TextArea } = Input;

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCancel, onSave, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          deadline: initialValues.deadline ? moment(initialValues.deadline) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : null,
      };
      onSave(formattedValues);
    });
  };

  return (
    <Modal
      title={initialValues ? 'Sửa công việc' : 'Thêm công việc'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="name"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
        >
          <Input placeholder="Nhập tên công việc" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} placeholder="Nhập mô tả chi tiết công việc" />
        </Form.Item>

        <Form.Item name="deadline" label="Deadline">
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày hết hạn" />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Mức độ ưu tiên"
          initialValue="Medium"
          rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
        >
          <Select placeholder="Chọn mức độ ưu tiên">
            <Option value="High">Cao</Option>
            <Option value="Medium">Trung bình</Option>
            <Option value="Low">Thấp</Option>
          </Select>
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <Select mode="tags" style={{ width: '100%' }} placeholder="Nhập và ấn Enter để thêm tags">
            <Option value="Học tập">Học tập</Option>
            <Option value="Làm việc">Làm việc</Option>
            <Option value="Cá nhân">Cá nhân</Option>
            <Option value="Quan trọng">Quan trọng</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;
