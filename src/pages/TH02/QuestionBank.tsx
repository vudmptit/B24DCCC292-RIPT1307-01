import { useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message
} from "antd";

const { TabPane } = Tabs;
const { TextArea } = Input;

interface Question {
  id: number;
  content: string;
  difficulty: string;
}

const QuestionBank = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exam, setExam] = useState<Question[]>([]);
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

  const addQuestion = () => {
    form.validateFields().then((values) => {
      const newQuestion = {
        id: Date.now(),
        ...values
      };

      setQuestions([...questions, newQuestion]);
      setVisible(false);
      form.resetFields();
    });
  };

  const generateExam = () => {
    if (questions.length === 0) {
      message.error("Chưa có câu hỏi");
      return;
    }

    const random = [...questions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    setExam(random);
    message.success("Đã tạo đề thi");
  };

  return (
    <Tabs defaultActiveKey="1">
      {/* TAB CÂU HỎI */}
      <TabPane tab="Câu hỏi" key="1">
        <Button type="primary" onClick={() => setVisible(true)}>
          Thêm câu hỏi
        </Button>

        <Table
          dataSource={questions}
          rowKey="id"
          columns={[
            { title: "Nội dung", dataIndex: "content" },
            {
              title: "Độ khó",
              dataIndex: "difficulty",
              render: (d) => <Tag>{d}</Tag>
            }
          ]}
        />

        <Modal
          title="Thêm câu hỏi"
          visible={visible}
          onOk={addQuestion}
          onCancel={() => setVisible(false)}
        >
          <Form form={form}>
            <Form.Item name="content" label="Nội dung">
              <TextArea />
            </Form.Item>

            <Form.Item name="difficulty" label="Độ khó">
              <Select>
                <Select.Option value="Dễ">Dễ</Select.Option>
                <Select.Option value="Trung bình">Trung bình</Select.Option>
                <Select.Option value="Khó">Khó</Select.Option>
                <Select.Option value="Rất khó">Rất khó</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </TabPane>

      {/* TAB ĐỀ THI */}
      <TabPane tab="Đề thi" key="2">
        <Button type="primary" onClick={generateExam}>
          Tạo đề thi
        </Button>

        <Table
          dataSource={exam}
          rowKey="id"
          columns={[
            { title: "Câu hỏi", dataIndex: "content" },
            { title: "Độ khó", dataIndex: "difficulty" }
          ]}
        />
      </TabPane>
    </Tabs>
  );
};

export default QuestionBank;