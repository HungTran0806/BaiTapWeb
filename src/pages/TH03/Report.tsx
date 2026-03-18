import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import type { Appointment } from '@/models/types';

interface ReportProps {
  appointments?: Appointment[];
}

const ReportPage = ({ appointments: initialAppointments = [] }: ReportProps) => {
  const [services, setServices] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const s = localStorage.getItem('services');
    const st = localStorage.getItem('staffs');
    const a = localStorage.getItem('appointments');
    const r = localStorage.getItem('reviews');
    if (s) setServices(JSON.parse(s));
    if (st) setStaffs(JSON.parse(st));
    if (a) setAppointments(JSON.parse(a));
    if (r) setReviews(JSON.parse(r));
  }, []);
  return (
    <Card title="Báo cáo hệ thống">
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng dịch vụ"
              value={services.length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng nhân viên"
              value={staffs.length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng lịch hẹn"
              value={appointments.length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đánh giá"
              value={reviews.length}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};
export default ReportPage;