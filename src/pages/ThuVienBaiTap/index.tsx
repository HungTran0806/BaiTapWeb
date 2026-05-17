import { Button, Card, Col, Divider, Input, InputNumber, Modal, Row, Select, Space, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import type { ExerciseItem } from '@/models/fitness/exercises';

const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
const difficulties = ['Dễ', 'Trung bình', 'Khó'];

const ThuVienBaiTap = () => {
  const { exercises, addExercise, updateExercise, deleteExercise } = useModel('fitness.exercises');
  const [searchName, setSearchName] = useState<string>('');
  const [filterGroup, setFilterGroup] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [selected, setSelected] = useState<ExerciseItem | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<ExerciseItem | null>(null);
  const [formData, setFormData] = useState<Partial<ExerciseItem>>({ muscleGroup: muscleGroups[0], difficulty: difficulties[0], caloriesPerHour: 300 });

  const filteredData = useMemo(() => {
    return (exercises || []).filter((item: ExerciseItem) => {
      const matchesName = item.name.toLowerCase().includes(searchName.trim().toLowerCase());
      const matchesGroup = filterGroup ? item.muscleGroup === filterGroup : true;
      const matchesDifficulty = filterDifficulty ? item.difficulty === filterDifficulty : true;
      return matchesName && matchesGroup && matchesDifficulty;
    });
  }, [exercises, filterDifficulty, filterGroup, searchName]);

  const openDetail = (item: ExerciseItem) => {
    setSelected(item);
  };

  const openForm = (item?: ExerciseItem) => {
    setEditing(item ?? null);
    setOpen(true);
    if (item) {
      setFormData(item);
    } else {
      setFormData({ muscleGroup: muscleGroups[0], difficulty: difficulties[0], caloriesPerHour: 300 });
    }
  };

  const saveExercise = () => {
    if (!formData.name || !formData.details || !formData.description) return;
    if (editing) {
      updateExercise(editing.key, { ...editing, ...formData } as ExerciseItem);
    } else {
      addExercise(formData as Omit<ExerciseItem, 'key'>);
    }
    setOpen(false);
    setEditing(null);
    setFormData({ muscleGroup: muscleGroups[0], difficulty: difficulties[0], caloriesPerHour: 300 });
  };

  const deleteCurrentExercise = (key: string) => {
    deleteExercise(key);
  };

  const renderDifficultyTag = (difficulty: string) => {
    const color = difficulty === 'Khó' ? 'red' : difficulty === 'Trung bình' ? 'orange' : 'green';
    return <Tag color={color}>{difficulty}</Tag>;
  };

  return (
    <div>
      <Card title='Thư viện bài tập' extra={<Button type='primary' onClick={() => openForm()}>Thêm bài tập</Button>}>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input placeholder='Tìm tên bài tập' value={searchName} onChange={(event) => setSearchName(event.target.value)} allowClear style={{ minWidth: 240 }} />
          <Select placeholder='Nhóm cơ' value={filterGroup || undefined} onChange={(value) => setFilterGroup(value)} allowClear style={{ minWidth: 180 }}>
            {muscleGroups.map((group) => (
              <Select.Option key={group} value={group}>
                {group}
              </Select.Option>
            ))}
          </Select>
          <Select placeholder='Mức độ khó' value={filterDifficulty || undefined} onChange={(value) => setFilterDifficulty(value)} allowClear style={{ minWidth: 180 }}>
            {difficulties.map((level) => (
              <Select.Option key={level} value={level}>
                {level}
              </Select.Option>
            ))}
          </Select>
        </Space>
        <Row gutter={[16, 16]}>
          {filteredData.map((exercise: ExerciseItem) => (
            <Col xs={24} md={12} xl={8} key={exercise.key}>
              <Card hoverable onClick={() => openDetail(exercise)}>
                <Space direction='vertical' style={{ width: '100%' }}>
                  <Typography.Title level={5}>{exercise.name}</Typography.Title>
                  <Space wrap>
                    <Tag>{exercise.muscleGroup}</Tag>
                    {renderDifficultyTag(exercise.difficulty)}
                  </Space>
                  <div>{exercise.description}</div>
                  <Divider style={{ margin: '12px 0' }} />
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <span>Calo trung bình: {exercise.caloriesPerHour} kcal/giờ</span>
                    <Space>
                      <Button type='link' onClick={(event) => { event.stopPropagation(); openForm(exercise); }}>
                        Sửa
                      </Button>
                      <Button type='link' danger onClick={(event) => { event.stopPropagation(); deleteCurrentExercise(exercise.key); }}>
                        Xóa
                      </Button>
                    </Space>
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      <Modal title={editing ? 'Sửa bài tập' : 'Thêm bài tập'} visible={open} onCancel={() => setOpen(false)} onOk={saveExercise} destroyOnClose>
        <Space direction='vertical' style={{ width: '100%' }} size='middle'>
          <div>
            <div style={{ marginBottom: 8 }}>Tên bài tập</div>
            <Input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>Nhóm cơ tác động</div>
            <Select value={formData.muscleGroup} onChange={(value) => setFormData({ ...formData, muscleGroup: value })} style={{ width: '100%' }}>
              {muscleGroups.map((group) => (
                <Select.Option key={group} value={group}>
                  {group}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>Mức độ khó</div>
            <Select value={formData.difficulty} onChange={(value) => setFormData({ ...formData, difficulty: value })} style={{ width: '100%' }}>
              {difficulties.map((level) => (
                <Select.Option key={level} value={level}>
                  {level}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>Mô tả ngắn</div>
            <Input value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>Calo đốt trung bình/giờ</div>
            <InputNumber min={0} value={formData.caloriesPerHour} onChange={(value) => setFormData({ ...formData, caloriesPerHour: Number(value ?? 0) })} style={{ width: '100%' }} />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>Hướng dẫn</div>
            <Input.TextArea value={formData.details} onChange={(event) => setFormData({ ...formData, details: event.target.value })} rows={4} />
          </div>
        </Space>
      </Modal>
      <Modal title='Chi tiết bài tập' visible={!!selected} onCancel={() => setSelected(null)} footer={null} destroyOnClose>
        {selected && (
          <Space direction='vertical' style={{ width: '100%' }} size='middle'>
            <Typography.Title level={5}>{selected.name}</Typography.Title>
            <Space wrap>
              <Tag>{selected.muscleGroup}</Tag>
              {renderDifficultyTag(selected.difficulty)}
            </Space>
            <div>{selected.description}</div>
            <div style={{ marginTop: 12 }}>
              <strong>Calo trung bình/giờ:</strong> {selected.caloriesPerHour} kcal
            </div>
            <div style={{ marginTop: 12 }}>
              <strong>Hướng dẫn:</strong>
              <p>{selected.details}</p>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default ThuVienBaiTap;
