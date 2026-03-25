import { Modal, Descriptions, Tag, Card, Typography } from 'antd';
import type { DiplomaRecord, DiplomaBook, GraduationDecision, CustomField } from '@/models/types';
import { fmtDate, serialLabel } from '@/models/utils';

const { Text } = Typography;
interface Props {
  record: DiplomaRecord;
  book: DiplomaBook | undefined;
  decision: GraduationDecision | undefined;
  fields: CustomField[];
  onClose: () => void;
}
const RecordDetail = ({ record: r, book: bk, decision: dec, fields, onClose }: Props) => (
  <Modal title='Chi tiết văn bằng' visible onCancel={onClose} footer={null} width={580}>
    <Descriptions bordered size='small' column={2} style={{ marginBottom: 16 }}>
      <Descriptions.Item label='Số vào sổ'>
        <Tag color='blue'>{serialLabel(bk?.year ?? 0, r.serialNumber)}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label='Số hiệu VB'><Text strong>{r.diplomaCode}</Text></Descriptions.Item>
      <Descriptions.Item label='Mã sinh viên'>{r.studentId}</Descriptions.Item>
      <Descriptions.Item label='Họ tên'>{r.fullName}</Descriptions.Item>
      <Descriptions.Item label='Ngày sinh'>{fmtDate(r.dateOfBirth)}</Descriptions.Item>
      <Descriptions.Item label='Sổ văn bằng'>Năm {bk?.year}</Descriptions.Item>
      {fields.map(f => (
        <Descriptions.Item key={f.id} label={f.name}>
          {f.type === 'Date' && r.customValues[f.id] ? fmtDate(r.customValues[f.id]) : r.customValues[f.id] || '—'}
        </Descriptions.Item>
      ))}
    </Descriptions>
    {dec && (
      <Card size='small' style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <Text strong style={{ color: '#1d4ed8' }}>{dec.decisionNumber}</Text>
        <div style={{ marginTop: 4 }}>{dec.summary}</div>
        <div style={{ marginTop: 4 }}>
          <Text type='secondary' style={{ fontSize: 12 }}>Lượt tra cứu: {dec.lookupCount}</Text>
        </div>
      </Card>
    )}
  </Modal>
);
export default RecordDetail;