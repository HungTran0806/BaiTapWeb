import { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import 'antd/dist/antd.min.css';
import type { TabKey } from '@/models/types';
import { INIT_BOOKS, INIT_DECISIONS, INIT_FIELDS, INIT_RECORDS, TABS } from '@/models/constants';
import BooksTab from './BooksTab';
import DecisionsTab from './DecisionsTab';
import FieldsTab from './FieldsTab';
import RecordsTab from './RecordsTab';
import LookupTab from './LookupTab';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const App = () => {
	const [tab, setTab] = useState<TabKey>('records');
	const [books, setBooks] = useState(INIT_BOOKS);
	const [decisions, setDecisions] = useState(INIT_DECISIONS);
	const [fields, setFields] = useState(INIT_FIELDS);
	const [records, setRecords] = useState(INIT_RECORDS);
	return (
		<Layout style={{ minHeight: '100vh', background: '#f0f4f8' }}>
			<Header style={{ background: '#1e40af', padding: '12px 32px' }}>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<Title level={4} style={{ color: '#fff', margin: 0 }}>
						Quản lý Sổ Văn Bằng
					</Title>
					<Text style={{ color: '#93c5fd', fontSize: 12 }}>Hệ thống quản lý văn bằng tốt nghiệp</Text>
				</div>
			</Header>

			<div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px' }}>
				<Menu
					mode='horizontal'
					selectedKeys={[tab]}
					onSelect={({ key }) => setTab(key as TabKey)}
					items={TABS.map((t) => ({ key: t.key, label: t.label }))}
					style={{ border: 'none', fontWeight: 500 }}
				/>
			</div>

			<Content style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
				{tab === 'books' && <BooksTab books={books} decisions={decisions} setBooks={setBooks} />}
				{tab === 'decisions' && (
					<DecisionsTab decisions={decisions} books={books} records={records} setDecisions={setDecisions} />
				)}
				{tab === 'fields' && <FieldsTab fields={fields} setFields={setFields} />}
				{tab === 'records' && (
					<RecordsTab
						records={records}
						books={books}
						decisions={decisions}
						fields={fields}
						setRecords={setRecords}
						setBooks={setBooks}
					/>
				)}
				{tab === 'lookup' && (
					<LookupTab
						records={records}
						books={books}
						decisions={decisions}
						fields={fields}
						setDecisions={setDecisions}
					/>
				)}
			</Content>
		</Layout>
	);
};
export default App;
