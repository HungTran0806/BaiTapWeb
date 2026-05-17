import { Card, Tag, Space, Typography, Divider, Button } from 'antd';
import type { ExerciseItem } from '@/models/fitness/exercises';

type Props = {
  exercise: ExerciseItem;
  onEdit?: (item: ExerciseItem) => void;
  onDelete?: (key: string) => void;
  onClick?: (item: ExerciseItem) => void;
};

const ExerciseCard = ({ exercise, onEdit, onDelete, onClick }: Props) => {
  const difficultyColor = (d: string) => (d === 'Khó' ? 'red' : d === 'Trung bình' ? 'orange' : 'green');

  return (
    <Card hoverable onClick={() => onClick?.(exercise)}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Typography.Title level={5} style={{ margin: 0 }}>{exercise.name}</Typography.Title>
        <Space>
          <Tag>{exercise.muscleGroup}</Tag>
          <Tag color={difficultyColor(exercise.difficulty)}>{exercise.difficulty}</Tag>
        </Space>
        <div>{exercise.description}</div>
        <Divider style={{ margin: '8px 0' }} />
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>Calo: {exercise.caloriesPerHour} kcal/giờ</div>
          <Space>
            {onEdit && <Button type="link" onClick={(e) => { e.stopPropagation(); onEdit(exercise); }}>Sửa</Button>}
            {onDelete && <Button type="link" danger onClick={(e) => { e.stopPropagation(); onDelete(exercise.key); }}>Xóa</Button>}
          </Space>
        </Space>
      </Space>
    </Card>
  );
};

export default ExerciseCard;
