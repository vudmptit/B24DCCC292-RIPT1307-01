import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Table,
  message,
  Divider,
  Modal,
  Tag,
  Space,
  Switch,
  DatePicker,
  Row,
  Col,
  Card
} from "antd";
import moment from "moment";
import ReactApexChart from "react-apexcharts";

const { Option } = Select;

const App = () => {
  const [clubs, setClubs] = useState<any[]>([
    {
      id: "1",
      avatar: "https://joeschmoe.io/api/v1/random",
      name: "CLB IT PTIT",
      foundedDate: "2010-01-01",
      description: "Code và công nghệ",
      leader: "Nguyễn Văn A",
      isActive: true,
    },
    {
      id: "2",
      avatar: "https://joeschmoe.io/api/v1/random2",
      name: "CLB Âm nhạc",
      foundedDate: "2015-05-15",
      description: "Giao lưu văn nghệ",
      leader: "Trần Thị B",
      isActive: true,
    },
  ]);

  const [registrations, setRegistrations] = useState<any[]>([
    {
      id: "r1",
      fullName: "Nguyễn Văn C",
      email: "nvc@gmail.com",
      phone: "0123456789",
      gender: "Nam",
      address: "Hà Nội",
      skills: "Lập trình",
      clubId: "1",
      reason: "Muốn học code",
      status: "Pending",
    },
    {
      id: "r2",
      fullName: "Lê Thị D",
      email: "ltd@gmail.com",
      phone: "0987654321",
      gender: "Nữ",
      address: "Hà Nội",
      skills: "Hát",
      clubId: "2",
      reason: "Yêu ca hát",
      status: "Approved",
    },
  ]);

  const [historyLogs, setHistoryLogs] = useState<any[]>([]);

  const [formClub] = Form.useForm();
  const [isModalClub, setIsModalClub] = useState(false);
  const [editingClub, setEditingClub] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const [viewMembersClubId, setViewMembersClubId] = useState<string | null>(null);

  const [selectedRegKeys, setSelectedRegKeys] = useState<React.Key[]>([]);
  const [isRejectModal, setIsRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isHistoryModal, setIsHistoryModal] = useState(false);

  const [selectedMemberKeys, setSelectedMemberKeys] = useState<React.Key[]>([]);
  const [isSwitchClubModal, setIsSwitchClubModal] = useState(false);
  const [targetClubId, setTargetClubId] = useState<string | null>(null);

  const openAddClub = () => {
    setEditingClub(null);
    formClub.resetFields();
    setIsModalClub(true);
  };

  const openEditClub = (record: any) => {
    setEditingClub(record);
    formClub.setFieldsValue({
      ...record,
      foundedDate: moment(record.foundedDate),
    });
    setIsModalClub(true);
  };

  const saveClub = (values: any) => {
    const newClub = {
      ...values,
      id: editingClub ? editingClub.id : Date.now().toString(),
      foundedDate: values.foundedDate.format("YYYY-MM-DD"),
    };

    if (editingClub) {
      setClubs(clubs.map((c) => (c.id === editingClub.id ? newClub : c)));
      message.success("Cập nhật CLB thành công");
    } else {
      setClubs([...clubs, newClub]);
      message.success("Thêm CLB thành công");
    }
    setIsModalClub(false);
  };

  const deleteClub = (id: string) => {
    Modal.confirm({
      title: "Xóa Câu lạc bộ",
      content: "Bạn có chắc muốn xóa CLB này không?",
      onOk: () => setClubs(clubs.filter((c) => c.id !== id)),
    });
  };

  const filteredClubs = clubs.filter((c) => 
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const clubColumns = [
    {
      title: "Ảnh",
      dataIndex: "avatar",
      render: (text: string) => (
        <img src={text} style={{ width: 40, height: 40, borderRadius: "50%" }} alt="avatar" />
      ),
    },
    { 
      title: "Tên CLB", 
      dataIndex: "name", 
      sorter: (a: any, b: any) => a.name.localeCompare(b.name) 
    },
    { 
      title: "Ngày thành lập", 
      dataIndex: "foundedDate", 
      sorter: (a: any, b: any) => new Date(a.foundedDate).getTime() - new Date(b.foundedDate).getTime() 
    },
    { title: "Chủ nhiệm", dataIndex: "leader" },
    {
      title: "Hoạt động",
      dataIndex: "isActive",
      render: (val: boolean) => (val ? <Tag color="green">Có</Tag> : <Tag color="red">Không</Tag>),
    },
    {
      title: "Thao tác",
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => setViewMembersClubId(record.id)}>Thành viên</Button>
          <Button type="link" onClick={() => openEditClub(record)}>Sửa</Button>
          <Button type="link" danger onClick={() => deleteClub(record.id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  const handleApprove = () => {
    if (selectedRegKeys.length === 0) return;
    Modal.confirm({
      title: `Duyệt ${selectedRegKeys.length} đơn?`,
      onOk: () => {
        const newData = [...registrations];
        selectedRegKeys.forEach((key) => {
          const item = newData.find((r) => r.id === key);
          if (item) item.status = "Approved";
        });
        setRegistrations(newData);
        
        setHistoryLogs([
          { 
            id: Date.now(),
            time: new Date().toLocaleString(), 
            action: `Admin đã Approved ${selectedRegKeys.length} đơn vào lúc ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}` 
          },
          ...historyLogs
        ]);
        
        setSelectedRegKeys([]);
        message.success("Đã duyệt đơn");
      },
    });
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối");
      return;
    }
    const newData = [...registrations];
    selectedRegKeys.forEach((key) => {
      const item = newData.find((r) => r.id === key);
      if (item) {
        item.status = "Rejected";
        item.rejectReason = rejectReason;
      }
    });
    setRegistrations(newData);
    
    setHistoryLogs([
      { 
        id: Date.now(),
        time: new Date().toLocaleString(), 
        action: `Admin đã Rejected ${selectedRegKeys.length} đơn lúc ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()} với lý do: ${rejectReason}` 
      },
      ...historyLogs
    ]);

    setSelectedRegKeys([]);
    setIsRejectModal(false);
    setRejectReason("");
    message.success("Đã từ chối đơn");
  };

  const regColumns = [
    { title: "Họ tên", dataIndex: "fullName" },
    { title: "SĐT", dataIndex: "phone" },
    { title: "Giới tính", dataIndex: "gender" },
    {
      title: "Câu lạc bộ",
      dataIndex: "clubId",
      render: (id: string) => clubs.find((c) => c.id === id)?.name || "Không rõ",
    },
    { title: "Lý do", dataIndex: "reason" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        let color = status === "Approved" ? "green" : status === "Rejected" ? "red" : "orange";
        return <Tag color={color}>{status}</Tag>
      },
    },
    { title: "Ghi chú", dataIndex: "rejectReason" },
  ];

  const approvedMembers = registrations.filter((r) => r.status === "Approved");

  const confirmSwitchClub = () => {
    if (!targetClubId) return message.error("Vui lòng chọn CLB chuyển đến");
    
    const newData = [...registrations];
    selectedMemberKeys.forEach((key) => {
      const item = newData.find((r) => r.id === key);
      if (item) item.clubId = targetClubId;
    });

    setRegistrations(newData);
    setSelectedMemberKeys([]);
    setIsSwitchClubModal(false);
    
    const targetClubName = clubs.find(c => c.id === targetClubId)?.name;
    message.success(`Đã chuyển ${selectedMemberKeys.length} thành viên sang ${targetClubName}`);
  };

  const chartOptions: any = {
    chart: { type: "bar" },
    xaxis: { categories: clubs.map((c) => c.name) },
    title: { text: "Số lượng đơn đăng ký theo CLB" },
  };

  const chartSeries = [
    {
      name: "Pending",
      data: clubs.map((c) => registrations.filter((r) => r.clubId === c.id && r.status === "Pending").length),
    },
    {
      name: "Approved",
      data: clubs.map((c) => registrations.filter((r) => r.clubId === c.id && r.status === "Approved").length),
    },
    {
      name: "Rejected",
      data: clubs.map((c) => registrations.filter((r) => r.clubId === c.id && r.status === "Rejected").length),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Divider orientation="left" style={{ fontSize: 20 }}>1. DANH SÁCH CÂU LẠC BỘ</Divider>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
        <Button type="primary" onClick={openAddClub}>
          + Thêm Câu lạc bộ
        </Button>
        <Input.Search 
          placeholder="Tìm kiếm CLB theo tên..." 
          style={{ width: 300 }}
          onSearch={(val) => setSearchText(val)}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table 
        columns={clubColumns} 
        dataSource={filteredClubs} 
        rowKey="id" 
        expandable={{
          expandedRowRender: (record) => <p dangerouslySetInnerHTML={{ __html: record.description }}></p>
        }}
      />
      
      <Modal 
        title={editingClub ? "Sửa Câu lạc bộ" : "Thêm Câu lạc bộ"} 
        visible={isModalClub} 
        onCancel={() => setIsModalClub(false)}
        onOk={() => formClub.submit()}
      >
        <Form form={formClub} layout="vertical" onFinish={saveClub}>
          <Form.Item name="name" label="Tên CLB" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="avatar" label="Ảnh đại diện (URL)">
            <Input />
          </Form.Item>
          <Form.Item name="foundedDate" label="Ngày thành lập" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="leader" label="Chủ nhiệm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (HTML)">
            <Input.TextArea rows={3} placeholder="Ví dụ: <b>Nội dung</b>" />
          </Form.Item>
          <Form.Item name="isActive" label="Đang hoạt động" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal 
        title={`Thành viên CLB ${clubs.find((c) => c.id === viewMembersClubId)?.name || ""}`}
        visible={!!viewMembersClubId}
        onCancel={() => setViewMembersClubId(null)}
        footer={null}
      >
        <Table 
          columns={[{ title: "Họ tên", dataIndex: "fullName" }, { title: "SĐT", dataIndex: "phone" }]}
          dataSource={approvedMembers.filter((r) => r.clubId === viewMembersClubId)}
          rowKey="id"
        />
      </Modal>

      <Divider orientation="left" style={{ fontSize: 20 }}>2. QUẢN LÝ ĐƠN ĐĂNG KÝ THÀNH VIÊN</Divider>
      
      <Space style={{ marginBottom: 15 }}>
        <Button 
          type="primary" 
          disabled={selectedRegKeys.length === 0} 
          onClick={handleApprove}
        >
          Duyệt {selectedRegKeys.length} đơn đã chọn
        </Button>
        <Button 
          danger 
          disabled={selectedRegKeys.length === 0} 
          onClick={() => { setRejectReason(""); setIsRejectModal(true); }}
        >
          Từ chối {selectedRegKeys.length} đơn đã chọn
        </Button>
        <Button onClick={() => setIsHistoryModal(true)}>
          Xem lịch sử thao tác
        </Button>
      </Space>

      <Table 
        rowSelection={{ selectedRowKeys: selectedRegKeys, onChange: setSelectedRegKeys }}
        columns={regColumns} 
        dataSource={registrations} 
        rowKey="id" 
      />

      <Modal 
        title="Nhập lý do từ chối" 
        visible={isRejectModal} 
        onOk={confirmReject} 
        onCancel={() => setIsRejectModal(false)}
      >
        <Input.TextArea 
          value={rejectReason} 
          onChange={(e) => setRejectReason(e.target.value)} 
          placeholder="Vì sao bạn từ chối đơn này? (Bắt buộc)" 
          rows={3}
        />
      </Modal>

      <Modal 
        title="Lịch sử thao tác" 
        visible={isHistoryModal} 
        onCancel={() => setIsHistoryModal(false)}
        footer={null}
        width={700}
      >
        <Table 
          columns={[
            { title: "Thời gian", dataIndex: "time" },
            { title: "Nội dung thao tác", dataIndex: "action" }
          ]} 
          dataSource={historyLogs} 
          rowKey="id" 
        />
      </Modal>

      <Divider orientation="left" style={{ fontSize: 20 }}>3. QUẢN LÝ THÀNH VIÊN CÂU LẠC BỘ</Divider>
      
      <Button 
        type="primary" 
        onClick={() => { setTargetClubId(null); setIsSwitchClubModal(true); }} 
        disabled={selectedMemberKeys.length === 0}
        style={{ marginBottom: 15 }}
      >
        Đổi CLB cho {selectedMemberKeys.length} thành viên đã chọn
      </Button>

      <Table 
        rowSelection={{ selectedRowKeys: selectedMemberKeys, onChange: setSelectedMemberKeys }}
        columns={regColumns.filter(c => c.dataIndex !== "status" && c.dataIndex !== "rejectReason")} 
        dataSource={approvedMembers} 
        rowKey="id" 
      />

      <Modal 
        title={`Đổi Câu lạc bộ cho ${selectedMemberKeys.length} thành viên`} 
        visible={isSwitchClubModal} 
        onOk={confirmSwitchClub} 
        onCancel={() => setIsSwitchClubModal(false)}
      >
        <Select 
          style={{ width: "100%" }} 
          placeholder="Vui lòng chọn CLB chuyển đến" 
          onChange={(val) => setTargetClubId(val)}
        >
          {clubs.map((c) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
        </Select>
      </Modal>

      <Divider orientation="left" style={{ fontSize: 20 }}>4. BÁO CÁO VÀ THỐNG KÊ</Divider>
      
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card title="Số lượng Câu lạc bộ">
            <h2>{clubs.length}</h2>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="Số đơn đăng ký">
            <Row>
              <Col span={8}><Tag color="orange">Pending</Tag> <h3>{registrations.filter(r => r.status === "Pending").length}</h3></Col>
              <Col span={8}><Tag color="green">Approved</Tag> <h3>{registrations.filter(r => r.status === "Approved").length}</h3></Col>
              <Col span={8}><Tag color="red">Rejected</Tag> <h3>{registrations.filter(r => r.status === "Rejected").length}</h3></Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <div style={{ background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #f0f0f0" }}>
        {typeof window !== "undefined" && (
          <ReactApexChart 
            options={chartOptions} 
            series={chartSeries} 
            type="bar" 
            height={350} 
          />
        )}
      </div>

    </div>
  );
};

export default App;
