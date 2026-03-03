import { useState, useEffect } from "react";
import { Card, Input, Button, List, Typography, InputNumber } from "antd";

const { Title, Text } = Typography;

interface Subject {
  id: number;
  name: string;
  monthlyTarget: number;
}

const StudyManager = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [target, setTarget] = useState<number | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("subjects");
    if (data) {
      setSubjects(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    if (!name || !target) return;

    const newSubject: Subject = {
      id: Date.now(),
      name,
      monthlyTarget: target,
    };

    setSubjects([...subjects, newSubject]);
    setName("");
    setTarget(null);
  };

  const deleteSubject = (id: number) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  return (
    <Card style={{ width: 600, margin: "40px auto" }}>
      <Title level={3}>Quản Lý Môn Học</Title>

      <Input
        placeholder="Tên môn học"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <InputNumber
        placeholder="Mục tiêu giờ học / tháng"
        value={target ?? undefined}
        onChange={(value) => setTarget(value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <Button type="primary" onClick={addSubject}>
        Thêm môn học
      </Button>

      <List
        style={{ marginTop: 20 }}
        bordered
        dataSource={subjects}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button danger onClick={() => deleteSubject(item.id)}>
                Xóa
              </Button>,
            ]}
          >
            <Text>
              {item.name} - Mục tiêu: {item.monthlyTarget} giờ
            </Text>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default StudyManager;