import { useState } from 'react';
import { Table, Modal, Form, InputNumber, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DiplomaBook, GraduationDecision } from '@/models/types';
import SectionHeader from './SectionHeader';

const { Text } = Typography;
interface Props {
  books: DiplomaBook[];
  decisions: GraduationDecision[];
  setBooks: React.Dispatch<React.SetStateAction<DiplomaBook[]>>;
}
const BooksTab = ({ books, decisions, setBooks }: Props) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const save = () => {
    const yr: number = form.getFieldValue('year');
    if (!yr || books.find(b => b.year === yr)) return;
    setBooks(p => [...p, { id: `b${yr}`, year: yr, counter: 0 }]);
    form.resetFields();
    setOpen(false);
  };
  const cols: ColumnsType<DiplomaBook> = [
    { title: 'Năm',             dataIndex: 'year',    key: 'year',    render: y => <Text strong>{y}</Text> },
    { title: 'Mã sổ',          dataIndex: 'id',      key: 'id',      render: v => <Tag color='blue'>{v}</Tag> },
    { title: 'Số bằng đã cấp', dataIndex: 'counter', key: 'counter', render: v => `${v} bằng` },
    { title: 'Quyết định',     key: 'dec',           render: (_, r) => `${decisions.filter(d => d.bookId === r.id).length} quyết định` },
  ];
  return (
    <>
      <SectionHeader
        title='Sổ văn bằng'
        sub='Mỗi năm tương ứng một sổ, số vào sổ tự reset khi mở sổ mới'
        btnLabel='+ Mở sổ mới'
        onAdd={() => setOpen(true)}
      />
      <Table dataSource={books} columns={cols} rowKey='id' pagination={false} />

      <Modal title='Mở sổ văn bằng mới' visible={open} onOk={save} onCancel={() => setOpen(false)} okText='Tạo sổ' cancelText='Huỷ'>
        <Form form={form} layout='vertical'>
          <Form.Item name='year' label='Năm' rules={[{ required: true, message: 'Vui lòng nhập năm' }]}>
            <InputNumber style={{ width: '100%' }} min={2000} max={2100} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default BooksTab;