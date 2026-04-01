import { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Select,
  Drawer,
  Space,
  Tag,
  Row,
  Col,
  Card,
  Empty,
  Timeline,
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { registrationsData, type RegistrationApplication, type RegistrationStatus } from '@/models/registration';
import { clubsData } from '@/models/club';

export default function QuanLyDonDangKy() {
  const [registrations, setRegistrations] = useState(registrationsData);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState<RegistrationApplication | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RegistrationApplication | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [approveRejectModalOpen, setApproveRejectModalOpen] = useState(false);
  const [approveRejectType, setApproveRejectType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  const handleShowModal = (record?: RegistrationApplication) => {
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

  const handleDeleteRegistration = (id: string | number) => {
    setRegistrations(registrations.filter((item) => item.id !== id));
    message.success('Xóa đơn đăng ký thành công!');
  };

  const handleSaveRegistration = (values: any) => {
    const clubName = clubsData.find(c => c.id === values.clubId)?.name || '';
    
    if (editRecord) {
      setRegistrations(
        registrations.map((reg) =>
          reg.id === editRecord.id
            ? { ...reg, ...values, clubName, updatedAt: new Date().toISOString() }
            : reg
        )
      );
      message.success('Cập nhật đơn đăng ký thành công!');
    } else {
      const maxId = Math.max(...registrations.map((r) => Number(r.id)), 0);
      const newReg: RegistrationApplication = {
        id: maxId + 1,
        ...values,
        clubName,
        status: 'Pending',
        actionHistory: [],
        createdAt: new Date().toISOString(),
      };
      setRegistrations([...registrations, newReg]);
      message.success('Thêm đơn đăng ký thành công!');
    }
    handleHideModal();
  };

  const handleViewDetails = (record: RegistrationApplication) => {
    setSelectedRecord(record);
    setDetailDrawerOpen(true);
  };

  const handleApproveReject = (type: 'approve' | 'reject') => {
    if (selectedRowKeys.length === 0) {
      message.error('Vui lòng chọn ít nhất một đơn đăng ký');
      return;
    }
    setApproveRejectType(type);
    if (type === 'reject') {
      setRejectionReason('');
    }
    setApproveRejectModalOpen(true);
  };

  const handleConfirmApproveReject = () => {
    if (approveRejectType === 'reject' && !rejectionReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }

    const timestamp = new Date().toLocaleString('vi-VN');
    const adminName = 'Admin ' + Math.floor(Math.random() * 10);

    setRegistrations(
      registrations.map((reg) => {
        if (selectedRowKeys.includes(reg.id)) {
          const newHistory: any[] = [
            ...reg.actionHistory,
            {
              id: (reg.actionHistory.length + 1),
              action: (approveRejectType === 'approve' ? 'Approved' : 'Rejected') as 'Approved' | 'Rejected',
              adminName,
              timestamp,
              reason: approveRejectType === 'reject' ? rejectionReason : 'Hồ sơ đầy đủ',
            },
          ];

          return {
            ...reg,
            status: (approveRejectType === 'approve' ? 'Approved' : 'Rejected') as any,
            rejectionReason: approveRejectType === 'reject' ? rejectionReason : reg.rejectionReason,
            actionHistory: newHistory,
            updatedAt: new Date().toISOString(),
          };
        }
        return reg;
      })
    );

    message.success(
      `${approveRejectType === 'approve' ? 'Duyệt' : 'Từ chối'} ${selectedRowKeys.length} đơn đăng ký thành công!`
    );
    setApproveRejectModalOpen(false);
    setSelectedRowKeys([]);
    setRejectionReason('');
  };

  const handleViewHistory = (record: RegistrationApplication) => {
    setSelectedRecord(record);
    setHistoryDrawerOpen(true);
  };

  const filteredRegistrations = registrations.filter(
    (item) =>
      (item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase())) &&
      (filterStatus === '' || item.status === filterStatus)
  );

  const getStatusColor = (status: RegistrationStatus) => {
    switch (status) {
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      case 'Pending':
      default:
        return 'orange';
    }
  };

  const getStatusText = (status: RegistrationStatus) => {
    switch (status) {
      case 'Approved':
        return 'Đã duyệt';
      case 'Rejected':
        return 'Từ chối';
      case 'Pending':
      default:
        return 'Chờ duyệt';
    }
  };

  const columns = [
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
      sorter: (a: RegistrationApplication, b: RegistrationApplication) =>
        a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 170,
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
      width: 100,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 150,
    },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubName',
      key: 'clubName',
      width: 150,
      sorter: (a: RegistrationApplication, b: RegistrationApplication) =>
        (a.clubName || '').localeCompare(b.clubName || ''),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: RegistrationStatus) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: 'Chờ duyệt', value: 'Pending' },
        { text: 'Đã duyệt', value: 'Approved' },
        { text: 'Từ chối', value: 'Rejected' },
      ],
      onFilter: (value: any, record: RegistrationApplication) =>
        record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right' as const,
      width: 200,
      render: (_: any, record: RegistrationApplication) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleShowModal(record)}
          >
            Sửa
          </Button>
          {record.actionHistory.length > 0 && (
            <Button
              type="default"
              size="small"
              icon={<HistoryOutlined />}
              onClick={() => handleViewHistory(record)}
            >
              Lịch sử
            </Button>
          )}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDeleteRegistration(record.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <>
      {/* Thanh công cụ */}
      <Space style={{ marginBottom: 20 }} wrap>
        <Input
          placeholder="Tìm theo tên hoặc email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 150 }}
          placeholder="Lọc theo trạng thái"
          allowClear
        >
          <Select.Option value="">Tất cả</Select.Option>
          <Select.Option value="Pending">Chờ duyệt</Select.Option>
          <Select.Option value="Approved">Đã duyệt</Select.Option>
          <Select.Option value="Rejected">Từ chối</Select.Option>
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleShowModal()}
        >
          Thêm đơn đăng ký
        </Button>
      </Space>

      {/* Nút duyệt/từ chối nhiều */}
      {selectedRowKeys.length > 0 && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleApproveReject('approve')}
            >
              Duyệt {selectedRowKeys.length} đơn đã chọn
            </Button>
          </Col>
          <Col>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => handleApproveReject('reject')}
            >
              Từ chối {selectedRowKeys.length} đơn đã chọn
            </Button>
          </Col>
        </Row>
      )}

      {/* Bảng đơn đăng ký */}
      <Table
        columns={columns}
        dataSource={filteredRegistrations}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1500 }}
        rowSelection={rowSelection}
      />

      {/* Modal thêm/sửa đơn đăng ký */}
      <Modal
        title={editRecord ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký'}
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
          onFinish={handleSaveRegistration}
          autoComplete="off"
        >
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select>
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Sở trường"
            name="skills"
            rules={[{ required: true, message: 'Vui lòng nhập sở trường!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Câu lạc bộ"
            name="clubId"
            rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ!' }]}
          >
            <Select placeholder="Chọn câu lạc bộ">
              {clubsData.map((club) => (
                <Select.Option key={club.id} value={club.id}>
                  {club.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Lý do đăng ký"
            name="registrationReason"
            rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer xem chi tiết */}
      <Drawer
        title="Chi tiết đơn đăng ký"
        placement="right"
        onClose={() => setDetailDrawerOpen(false)}
        visible={detailDrawerOpen}
        width={600}
      >
        {selectedRecord && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <p>
                <strong>Họ tên:</strong> {selectedRecord.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedRecord.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedRecord.phone}
              </p>
              <p>
                <strong>Giới tính:</strong> {selectedRecord.gender}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedRecord.address}
              </p>
              <p>
                <strong>Sở trường:</strong> {selectedRecord.skills}
              </p>
              <p>
                <strong>Câu lạc bộ:</strong> {selectedRecord.clubName}
              </p>
              <p>
                <strong>Lý do đăng ký:</strong> {selectedRecord.registrationReason}
              </p>
              <p>
                <strong>Trạng thái:</strong>{' '}
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {getStatusText(selectedRecord.status)}
                </Tag>
              </p>
              {selectedRecord.rejectionReason && (
                <p>
                  <strong>Lý do từ chối:</strong> {selectedRecord.rejectionReason}
                </p>
              )}
            </Card>
          </div>
        )}
      </Drawer>

      {/* Drawer xem lịch sử */}
      <Drawer
        title={`Lịch sử thao tác - ${selectedRecord?.fullName}`}
        placement="right"
        onClose={() => setHistoryDrawerOpen(false)}
        visible={historyDrawerOpen}
        width={600}
      >
        {selectedRecord && selectedRecord.actionHistory.length > 0 ? (
          <Timeline>
            {selectedRecord.actionHistory.map((history) => (
              <Timeline.Item key={history.id} color={history.action === 'Approved' ? 'green' : 'red'}>
                <p>
                  <strong>{history.adminName}</strong> đã{' '}
                  {history.action === 'Approved' ? 'duyệt' : 'từ chối'} vào lúc{' '}
                  <strong>{history.timestamp}</strong>
                  {history.reason && (
                    <>
                      <br />
                      <small>Lý do: {history.reason}</small>
                    </>
                  )}
                </p>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Empty description="Chưa có lịch sử thao tác" />
        )}
      </Drawer>

      {/* Modal duyệt/từ chối nhiều */}
      <Modal
        title={
          approveRejectType === 'approve'
            ? `Xác nhận duyệt ${selectedRowKeys.length} đơn đăng ký`
            : `Xác nhận từ chối ${selectedRowKeys.length} đơn đăng ký`
        }
        visible={approveRejectModalOpen}
        onCancel={() => setApproveRejectModalOpen(false)}
        onOk={handleConfirmApproveReject}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        {approveRejectType === 'reject' && (
          <Form layout="vertical">
            <Form.Item
              label="Lý do từ chối"
              required
            >
              <Input.TextArea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
}
