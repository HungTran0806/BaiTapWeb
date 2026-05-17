import moment from 'moment';
import type { Moment } from 'moment';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Space, Table, Tag} from 'antd';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/lib/table';
import type { WorkoutRecord } from '@/models/fitness/workouts';

const workoutTypes = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];
const statusOptions = ['Hoàn thành', 'Bỏ lỡ'];

const TapLuyen = () => {
  const { workouts, addWorkout, updateWorkout, deleteWorkout } = useModel('fitness.workouts');
  const [visible, setVisible] = useState<boolean>(false);
  const [editing, setEditing] = useState<WorkoutRecord | null>(null);
  const [filterName, setFilterName] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Moment, Moment] | null>(null);
  const [form] = Form.useForm();

  const data: WorkoutRecord[] = workouts || [];

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesName = item.exercise.toLowerCase().includes(filterName.trim().toLowerCase());
      const matchesType = filterType ? item.type === filterType : true;
      const matchesDate = dateRange
        ? moment(item.date).isBetween(dateRange[0], dateRange[1], 'day', '[]')
        : true;
      return matchesName && matchesType && matchesDate;
    });
  }, [data, dateRange, filterName, filterType]);

  const openModal = (record?: WorkoutRecord) => {
    setEditing(record ?? null);
    setVisible(true);
    if (record) {
      form.setFieldsValue({
        ...record,
        date: moment(record.date),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ type: workoutTypes[0], status: statusOptions[0] });
    }
  };
  const handleSubmit = (values: any) => {
    const record: WorkoutRecord = {
      key: editing?.key ?? `${Date.now()}`,
      date: values.date.format('YYYY-MM-DD'),
      exercise: values.exercise,
      type: values.type,
      duration: values.duration,
      calories: values.calories,
      notes: values.notes || '',
      status: values.status,
    };
    if (editing) {
      updateWorkout(editing.key, record);
    } else {
      addWorkout(record);
    }
    setVisible(false);
    setEditing(null);
    form.resetFields();
  };

  const handleDelete = (key: string) => {
    deleteWorkout(key);
  };

  const columns: ColumnsType<WorkoutRecord> = [
    { title: 'Ngày', dataIndex: 'date', key: 'date', width: 120, render: (value) => moment(value).format('DD/MM/YYYY') },
    { title: 'Loại bài tập', dataIndex: 'type', key: 'type', width: 130 },
    { title: 'Tên bài tập', dataIndex: 'exercise', key: 'exercise', width: 220 },
    { title: 'Thời lượng (phút)', dataIndex: 'duration', key: 'duration', width: 140 },
    { title: 'Calo đốt', dataIndex: 'calories', key: 'calories', width: 110 },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (value) => <Tag color={value === 'Hoàn thành' ? 'green' : 'volcano'}>{value}</Tag>,
    },
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
          <Popconfirm title='Xác nhận xóa buổi tập này?' onConfirm={() => handleDelete(record.key)}>
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
      <Card title='Nhật ký tập luyện' extra={<Button type='primary' onClick={() => openModal()}>Thêm buổi tập</Button>}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={8}>
            <Input placeholder='Tìm theo tên bài tập' value={filterName} onChange={(e) => setFilterName(e.target.value)} allowClear />
          </Col>
          <Col xs={24} md={8}>
            <Select placeholder='Lọc theo loại bài tập' value={filterType || undefined} onChange={(value) => setFilterType(value)} allowClear style={{ width: '100%' }}>
              {workoutTypes.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <DatePicker.RangePicker value={dateRange} onChange={(values) => setDateRange(values as [Moment, Moment] | null)} style={{ width: '100%' }} />
          </Col>
        </Row>
        <Table rowKey='key' columns={columns} dataSource={filteredData} pagination={{ pageSize: 8 }} />
      </Card>
      <Modal title={editing ? 'Sửa buổi tập' : 'Thêm buổi tập'} visible={visible} onCancel={() => setVisible(false)} footer={null} destroyOnClose>
        <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{ type: workoutTypes[0], status: statusOptions[0], duration: 30, calories: 0 }}>
          <Form.Item name='date' label='Ngày tập' rules={[{ required: true, message: 'Chọn ngày tập' }]}> 
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='type' label='Loại bài tập' rules={[{ required: true, message: 'Chọn loại bài tập' }]}>
            <Select>
              {workoutTypes.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='exercise' label='Tên bài tập' rules={[{ required: true, message: 'Nhập tên bài tập' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='duration' label='Thời lượng (phút)' rules={[{ required: true, message: 'Nhập thời lượng' }]}> 
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='calories' label='Calo' rules={[{ required: true, message: 'Nhập lượng calo' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='notes' label='Ghi chú'>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name='status' label='Trạng thái' rules={[{ required: true, message: 'Chọn trạng thái' }]}> 
            <Select>
              {statusOptions.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType='submit' type='primary'>
                {editing ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => setVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TapLuyen;
