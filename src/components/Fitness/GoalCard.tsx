import { Card, Tag, Progress, Space, Typography, InputNumber, Button } from 'antd';
import type { GoalRecord } from '@/models/fitness/goals';

type Props = {
  goal: GoalRecord;
  onUpdateCurrentValue?: (key: string, value: number) => void;
  onDelete?: (key: string) => void;
};

const GoalCard = ({ goal, onUpdateCurrentValue, onDelete }: Props) => {
  const progress = Math.max(0, Math.min(100, Math.round((goal.currentValue / (goal.targetValue || 1)) * 100)));
  const statusColor = goal.status === 'Đã đạt' ? 'green' : goal.status === 'Đã hủy' ? 'red' : 'blue';

  return (
    <Card size="small" bordered>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>{goal.title}</Typography.Title>
          <Tag color="purple">{goal.type}</Tag>
          <div>
            <div>Target: {goal.targetValue}</div>
            <div>
              Current:{' '}
              <InputNumber min={0} value={goal.currentValue} onChange={(value) => onUpdateCurrentValue?.(goal.key, Number(value ?? 0))} />
            </div>
            <div>Deadline: {goal.deadline}</div>
            <div style={{ marginTop: 8 }}><Tag color={statusColor}>{goal.status}</Tag></div>
          </div>
        </Space>
        <Progress percent={progress} />
        <Space>
          {onDelete && <Button type="text" danger onClick={() => onDelete(goal.key)}>Xóa</Button>}
        </Space>
      </Space>
    </Card>
  );
};

export default GoalCard;
