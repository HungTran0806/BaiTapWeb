import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Select } from 'antd';
import {
  DollarOutlined, EnvironmentOutlined, CalendarOutlined,
  UserOutlined, BarChartOutlined
} from '@ant-design/icons';
import Chart from 'react-apexcharts';
import moment from 'moment';
import TravelLayout from './index';
import styles from './Statistics.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface StatisticsData {
  totalItineraries: number;
  totalRevenue: number;
  popularDestinations: {
    name: string;
    visits: number;
    revenue: number;
  }[];
  monthlyData: {
    month: string;
    itineraries: number;
    revenue: number;
  }[];
  categoryRevenue: {
    category: string;
    amount: number;
  }[];
}

const Statistics: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData>({
    totalItineraries: 0,
    totalRevenue: 0,
    popularDestinations: [],
    monthlyData: [],
    categoryRevenue: [],
  });
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().subtract(6, 'months'),
    moment()
  ]);
  const [period, setPeriod] = useState('monthly');

  const loadStatistics = () => {
    // Mock data - in real app, this would come from API
    const mockData: StatisticsData = {
      totalItineraries: 1250,
      totalRevenue: 450000000,
      popularDestinations: [
        { name: 'Đà Nẵng', visits: 450, revenue: 180000000 },
        { name: 'Hà Nội', visits: 380, revenue: 152000000 },
        { name: 'TP.HCM', visits: 320, revenue: 128000000 },
        { name: 'Nha Trang', visits: 280, revenue: 112000000 },
        { name: 'Đà Lạt', visits: 220, revenue: 88000000 },
      ],
      monthlyData: [
        { month: '2024-01', itineraries: 180, revenue: 72000000 },
        { month: '2024-02', itineraries: 220, revenue: 88000000 },
        { month: '2024-03', itineraries: 195, revenue: 78000000 },
        { month: '2024-04', itineraries: 250, revenue: 100000000 },
        { month: '2024-05', itineraries: 280, revenue: 112000000 },
        { month: '2024-06', itineraries: 320, revenue: 128000000 },
      ],
      categoryRevenue: [
        { category: 'Ăn uống', amount: 135000000 },
        { category: 'Lưu trú', amount: 225000000 },
        { category: 'Di chuyển', amount: 90000000 },
      ],
    };
    setStatistics(mockData);
  };

  useEffect(() => {
    loadStatistics();
  }, [dateRange, period]);

  // Chart options for monthly revenue
  const monthlyChartOptions = {
    chart: {
      type: 'line' as const,
      height: 350,
    },
    stroke: {
      curve: 'smooth' as const,
    },
    xaxis: {
      categories: statistics.monthlyData.map(item => item.month),
    },
    yaxis: {
      title: {
        text: 'Doanh thu (VND)',
      },
    },
    colors: ['#1890ff'],
  };

  const monthlyChartSeries = [{
    name: 'Doanh thu',
    data: statistics.monthlyData.map(item => item.revenue)
  }];

  // Chart options for category revenue
  const categoryChartOptions = {
    chart: {
      type: 'donut' as const,
    },
    labels: statistics.categoryRevenue.map(item => item.category),
    colors: ['#1890ff', '#52c41a', '#faad14'],
    legend: {
      position: 'bottom' as const,
    },
  };

  const categoryChartSeries = statistics.categoryRevenue.map(item => item.amount);

  const destinationColumns = [
    {
      title: 'Điểm đến',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượt truy cập',
      dataIndex: 'visits',
      key: 'visits',
      sorter: (a: any, b: any) => a.visits - b.visits,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `${revenue.toLocaleString()} VND`,
      sorter: (a: any, b: any) => a.revenue - b.revenue,
    },
  ];

  const content = (
    <div className={styles.statistics}>
      <div className={styles.header}>
        <h1>Thống kê</h1>
        <div className={styles.filters}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [moment.Moment, moment.Moment])}
          />
          <Select value={period} onChange={setPeriod} style={{ width: 120, marginLeft: 16 }}>
            <Option value="monthly">Theo tháng</Option>
            <Option value="weekly">Theo tuần</Option>
            <Option value="daily">Theo ngày</Option>
          </Select>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng lịch trình"
              value={statistics.totalItineraries}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={statistics.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="VND"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Điểm đến phổ biến"
              value={statistics.popularDestinations.length}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Doanh thu trung bình"
              value={statistics.totalRevenue / statistics.totalItineraries}
              prefix={<BarChartOutlined />}
              suffix="VND/lịch trình"
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} lg={12}>
          <Card title="Doanh thu theo tháng" className={styles.chartCard}>
            <Chart
              options={monthlyChartOptions}
              series={monthlyChartSeries}
              type="line"
              height={350}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Doanh thu theo hạng mục" className={styles.chartCard}>
            <Chart
              options={categoryChartOptions}
              series={categoryChartSeries}
              type="donut"
              height={350}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Điểm đến phổ biến" style={{ marginTop: 24 }}>
        <Table
          columns={destinationColumns}
          dataSource={statistics.popularDestinations}
          pagination={false}
          rowKey="name"
        />
      </Card>
    </div>
  );

  return <TravelLayout>{content}</TravelLayout>;
};

export default Statistics;