import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { useLocation, Link } from 'umi';
import {
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  SettingOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import styles from './index.less';

const { Header, Content, Sider } = Layout;

interface TravelLayoutProps {
  children: React.ReactNode;
}

const TravelLayout: React.FC<TravelLayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/travel',
      icon: <HomeOutlined />,
      label: <Link to="/travel">Khám phá điểm đến</Link>,
    },
    {
      key: '/travel/itinerary',
      icon: <CalendarOutlined />,
      label: <Link to="/travel/itinerary">Tạo lịch trình</Link>,
    },
    {
      key: '/travel/budget',
      icon: <DollarOutlined />,
      label: <Link to="/travel/budget">Quản lý ngân sách</Link>,
    },
    {
      key: '/travel/admin',
      icon: <SettingOutlined />,
      label: <Link to="/travel/admin">Quản lý điểm đến</Link>,
    },
    {
      key: '/travel/statistics',
      icon: <BarChartOutlined />,
      label: <Link to="/travel/statistics">Thống kê</Link>,
    },
  ];

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const items = [{ title: 'Du lịch' }];

    if (path === '/travel') {
      items.push({ title: 'Khám phá điểm đến' });
    } else if (path === '/travel/itinerary') {
      items.push({ title: 'Tạo lịch trình' });
    } else if (path === '/travel/budget') {
      items.push({ title: 'Quản lý ngân sách' });
    } else if (path === '/travel/admin') {
      items.push({ title: 'Quản lý điểm đến' });
    } else if (path === '/travel/statistics') {
      items.push({ title: 'Thống kê' });
    }

    return items;
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>
          <h2 style={{ color: 'white', margin: 0 }}>Travel Planner</h2>
        </div>
      </Header>
      <Layout>
        <Sider width={250} className={styles.sider}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className={styles.menu}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb
            items={getBreadcrumbItems()}
            style={{ margin: '16px 0' }}
          />
          <Content className={styles.content}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default TravelLayout;