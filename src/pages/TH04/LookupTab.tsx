import { useState } from 'react';
import { Form, Input, DatePicker, Button, Table, Alert, Card, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { DiplomaRecord, DiplomaBook, GraduationDecision, CustomField } from '@/models/types';
import { fmtDate, serialLabel } from '@/models/utils';
import { Tag } from 'antd';
import RecordDetail from './RecordDetail';

const { Title, Text } = Typography;
interface Props {
  records: DiplomaRecord[];
  books: DiplomaBook[];
  decisions: GraduationDecision[];
  fields: CustomField[];
  setDecisions: React.Dispatch<React.SetStateAction<GraduationDecision[]>>;
}
const LookupTab = ({ records, books, decisions, fields, setDecisions }: Props) => {
  const [form] = Form.useForm();
  const [results, setResults] = useState<DiplomaRecord[] | null>(null);
  const [error,   setError]   = useState('');
  const [detail,  setDetail]  = useState<DiplomaRecord | null>(null);
  const bookById     = Object.fromEntries(books.map(b     => [b.id, b]));
  const decisionById = Object.fromEntries(decisions.map(d => [d.id, d]));
  const doLookup = () => {
    const v = form.getFieldsValue();
    const filled = Object.values(v).filter((x: unknown) => x && String(x).trim() !== '');
    if (filled.length < 2) {
      setError('Vui lòng nhập ít nhất 2 tham số tìm kiếm.');
      setResults(null);
      return;
    }
    setError('');
    const dob = v.dateOfBirth ? dayjs(v.dateOfBirth).format('YYYY-MM-DD') : '';
    const found = records.filter(r =>
      (!v.diplomaCode  || r.diplomaCode.toLowerCase().includes(v.diplomaCode.toLowerCase())) &&
      (!v.serialNumber || String(r.serialNumber) === String(v.serialNumber)) &&
      (!v.studentId    || r.studentId.toLowerCase().includes(v.studentId.toLowerCase())) &&
      (!v.fullName     || r.fullName.toLowerCase().includes(v.fullName.toLowerCase())) &&
      (!dob            || r.dateOfBirth === dob)
    );
    const hit = new Set(found.map(r => r.decisionId));
    setDecisions(p => p.map(d => hit.has(d.id) ? { ...d, lookupCount: d.lookupCount + 1 } : d));
    setResults(found);
  };
  const cols: ColumnsType<DiplomaRecord> = [
    {
      title: 'Số vào sổ', key: 'serial',
      render: (_, r) => {
        const dec  = decisionById[r.decisionId];
        const book = bookById[dec?.bookId];
        return <Tag color='blue'>{serialLabel(book?.year, r.serialNumber)}</Tag>;
      },
    },
    { title: 'Số hiệu VB', dataIndex: 'diplomaCode', key: 'diplomaCode', render: v => <Text strong>{v}</Text> },
    { title: 'MSV',         dataIndex: 'studentId',   key: 'studentId' },
    { title: 'Họ tên',      dataIndex: 'fullName',    key: 'fullName' },
    { title: 'Ngày sinh',   dataIndex: 'dateOfBirth', key: 'dateOfBirth', render: fmtDate },
    { title: 'Quyết định',  key: 'dec', render: (_, r) => <Tag>{decisionById[r.decisionId]?.decisionNumber}</Tag> },
    {
      title: '', key: 'act', align: 'right',
      render: (_, r) => <Button size='small' onClick={() => setDetail(r)}>Chi tiết</Button>,
    },
  ];
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Tra cứu văn bằng</Title>
        <Text type='secondary'>Nhập ít nhất 2 tham số để tìm kiếm</Text>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <Form form={form} layout='vertical'>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0 16px' }}>
            <Form.Item name='diplomaCode'  label='Số hiệu văn bằng'><Input placeholder='Nhập số hiệu...' /></Form.Item>
            <Form.Item name='serialNumber' label='Số vào sổ'>       <Input placeholder='Nhập số vào sổ...' /></Form.Item>
            <Form.Item name='studentId'    label='Mã sinh viên'>    <Input placeholder='Nhập MSV...' /></Form.Item>
            <Form.Item name='fullName'     label='Họ tên'>          <Input placeholder='Nhập họ tên...' /></Form.Item>
            <Form.Item name='dateOfBirth'  label='Ngày sinh'>       <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' /></Form.Item>
          </div>
          {error && <Alert type='error' message={error} style={{ marginBottom: 12 }} showIcon />}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='primary' onClick={doLookup}>Tra cứu</Button>
          </div>
        </Form>
      </Card>

      {results !== null && (
        results.length === 0
          ? <Alert type='info' message='Không tìm thấy văn bằng phù hợp.' showIcon />
          : <>
              <Text type='secondary' style={{ display: 'block', marginBottom: 8 }}>
                Tìm thấy <Text strong>{results.length}</Text> kết quả
              </Text>
              <Table dataSource={results} columns={cols} rowKey='id' pagination={false} />
            </>
      )}

      {detail && (
        <RecordDetail
          record={detail}
          book={bookById[decisionById[detail.decisionId]?.bookId]}
          decision={decisionById[detail.decisionId]}
          fields={fields}
          onClose={() => setDetail(null)}
        />
      )}
    </>
  );
};

export default LookupTab;