import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Alert, Table, Tag } from 'antd';
import { DollarOutlined, PieChartOutlined, WarningOutlined } from '@ant-design/icons';
import Chart from 'react-apexcharts';
import type { BudgetCategory } from '@/models/travel';
import TravelLayout from './index';
import styles from './Budget.less';

const Budget: React.FC = () => {
  const [budgetData, setBudgetData] = useState<BudgetCategory[]>([
    { name: 'Ăn uống', amount: 3000000, color: '#1890ff' },
    { name: 'Lưu trú', amount: 5000000, color: '#52c41a' },
    { name: 'Di chuyển', amount: 2000000, color: '#faad14' },
    { name: 'Vui chơi', amount: 1500000, color: '#f5222d' },
    { name: 'Mua sắm', amount: 1000000, color: '#722ed1' },
  ]);

  const [totalBudget, setTotalBudget] = useState(10000000);
  const [spent, setSpent] = useState(8500000);

  const totalSpent = budgetData.reduce((sum, item) => sum + item.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentageUsed = (totalSpent / totalBudget) * 100;

  // Chart options for pie chart
  const pieChartOptions = {
    chart: {
      type: 'pie' as const,
    },
    labels: budgetData.map(item => item.name),
    colors: budgetData.map(item => item.color),
    legend: {
      position: 'bottom' as const,
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const pieChartSeries = budgetData.map(item => item.amount);

  // Chart options for bar chart
  const barChartOptions = {
    chart: {
      type: 'bar' as const,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: budgetData.map(item => item.name),
    },
    colors: budgetData.map(item => item.color),
  };

  const barChartSeries = [{
    data: budgetData.map(item => item.amount)
  }];

  const columns = [
    {
      title: 'Hạng mục',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: BudgetCategory) => (
        <span>
          <Tag color={record.color}>{text}</Tag>
        </span>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: 'Tỷ lệ',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (_: any, record: BudgetCategory) => {
        const percentage = (record.amount / totalSpent) * 100;
        return `${percentage.toFixed(1)}%`;
      },
    },
  ];

  const content = (
    <div className={styles.budget}>
      <div className={styles.header}>
        <h1>Quản lý ngân sách</h1>
        <p>Theo dõi và phân bổ ngân sách cho chuyến đi</p>
      </div>

      {percentageUsed > 90 && (
        <Alert
          message="Cảnh báo vượt ngân sách"
          description={`Bạn đã sử dụng ${percentageUsed.toFixed(1)}% ngân sách. Hãy cân nhắc điều chỉnh chi tiêu.`}
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng ngân sách"
              value={totalBudget}
              prefix={<DollarOutlined />}
              suffix="VND"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã chi tiêu"
              value={totalSpent}
              prefix={<DollarOutlined />}
              suffix="VND"
              valueStyle={{ color: totalSpent > totalBudget ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Còn lại"
              value={remaining}
              prefix={<DollarOutlined />}
              suffix="VND"
              valueStyle={{ color: remaining < 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tỷ lệ sử dụng"
              value={percentageUsed}
              suffix="%"
              precision={1}
            />
            <Progress
              percent={percentageUsed}
              status={percentageUsed > 100 ? 'exception' : 'active'}
              strokeColor={percentageUsed > 100 ? '#cf1322' : '#52c41a'}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} lg={12}>
          <Card title="Phân bổ ngân sách (Biểu đồ tròn)" className={styles.chartCard}>
            <Chart
              options={pieChartOptions}
              series={pieChartSeries}
              type="pie"
              height={350}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Phân bổ ngân sách (Biểu đồ cột)" className={styles.chartCard}>
            <Chart
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height={350}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Chi tiết ngân sách" style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={budgetData}
          pagination={false}
          rowKey="name"
        />
      </Card>
    </div>
  );

  return <TravelLayout>{content}</TravelLayout>;
};

export default Budget;