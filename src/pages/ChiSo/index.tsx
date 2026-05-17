import moment from 'moment';
import type { Moment } from 'moment';
import { Button, Card, Col, DatePicker, Form, InputNumber, Modal, Popconfirm, Row, Space, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/lib/table';
import type { HealthRecord } from '@/models/fitness/health';

const ChiSo = () => {
  const { records, addRecord, updateRecord, deleteRecord } = useModel('fitness.health');
  const [visible, setVisible] = useState<boolean>(false);
  const [editing, setEditing] = useState<HealthRecord | null>(null);
  const [form] = Form.useForm();
  const [filterDates, setFilterDates] = useState<[Moment, Moment] | null>(null);

  const calculateBMI = (weight: number, height: number) => {
    const meters = height / 100;
    return Number((weight / (meters * meters)).toFixed(1));
  };

  const statusToTag = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Thiếu cân', color: 'blue' };
    if (bmi < 25) return { label: 'Bình thường', color: 'green' };
    if (bmi < 30) return { label: 'Thừa cân', color: 'gold' };
    return { label: 'Béo phì', color: 'red' };
  };

  const openModal = (record?: HealthRecord) => {
    if (record) {
      form.setFieldsValue({
        date: moment(record.date),
        weight: record.weight,
        height: record.height,
        restingHeartRate: record.restingHeartRate,
        sleepHours: record.sleepHours,
      });
    } else {
      form.resetFields();
    }
    setEditing(record || null);
    setVisible(true);
  };

  const filteredRecords = useMemo(() => {
    return (records || [])
      .filter((item: HealthRecord) => {
        if (!filterDates) return true;
        return moment(item.date).isBetween(filterDates[0], filterDates[1], 'day', '[]');
      })
      .sort((a: HealthRecord, b: HealthRecord) => moment(b.date).valueOf() - moment(a.date).valueOf());
  }, [records, filterDates]);

  const handleDelete = (key: string) => {
    deleteRecord(key);
  };

  const handleSubmit = (values: any) => {
    const record: HealthRecord = {
      key: editing?.key ?? `${Date.now()}`,
      date: values.date.format('YYYY-MM-DD'),
      weight: values.weight,
      height: values.height,
      restingHeartRate: values.restingHeartRate,
      sleepHours: values.sleepHours,
    };
    if (editing) {
      updateRecord(editing.key, record);
    } else {
      addRecord(record);
    }
    setVisible(false);
    setEditing(null);
    form.resetFields();
  };

  const columns: ColumnsType<HealthRecord> = [
    { title: 'Ngày', dataIndex: 'date', key: 'date', width: 120, render: (value) => moment(value).format('DD/MM/YYYY') },
    { title: 'Cân nặng (kg)', dataIndex: 'weight', key: 'weight', width: 140 },
    { title: 'Chiều cao (cm)', dataIndex: 'height', key: 'height', width: 140 },
    {
      title: 'BMI',
      key: 'bmi',
      width: 120,
      render: (_, record) => {
        const bmi = calculateBMI(record.weight, record.height);
        return <Tag color={statusToTag(bmi).color}>{bmi}</Tag>;
      },
    },
    { title: 'Nhịp tim nghỉ (bpm)', dataIndex: 'restingHeartRate', key: 'restingHeartRate', width: 160 },
    { title: 'Giờ ngủ', dataIndex: 'sleepHours', key: 'sleepHours', width: 110, render: (value) => `${value}h` },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type='link' onClick={() => openModal(record)}>
            Sửa
          </Button>
          <Popconfirm title='Xác nhận xóa chỉ số này?' onConfirm={() => handleDelete(record.key)}>
            <Button type='link' danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card title='Nhật ký chỉ số sức khỏe' extra={<Button type='primary' onClick={() => openModal()}>Thêm chỉ số</Button>}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={12}>
            <DatePicker.RangePicker value={filterDates} onChange={(values) => setFilterDates(values as [Moment, Moment] | null)} style={{ width: '100%' }} />
          </Col>
        </Row>
        <Table rowKey='key' columns={columns} dataSource={filteredRecords} pagination={{ pageSize: 8 }} />
      </Card>
      <Modal title={editing ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe'} visible={visible} onCancel={() => setVisible(false)} footer={null} destroyOnClose>
        <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{ weight: 70, height: 170, restingHeartRate: 60, sleepHours: 7 }}>
          <Form.Item name='date' label='Ngày' rules={[{ required: true, message: 'Chọn ngày' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='weight' label='Cân nặng (kg)' rules={[{ required: true, message: 'Nhập cân nặng' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='height' label='Chiều cao (cm)' rules={[{ required: true, message: 'Nhập chiều cao' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='restingHeartRate' label='Nhịp tim lúc nghỉ (bpm)' rules={[{ required: true, message: 'Nhập nhịp tim' }]}>
            <InputNumber min={30} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='sleepHours' label='Giờ ngủ' rules={[{ required: true, message: 'Nhập giờ ngủ' }]}>
            <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType='submit' type='primary'>Cập nhật</Button>
              <Button onClick={() => setVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChiSo;
