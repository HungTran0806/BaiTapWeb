import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { CustomField, FieldType } from '@/models/types';
import { uid } from '@/models/utils';
import { TYPE_COLOR } from '@/models/constants';
import SectionHeader from './SectionHeader';

const { Text } = Typography;
interface Props {
  fields: CustomField[];
  setFields: React.Dispatch<React.SetStateAction<CustomField[]>>;
}
const FieldsTab = ({ fields, setFields }: Props) => {
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState<CustomField | undefined>();
  const [form] = Form.useForm();
  const openModal = (f?: CustomField) => {
    setEditing(f);
    form.setFieldsValue(f ?? { name: '', type: 'String' });
    setOpen(true);
  };
  const save = () => {
    const v = form.getFieldsValue() as { name: string; type: FieldType };
    if (!v.name.trim()) return;
    if (editing) {
      setFields(p => p.map(f => f.id === editing.id ? { ...f, ...v } : f));
    } else {
      setFields(p => [...p, { id: uid(), ...v }]);
    }
    setOpen(false);
  };
  const cols: ColumnsType<CustomField> = [
    { title: '#',             key: 'idx',  render: (_, __, i) => i + 1 },
    { title: 'Tên trường',   dataIndex: 'name', key: 'name', render: v => <Text strong>{v}</Text> },
    { title: 'Kiểu dữ liệu', dataIndex: 'type', key: 'type', render: (v: FieldType) => <Tag color={TYPE_COLOR[v]}>{v}</Tag> },
    {
      title: '', key: 'actions', align: 'right',
      render: (_, r) => (
        <Space>
          <Button size='small' onClick={() => openModal(r)}>Sửa</Button>
          <Button size='small' danger onClick={() => setFields(p => p.filter(f => f.id !== r.id))}>Xoá</Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <SectionHeader
        title='Cấu hình biểu mẫu phụ lục'
        sub='Quản lý các trường thông tin bổ sung cho văn bằng'
        btnLabel='+ Thêm trường'
        onAdd={() => openModal()}
      />
      <Table dataSource={fields} columns={cols} rowKey='id' pagination={false} />
      <Modal
        title={editing ? 'Chỉnh sửa trường' : 'Thêm trường thông tin'}
        visible={open} onOk={save} onCancel={() => setOpen(false)}
        okText='Lưu' cancelText='Huỷ'
      >
        <Form form={form} layout='vertical'>
          <Form.Item name='name' label='Tên trường' rules={[{ required: true }]}>
            <Input placeholder='VD: Dân tộc, Điểm trung bình...' />
          </Form.Item>
          <Form.Item name='type' label='Kiểu dữ liệu'>
            <Select options={[
              { value: 'String', label: 'String – Văn bản' },
              { value: 'Number', label: 'Number – Số'       },
              { value: 'Date',   label: 'Date – Ngày tháng' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FieldsTab;