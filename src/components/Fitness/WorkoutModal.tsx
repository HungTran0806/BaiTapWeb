import moment from 'moment';
import { Modal, Form, DatePicker, Input, Select, InputNumber, Button, Space } from 'antd';
import type { WorkoutRecord } from '@/models/fitness/workouts';
import { useEffect } from 'react';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (record: WorkoutRecord | Omit<WorkoutRecord, 'key'>) => void;
  initial?: WorkoutRecord | null;
};

const workoutTypes = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];
const statusOptions = ['Hoàn thành', 'Bỏ lỡ'];

const WorkoutModal = ({ visible, onCancel, onSubmit, initial }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initial) {
      form.setFieldsValue({
        date: moment(initial.date),
        exercise: initial.exercise,
        type: initial.type,
        duration: initial.duration,
        calories: initial.calories,
        notes: initial.notes,
        status: initial.status,
      });
    } else {
      form.resetFields();
    }
  }, [initial, form]);

  const handleFinish = (values: any) => {
    const out = {
      ...(initial || {}),
      date: values.date.format('YYYY-MM-DD'),
      exercise: values.exercise,
      type: values.type,
      duration: values.duration,
      calories: values.calories,
      notes: values.notes || '',
      status: values.status,
    } as WorkoutRecord | Omit<WorkoutRecord, 'key'>;
    onSubmit(out);
  };

  return (
    <Modal visible={visible} title={initial ? 'Sửa buổi tập' : 'Thêm buổi tập'} onCancel={onCancel} footer={null} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ type: 'Cardio', status: 'Hoàn thành', duration: 30, calories: 0 }}>
        <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="exercise" label="Tên bài tập" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
          <Select>
            {workoutTypes.map((t) => (
              <Select.Option key={t} value={t}>
                {t}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="calories" label="Calo đốt" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="notes" label="Ghi chú">
          <Input />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
          <Select>
            {statusOptions.map((s) => (
              <Select.Option key={s} value={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button htmlType="submit" type="primary">Lưu</Button>
            <Button onClick={onCancel}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WorkoutModal;
