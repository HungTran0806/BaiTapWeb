import moment from 'moment';
import { Modal, Form, DatePicker, InputNumber, Button, Space } from 'antd';
import type { HealthRecord } from '@/models/fitness/health';
import { useEffect } from 'react';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (record: HealthRecord | Omit<HealthRecord, 'key'>) => void;
  initial?: HealthRecord | null;
};

const HealthModal = ({ visible, onCancel, onSubmit, initial }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initial) {
      form.setFieldsValue({
        date: moment(initial.date),
        weight: initial.weight,
        height: initial.height,
        restingHeartRate: initial.restingHeartRate,
        sleepHours: initial.sleepHours,
      });
    } else {
      form.resetFields();
    }
  }, [initial, form]);

  const handleFinish = (values: any) => {
    const out = {
      ...(initial || {}),
      date: values.date.format('YYYY-MM-DD'),
      weight: values.weight,
      height: values.height,
      restingHeartRate: values.restingHeartRate,
      sleepHours: values.sleepHours,
    } as HealthRecord | Omit<HealthRecord, 'key'>;
    onSubmit(out);
  };

  return (
    <Modal visible={visible} title={initial ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe'} onCancel={onCancel} footer={null} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ weight: 70, height: 170, restingHeartRate: 60, sleepHours: 7 }}>
        <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="restingHeartRate" label="Nhịp tim lúc nghỉ (bpm)" rules={[{ required: true }]}>
          <InputNumber min={30} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="sleepHours" label="Giờ ngủ" rules={[{ required: true }]}>
          <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
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

export default HealthModal;
