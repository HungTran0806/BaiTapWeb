import { Button, Typography } from 'antd';

const { Title, Text } = Typography;
interface Props {
  title: string;
  sub: string;
  btnLabel: string;
  onAdd: () => void;
}
const SectionHeader = ({ title, sub, btnLabel, onAdd }: Props) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
    <div>
      <Title level={4} style={{ margin: 0 }}>{title}</Title>
      <Text type='secondary'>{sub}</Text>
    </div>
    <Button type='primary' onClick={onAdd}>{btnLabel}</Button>
  </div>
);
export default SectionHeader;