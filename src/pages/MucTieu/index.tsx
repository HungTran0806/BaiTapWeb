import { Button, Card, Col, Descriptions, Divider, Drawer, InputNumber, Row, Segmented, Select, Space, Tag, Tooltip, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import type { GoalRecord } from '@/models/fitness/goals';

const goalTypes = ['Giảm cân', 'Tăng cơ', 'Cải thiện sức bền', 'Khác'];
const statuses = ['Đang thực hiện', 'Đã đạt', 'Đã hủy'];

const MucTieu = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useModel('fitness.goals');
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string | number>('Tất cả');
  const [newGoal, setNewGoal] = useState<Partial<GoalRecord>>({ type: goalTypes[0], status: statuses[0], targetValue: 1, currentValue: 0, deadline: '' });

  const filteredGoals = useMemo(() => {
    if (filterStatus === 'Tất cả') return goals || [];
    return (goals || []).filter((item: GoalRecord) => item.status === filterStatus);
  }, [filterStatus, goals]);

  const createGoal = () => {
    const { title, deadline, targetValue, currentValue, type, status } = newGoal;
    if (!title || !deadline || targetValue === undefined || targetValue === null) {
      return;
    }
    addGoal({
      title,
      type: type ?? 'Khác',
      targetValue,
      currentValue: currentValue ?? 0,
      deadline,
      status: status ?? 'Đang thực hiện',
    });
    setDrawerVisible(false);
    setNewGoal({ type: goalTypes[0], status: statuses[0], targetValue: 1, currentValue: 0, deadline: '' });
  };

  const updateCurrentValue = (key: string, value: number) => {
    const goal = goals?.find((item: GoalRecord) => item.key === key);
    if (goal) {
      updateGoal(key, { ...goal, currentValue: value });
    }
  };

  const deleteCurrentGoal = (key: string) => {
    deleteGoal(key);
  };

  const getStatusColor = (status: string) => {
    return status === 'Đã đạt' ? 'green' : status === 'Đã hủy' ? 'red' : 'blue';
  };

  const getProgress = (item: GoalRecord) => {
    const result = Math.min(100, Math.round((item.currentValue / item.targetValue) * 100));
    return result >= 0 ? result : 0;
  };

  return (
    <div>
      <Card title='Quản lý mục tiêu' extra={<Button type='primary' onClick={() => setDrawerVisible(true)}>Thêm mục tiêu</Button>}>
        <Segmented options={['Tất cả', ...statuses]} value={filterStatus} onChange={(value) => setFilterStatus(value as string)} />
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {filteredGoals.map((goal: GoalRecord) => (
            <Col xs={24} md={12} xl={8} key={goal.key}>
              <Card size='small' bordered>
                <Space direction='vertical' style={{ width: '100%' }}>
                  <Space direction='vertical' size={4} style={{ width: '100%' }}>
                    <Typography.Title level={5}>{goal.title}</Typography.Title>
                    <Tag color='purple'>{goal.type}</Tag>
                    <Descriptions column={1} size='small' colon={false}>
                      <Descriptions.Item label='Giá trị mục tiêu'>{goal.targetValue}</Descriptions.Item>
                      <Descriptions.Item label='Giá trị hiện tại'>
                        <InputNumber min={0} value={goal.currentValue} onChange={(value) => updateCurrentValue(goal.key, Number(value ?? 0))} />
                      </Descriptions.Item>
                      <Descriptions.Item label='Hoàn thành'>{getProgress(goal)}%</Descriptions.Item>
                      <Descriptions.Item label='Deadline'>{goal.deadline}</Descriptions.Item>
                      <Descriptions.Item label='Trạng thái'>
                        <Tag color={getStatusColor(goal.status)}>{goal.status}</Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Space>
                  <div style={{ width: '100%' }}>
                    <div style={{ background: '#f5f5f5', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${getProgress(goal)}%`, height: '100%', background: '#1890ff', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <Space>
                    <Tooltip title='Xóa mục tiêu'>
                      <Button danger type='text' onClick={() => deleteCurrentGoal(goal.key)}>
                        Xóa
                      </Button>
                    </Tooltip>
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      <Drawer title='Thêm mục tiêu' placement='right' width={420} onClose={() => setDrawerVisible(false)} visible={drawerVisible} destroyOnClose>
        <Space direction='vertical' style={{ width: '100%' }} size='large'>
          <div>
            <div style={{ marginBottom: 8 }}>Tên mục tiêu</div>
            <input style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }} value={newGoal.title ?? ''} onChange={(event) => setNewGoal({ ...newGoal, title: event.target.value })} />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>Loại</div>
            <Select value={newGoal.type} onChange={(value) => setNewGoal({ ...newGoal, type: value })} style={{ width: '100%' }}>
              {goalTypes.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>Giá trị mục tiêu</div>
            <InputNumber min={0} value={newGoal.targetValue} onChange={(value) => setNewGoal({ ...newGoal, targetValue: Number(value ?? 0) })} style={{ width: '100%' }} />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>Giá trị hiện tại</div>
            <InputNumber min={0} value={newGoal.currentValue} onChange={(value) => setNewGoal({ ...newGoal, currentValue: Number(value ?? 0) })} style={{ width: '100%' }} />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>Deadline</div>
            <input placeholder='YYYY-MM-DD' style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }} value={newGoal.deadline ?? ''} onChange={(event) => setNewGoal({ ...newGoal, deadline: event.target.value })} />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>Trạng thái</div>
            <Select value={newGoal.status} onChange={(value) => setNewGoal({ ...newGoal, status: value })} style={{ width: '100%' }}>
              {statuses.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Space>
            <Button type='primary' onClick={createGoal}>
              Lưu mục tiêu
            </Button>
            <Button onClick={() => setDrawerVisible(false)}>Hủy</Button>
          </Space>
        </Space>
      </Drawer>
    </div>
  );
};

export default MucTieu;
