import { Card, Col, Row, Statistic, Tag, Timeline } from 'antd';
import { useMemo } from 'react';
import { useModel } from 'umi';
import ColumnChart from '@/components/Chart/ColumnChart';
import LineChart from '@/components/Chart/LineChart';
import './components/style.less';

const TrangChu = () => {
  const { workouts = [], getTotalWorkouts, getTotalCalories, getRecentWorkouts, getWorkoutsByMonth } = useModel('fitness.workouts');
  const { getWeightTrend } = useModel('fitness.health');
  const { goals = [], getCompletionPercentage } = useModel('fitness.goals');

  const totalWorkouts = useMemo(() => getTotalWorkouts?.() || 0, [getTotalWorkouts, workouts]);
  const totalCalories = useMemo(() => getTotalCalories?.() || 0, [getTotalCalories, workouts]);
  const goalCompletion = useMemo(() => getCompletionPercentage?.() || 0, [getCompletionPercentage, goals]);
  
  const recentWorkouts = useMemo(() => getRecentWorkouts?.(5) || [], [getRecentWorkouts, workouts]);
  
  const weeklyData = useMemo(() => {
    const byMonth = getWorkoutsByMonth?.();
    if (!byMonth) return { labels: [], values: [] };
    const labels = Object.keys(byMonth);
    const values = Object.values(byMonth) as number[];
    return { labels, values };
  }, [getWorkoutsByMonth, workouts]);

  const weightTrend = useMemo(() => {
    const trend = getWeightTrend?.() || [];
    return {
      labels: trend.map((item) => item.date),
      values: trend.map((item) => item.weight),
    };
  }, [getWeightTrend]);

  const calculateStreak = () => {
    if (!recentWorkouts || recentWorkouts.length === 0) return 0;
    let streak = 0;
    const workoutDates = new Set(recentWorkouts.map((item) => item.date));
    const currentDate = new Date();
    while (workoutDates.has(currentDate.toISOString().split('T')[0])) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  };

  const stats = [
    { title: 'Tổng buổi tập trong tháng', value: totalWorkouts, suffix: 'buổi' },
    { title: 'Tổng calo đã đốt', value: totalCalories, suffix: 'kcal' },
    { title: 'Số ngày tập liên tiếp', value: calculateStreak(), suffix: 'ngày' },
    { title: 'Mục tiêu hoàn thành', value: goalCompletion, suffix: '%' },
  ];

  return (
    <div className='dashboard-page'>
      <Row gutter={[16, 16]}>
        {stats.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item.title}>
            <Card className='overview-card'>
              <Statistic title={item.title} value={item.value} suffix={item.suffix} />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} className='dashboard-chart-row'>
        <Col xs={24} lg={16}>
          <Card title='Buổi tập theo tuần'>
            <ColumnChart title='Buổi tập theo tuần' xAxis={weeklyData.labels} yAxis={[weeklyData.values]} yLabel={['Buổi tập']} height={320} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title='5 buổi tập gần nhất'>
            <Timeline>
              {recentWorkouts.map((item) => (
                <Timeline.Item key={item.key} dot={<Tag color={item.status === 'Hoàn thành' ? 'green' : 'volcano'}>{item.status}</Tag>}>
                  <div className='timeline-item-title'>{item.exercise}</div>
                  <div className='timeline-item-desc'>{item.type} - {item.duration} phút, {item.calories} kcal</div>
                  <div className='timeline-item-date'>{item.date}</div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title='Cân nặng theo thời gian'>
            <LineChart title='Thay đổi cân nặng' xAxis={weightTrend.labels} yAxis={[weightTrend.values]} yLabel={['Cân nặng (kg)']} height={360} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TrangChu;
