import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Tag, Space, Badge, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { GraduationDecision, DiplomaBook, DiplomaRecord } from '@/models/types';
import { uid } from '@/models/utils';
import SectionHeader from './SectionHeader';

const { Text } = Typography;
interface Props {
  decisions: GraduationDecision[];
  books: DiplomaBook[];
  records: DiplomaRecord[];
  setDecisions: React.Dispatch<React.SetStateAction<GraduationDecision[]>>;
}
const DecisionsTab = ({ decisions, books, records, setDecisions }: Props) => {
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState<GraduationDecision | undefined>();
  const [form] = Form.useForm();
  const bookById = Object.fromEntries(books.map(b => [b.id, b]));
  const openModal = (d?: GraduationDecision) => {
    setEditing(d);
    form.setFieldsValue(d
      ? { ...d, issueDate: dayjs(d.issueDate) }
      : { decisionNumber: '', issueDate: null, summary: '', bookId: books[0]?.id }
    );
    setOpen(true);
  };
  const save = () => {
    const v = form.getFieldsValue();
    const payload = { ...v, issueDate: dayjs(v.issueDate).format('YYYY-MM-DD') };
    if (editing) {
      setDecisions(p => p.map(d => d.id === editing.id ? { ...d, ...payload } : d));
    } else {
      setDecisions(p => [...p, { id: uid(), ...payload, lookupCount: 0 }]);
    }
    setOpen(false);
  };
  const remove = (id: string) => {
    if (records.find(r => r.decisionId === id)) {
      Modal.warning({ title: 'Không thể xoá', content: 'Quyết định đang có văn bằng liên kết.' });
      return;
    }
    setDecisions(p => p.filter(d => d.id !== id));
  };
  const cols: ColumnsType<GraduationDecision> = [
    { title: 'Số QĐ',         dataIndex: 'decisionNumber', key: 'decisionNumber', render: v => <Text strong>{v}</Text> },
    { title: 'Ngày ban hành', dataIndex: 'issueDate',      key: 'issueDate',      render: v => dayjs(v).format('DD/MM/YYYY') },
    { title: 'Trích yếu',     dataIndex: 'summary',        key: 'summary',        ellipsis: true },
    { title: 'Sổ VB',         dataIndex: 'bookId',         key: 'bookId',         render: v => <Tag>{`Năm ${bookById[v]?.year}`}</Tag> },
    {
      title: 'Lượt tra cứu', dataIndex: 'lookupCount', key: 'lookupCount', align: 'center',
      render: v => <Badge count={v} showZero style={{ backgroundColor: v > 0 ? '#52c41a' : '#d9d9d9' }} />,
    },
    {
      title: '', key: 'actions', align: 'right',
      render: (_, r) => (
        <Space>
          <Button size='small' onClick={() => openModal(r)}>Sửa</Button>
          <Button size='small' danger onClick={() => remove(r.id)}>Xoá</Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <SectionHeader
        title='Quyết định tốt nghiệp'
        sub='Mỗi đợt tốt nghiệp trong năm ứng với một quyết định'
        btnLabel='+ Thêm quyết định'
        onAdd={() => openModal()}
      />
      <Table dataSource={decisions} columns={cols} rowKey='id' pagination={false} />

      <Modal
        title={editing ? 'Chỉnh sửa quyết định' : 'Thêm quyết định tốt nghiệp'}
        visible={open} onOk={save} onCancel={() => setOpen(false)}
        okText='Lưu' cancelText='Huỷ'
      >
        <Form form={form} layout='vertical'>
          <Form.Item name='decisionNumber' label='Số quyết định' rules={[{ required: true }]}>
            <Input placeholder='VD: 42/QĐ-ĐHXYZ' />
          </Form.Item>
          <Form.Item name='issueDate' label='Ngày ban hành' rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
          </Form.Item>
          <Form.Item name='summary' label='Trích yếu'>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name='bookId' label='Sổ văn bằng' rules={[{ required: true }]}>
            <Select options={books.map(b => ({ value: b.id, label: `Sổ năm ${b.year}` }))} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default DecisionsTab;