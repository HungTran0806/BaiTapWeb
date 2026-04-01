import { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Popconfirm,
  message,
  Select,
  Drawer,
  Space,
  Row,
  Col,
  Card,
  Empty,
} from 'antd';
import {
  DeleteOutlined,
  SwapOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { registrationsData, type RegistrationApplication } from '@/models/registration';
import { clubsData } from '@/models/club';
export default function QuanLyThanhVienCLB() {
  const [members, setMembers] = useState<RegistrationApplication[]>(
    registrationsData.filter((app) => app.status === 'Approved')
  );
  const [selectedClub, setSelectedClub] = useState<string | number>(
    clubsData.length > 0 ? clubsData[0].id : ''
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferForm] = Form.useForm();
  const [targetClub, setTargetClub] = useState<string | number>();
  const [memberDetailDrawerOpen, setMemberDetailDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<RegistrationApplication | null>(null);

  const clubMembers = members.filter((member) => member.clubId === selectedClub);

  const handleTransferMembers = () => {
    if (selectedRowKeys.length === 0) {
      message.error('Vui lòng chọn ít nhất một thành viên');
      return;
    }
    setTransferModalOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (!targetClub) {
      message.error('Vui lòng chọn câu lạc bộ đích');
      return;
    }

    const targetClubName = clubsData.find(c => c.id === targetClub)?.name || '';
    const memberCount = selectedRowKeys.length;
    
    // Confirm transfer
    Modal.confirm({
      title: 'Xác nhận chuyển câu lạc bộ',
      content: `Bạn sắp chuyển ${memberCount} thành viên sang "${targetClubName}". Bạn có chắc chắn?`,
      okText: 'Chuyển',
      cancelText: 'Hủy',
      onOk() {
        setMembers(
          members.map((member) => {
            if (selectedRowKeys.includes(member.id)) {
              return {
                ...member,
                clubId: targetClub,
                clubName: targetClubName,
                updatedAt: new Date().toISOString(),
              };
            }
            return member;
          })
        );

        message.success(
          `Đã chuyển ${memberCount} thành viên sang "${targetClubName}"!`
        );
        setTransferModalOpen(false);
        setSelectedRowKeys([]);
        setTargetClub(undefined);
        transferForm.resetFields();
      },
    });
  };

  const handleViewMemberDetail = (record: RegistrationApplication) => {
    setSelectedMember(record);
    setMemberDetailDrawerOpen(true);
  };

  const handleDeleteMember = (id: string | number) => {
    setMembers(members.filter((item) => item.id !== id));
    message.success('Xóa thành viên thành công!');
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
      title: 'Sở trường',
      dataIndex: 'skills',
      key: 'skills',
      width: 150,
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: RegistrationApplication) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewMemberDetail(record)}
          >
            Chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDeleteMember(record.id)}
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
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <label style={{ marginRight: 8 }}>Chọn câu lạc bộ:</label>
            <Select
              value={selectedClub}
              onChange={setSelectedClub}
              style={{ width: '100%' }}
            >
              {clubsData.map((club) => (
                <Select.Option key={club.id} value={club.id}>
                  {club.name} ({members.filter(m => m.clubId === club.id).length})
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={16}>
            <Space>
              {selectedRowKeys.length > 0 && (
                <Button
                  type="primary"
                  icon={<SwapOutlined />}
                  onClick={handleTransferMembers}
                >
                  Chuyển {selectedRowKeys.length} thành viên
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        {/* Statistics Card */}
        <Card size="small">
          <Row gutter={16}>
            <Col xs={12} sm={8}>
              <div>
                <p style={{ color: '#999', fontSize: 12 }}>Tổng thành viên</p>
                <p style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {clubMembers.length}
                </p>
              </div>
            </Col>
            <Col xs={12} sm={8}>
              <div>
                <p style={{ color: '#999', fontSize: 12 }}>Câu lạc bộ hiện tại</p>
                <p style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>
                  {clubsData.find((c) => c.id === selectedClub)?.name}
                </p>
              </div>
            </Col>
            <Col xs={12} sm={8}>
              <div>
                <p style={{ color: '#999', fontSize: 12 }}>Đã chọn</p>
                <p style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
                  {selectedRowKeys.length}
                </p>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Members Table */}
      {clubMembers.length > 0 ? (
        <Table
          columns={columns}
          dataSource={clubMembers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
          rowSelection={rowSelection}
        />
      ) : (
        <Empty description="Không có thành viên" />
      )}

      {/* Transfer Modal */}
      <Modal
        title={`Chuyển ${selectedRowKeys.length} thành viên sang câu lạc bộ khác`}
        visible={transferModalOpen}
        onCancel={() => setTransferModalOpen(false)}
        onOk={handleConfirmTransfer}
        width={600}
        okText="Chuyển"
        cancelText="Hủy"
      >
        <Form form={transferForm} layout="vertical">
          <Form.Item label="Chọn câu lạc bộ đích">
            <Select
              placeholder="Chọn câu lạc bộ"
              value={targetClub}
              onChange={setTargetClub}
            >
              {clubsData
                .filter((c) => c.id !== selectedClub)
                .map((club) => (
                  <Select.Option key={club.id} value={club.id}>
                    {club.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Card size="small">
            <p>
              <strong>Từ:</strong>{' '}
              {clubsData.find((c) => c.id === selectedClub)?.name}
            </p>
            <p>
              <strong>Đến:</strong>{' '}
              {targetClub
                ? clubsData.find((c) => c.id === targetClub)?.name
                : 'Chưa chọn'}
            </p>
            <p>
              <strong>Số thành viên:</strong> {selectedRowKeys.length}
            </p>
          </Card>
        </Form>
      </Modal>

      {/* Member Detail Drawer */}
      <Drawer
        title="Chi tiết thành viên"
        placement="right"
        onClose={() => setMemberDetailDrawerOpen(false)}
        visible={memberDetailDrawerOpen}
        width={600}
      >
        {selectedMember && (
          <Card size="small">
            <p>
              <strong>Họ tên:</strong> {selectedMember.fullName}
            </p>
            <p>
              <strong>Email:</strong> {selectedMember.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {selectedMember.phone}
            </p>
            <p>
              <strong>Giới tính:</strong> {selectedMember.gender}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {selectedMember.address}
            </p>
            <p>
              <strong>Sở trường:</strong> {selectedMember.skills}
            </p>
            <p>
              <strong>Câu lạc bộ:</strong> {selectedMember.clubName}
            </p>
            <p>
              <strong>Lý do đăng ký:</strong> {selectedMember.registrationReason}
            </p>
            <p>
              <strong>Ngày đăng ký:</strong> {selectedMember.createdAt}
            </p>
          </Card>
        )}
      </Drawer>
    </>
  );
}
