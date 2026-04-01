import { useMemo } from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import ColumnChart from '@/components/Chart/ColumnChart';
import { clubsData } from '@/models/club';
import { registrationsData } from '@/models/registration';

export default function BaoCaoThongKe() {

  // Calculate statistics
  const stats = useMemo(() => {
    const totalClubs = clubsData.length;
    const totalPending = registrationsData.filter((r) => r.status === 'Pending').length;
    const totalApproved = registrationsData.filter((r) => r.status === 'Approved').length;
    const totalRejected = registrationsData.filter((r) => r.status === 'Rejected').length;
    const totalRegistrations = registrationsData.length;

    return {
      totalClubs,
      totalPending,
      totalApproved,
      totalRejected,
      totalRegistrations,
      activeClubs: clubsData.filter((c) => c.isActive).length,
    };
  }, []);

  // Data for ColumnChart
  const columnChartData = useMemo(() => {
    const clubList = clubsData;

    const pendingData = clubList.map((club) =>
      registrationsData.filter(
        (r) => r.clubId === club.id && r.status === 'Pending'
      ).length
    );

    const approvedData = clubList.map((club) =>
      registrationsData.filter(
        (r) => r.clubId === club.id && r.status === 'Approved'
      ).length
    );

    const rejectedData = clubList.map((club) =>
      registrationsData.filter(
        (r) => r.clubId === club.id && r.status === 'Rejected'
      ).length
    );

    return {
      xAxis: clubList.map((c) => c.name),
      yAxis: [pendingData, approvedData, rejectedData],
      yLabel: ['Chờ duyệt', 'Đã duyệt', 'Từ chối'],
    };
  }, []);

  // Club statistics table data
  const clubStatsData = useMemo(() => {
    return clubsData.map((club) => {
      const pending = registrationsData.filter(
        (r) => r.clubId === club.id && r.status === 'Pending'
      ).length;
      const approved = registrationsData.filter(
        (r) => r.clubId === club.id && r.status === 'Approved'
      ).length;
      const rejected = registrationsData.filter(
        (r) => r.clubId === club.id && r.status === 'Rejected'
      ).length;
      const total = pending + approved + rejected;

      return {
        id: club.id,
        name: club.name,
        director: club.director,
        pending,
        approved,
        rejected,
        total,
        isActive: club.isActive,
      };
    });
  }, []);

  const tableColumns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'director',
      key: 'director',
      width: 150,
    },
    {
      title: 'Chờ duyệt',
      dataIndex: 'pending',
      key: 'pending',
      width: 100,
      render: (text: number) => <span style={{ color: '#faaa39' }}>{text}</span>,
      sorter: (a: any, b: any) => a.pending - b.pending,
    },
    {
      title: 'Đã duyệt',
      dataIndex: 'approved',
      key: 'approved',
      width: 100,
      render: (text: number) => <span style={{ color: '#52c41a' }}>{text}</span>,
      sorter: (a: any, b: any) => a.approved - b.approved,
    },
    {
      title: 'Từ chối',
      dataIndex: 'rejected',
      key: 'rejected',
      width: 100,
      render: (text: number) => <span style={{ color: '#f5222d' }}>{text}</span>,
      sorter: (a: any, b: any) => a.rejected - b.rejected,
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'total',
      key: 'total',
      width: 100,
      render: (text: number) => <strong>{text}</strong>,
      sorter: (a: any, b: any) => a.total - b.total,
    },
  ];

  return (
    <div className="baocao-thongke">
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card">
            <Statistic
              title="Tổng câu lạc bộ"
              value={stats.totalClubs}
              valueStyle={{ color: '#1890ff' }}
            />
            <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
              Hoạt động: <strong>{stats.activeClubs}</strong>
            </p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card">
            <Statistic
              title="Tổng đơn đăng ký"
              value={stats.totalRegistrations}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card">
            <div style={{ display: 'flex', gap: 16 }}>
              <div>
                <Statistic
                  title="Chờ duyệt"
                  value={stats.totalPending}
                  valueStyle={{ color: '#faaa39' }}
                />
              </div>
              <div>
                <Statistic
                  title="Đã duyệt"
                  value={stats.totalApproved}
                  valueStyle={{ color: '#52c41a' }}
                />
              </div>
              <div>
                <Statistic
                  title="Từ chối"
                  value={stats.totalRejected}
                  valueStyle={{ color: '#f5222d' }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Card style={{ marginBottom: 24 }}>
        <ColumnChart
          title="Số đơn đăng ký theo câu lạc bộ"
          xAxis={columnChartData.xAxis}
          yAxis={columnChartData.yAxis}
          yLabel={columnChartData.yLabel}
          formatY={(val) => val.toString()}
          colors={['#faaa39', '#52c41a', '#f5222d']}
          height={400}
        />
      </Card>

      {/* Detailed Table */}
      <Card title="Thống kê chi tiết theo câu lạc bộ">
        <Table
          columns={tableColumns}
          dataSource={clubStatsData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      </Card>

      {/* Registration Status Breakdown */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Phân bố trạng thái đơn đăng ký">
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#faaa39',
                  }}
                />
                <span>Chờ duyệt:</span>
                <strong>
                  {stats.totalPending} đơn (
                  {((stats.totalPending / stats.totalRegistrations) * 100).toFixed(1)}%)
                </strong>
              </div>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#52c41a',
                  }}
                />
                <span>Đã duyệt:</span>
                <strong>
                  {stats.totalApproved} đơn (
                  {((stats.totalApproved / stats.totalRegistrations) * 100).toFixed(1)}%)
                </strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#f5222d',
                  }}
                />
                <span>Từ chối:</span>
                <strong>
                  {stats.totalRejected} đơn (
                  {((stats.totalRejected / stats.totalRegistrations) * 100).toFixed(1)}%)
                </strong>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Thống kê câu lạc bộ">
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: '#999', fontSize: 12 }}>Câu lạc bộ hoạt động</p>
                <p style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                  {stats.activeClubs}/{stats.totalClubs}
                </p>
              </div>
              <div>
                <p style={{ color: '#999', fontSize: 12 }}>Câu lạc bộ không hoạt động</p>
                <p style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>
                  {stats.totalClubs - stats.activeClubs}/{stats.totalClubs}
                </p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Top Club Statistics */}
      <Card title="10 câu lạc bộ có số đơn đăng ký nhiều nhất" style={{ marginTop: 24 }}>
        <Table
          columns={[
            {
              title: 'Xếp hạng',
              dataIndex: 'id',
              key: 'id',
              width: 80,
              render: (_: any, __: any, index: number) => (
                <span style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: index < 3 ? ['#ffd700', '#c0c0c0', '#cd7f32'][index] : '#999'
                }}>
                  #{index + 1}
                </span>
              ),
            },
            {
              title: 'Tên câu lạc bộ',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Tổng đơn',
              dataIndex: 'total',
              key: 'total',
              render: (text: number) => <strong>{text}</strong>,
            },
            {
              title: 'Duyệt được',
              dataIndex: 'approved',
              key: 'approved',
              render: (text: number) => <span style={{ color: '#52c41a' }}>{text}</span>,
            },
          ]}
          dataSource={clubStatsData.sort((a, b) => b.total - a.total).slice(0, 10)}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}
