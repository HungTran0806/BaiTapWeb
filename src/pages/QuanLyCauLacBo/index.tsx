import { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Switch,
  Drawer,
  Space,
  Tag,
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { clubsData, type Club } from '@/models/club';
import { registrationsData, type RegistrationApplication } from '@/models/registration';

export default function QuanLyCauLacBo() {
  const [clubs, setClubs] = useState(clubsData);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState<Club | null>(null);
  const [memberDrawerOpen, setMemberDrawerOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubMembers, setClubMembers] = useState<RegistrationApplication[]>([]);

  const handleShowModal = (record?: Club) => {
    form.resetFields();
    if (record) {
      setEditRecord(record);
      form.setFieldsValue(record);
    } else {
      setEditRecord(null);
    }
    setIsModalOpen(true);
  };

  const handleHideModal = () => {
    form.resetFields();
    setEditRecord(null);
    setIsModalOpen(false);
  };

  const handleDeleteClub = (id: string | number) => {
    setClubs(clubs.filter((item) => item.id !== id));
    message.success('Xóa câu lạc bộ thành công!');
  };

  const handleSaveClub = (values: any) => {
    if (editRecord) {
      setClubs(
        clubs.map((club) =>
          club.id === editRecord.id
            ? { ...club, ...values, updatedAt: new Date().toISOString() }
            : club
        )
      );
      message.success('Cập nhật câu lạc bộ thành công!');
    } else {
      const maxId = Math.max(...clubs.map((c) => Number(c.id)), 0);
      const newClub: Club = {
        id: maxId + 1,
        ...values,
        createdAt: new Date().toISOString(),
      };
      setClubs([...clubs, newClub]);
      message.success('Thêm câu lạc bộ thành công!');
    }
    handleHideModal();
  };

  const handleViewMembers = (club: Club) => {
    setSelectedClub(club);
    const members = registrationsData.filter(
      (app) => app.clubId === club.id && app.status === 'Approved'
    );
    setClubMembers(members);
    setMemberDrawerOpen(true);
  };

  const filteredClubs = clubs.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.director.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string) => (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#1890ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {avatar || '🏢'}
        </div>
      ),
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: (a: Club, b: Club) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      key: 'foundedDate',
      width: 120,
      sorter: (a: Club, b: Club) =>
        new Date(a.foundedDate).getTime() - new Date(b.foundedDate).getTime(),
    },
    {
      title: 'Chủ nhiệm CLB',
      dataIndex: 'director',
      key: 'director',
      width: 150,
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Có' : 'Không'}
        </Tag>
      ),
    },
    {
      title: 'Thành viên',
      dataIndex: 'memberCount',
      key: 'memberCount',
      width: 100,
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: Club) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleShowModal(record)}
          >
            Sửa
          </Button>
          <Button
            type="default"
            size="small"
            icon={<TeamOutlined />}
            onClick={() => handleViewMembers(record)}
          >
            Thành viên
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDeleteClub(record.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const memberColumns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 150,
    },
    {
      title: 'Sở trường',
      dataIndex: 'skills',
      key: 'skills',
      width: 180,
    },
  ];

  return (
    <>
      {/* Thanh công cụ */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Tìm theo tên CLB hoặc chủ nhiệm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleShowModal()}
        >
          Thêm câu lạc bộ
        </Button>
      </Space>

      {/* Bảng câu lạc bộ */}
      <Table
        columns={columns}
        dataSource={filteredClubs}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      {/* Modal thêm/sửa câu lạc bộ */}
      <Modal
        title={editRecord ? 'Chỉnh sửa câu lạc bộ' : 'Thêm câu lạc bộ'}
        visible={isModalOpen}
        onCancel={handleHideModal}
        onOk={() => form.submit()}
        width={700}
        okText={editRecord ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveClub}
          autoComplete="off"
        >
          <Form.Item
            label="Tên câu lạc bộ"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày thành lập"
            name="foundedDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập!' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Chủ nhiệm CLB"
            name="director"
            rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Hoạt động" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer xem danh sách thành viên */}
      <Drawer
        title={`Danh sách thành viên - ${selectedClub?.name}`}
        placement="right"
        onClose={() => setMemberDrawerOpen(false)}
        visible={memberDrawerOpen}
        width={1000}
      >
        <Table
          columns={memberColumns}
          dataSource={clubMembers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Drawer>
    </>
  );
}
