import { useState, useMemo } from 'react';
import {Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, Tag, Space, Alert, Typography} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { DiplomaRecord, DiplomaBook, GraduationDecision, CustomField } from '@/models/types';
import { uid, fmtDate, serialLabel } from '@/models/utils';
import { TYPE_COLOR } from '@/models/constants';
import SectionHeader from './SectionHeader';
import RecordDetail from './RecordDetail';

const { Text } = Typography;
interface Props {
	records: DiplomaRecord[];
	books: DiplomaBook[];
	decisions: GraduationDecision[];
	fields: CustomField[];
	setRecords: React.Dispatch<React.SetStateAction<DiplomaRecord[]>>;
	setBooks: React.Dispatch<React.SetStateAction<DiplomaBook[]>>;
}
const RecordsTab = ({ records, books, decisions, fields, setRecords, setBooks }: Props) => {
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<DiplomaRecord | undefined>();
	const [detail, setDetail] = useState<DiplomaRecord | null>(null);
	const [form] = Form.useForm();
	const bookById = useMemo(() => Object.fromEntries(books.map((b) => [b.id, b])), [books]);
	const decisionById = useMemo(() => Object.fromEntries(decisions.map((d) => [d.id, d])), [decisions]);
	const openModal = (r?: DiplomaRecord) => {
		setEditing(r);
		if (r) {
			form.setFieldsValue({
				...r,
				dateOfBirth: dayjs(r.dateOfBirth),
				...Object.fromEntries(
					fields.map((f) => [
						`cf_${f.id}`,
						f.type === 'Date'
							? r.customValues[f.id]
								? dayjs(r.customValues[f.id])
								: null
							: r.customValues[f.id] ?? '',
					]),
				),
			});
		} else {
			form.resetFields();
			if (decisions.length > 0) {
				form.setFieldsValue({ decisionId: decisions[0].id });
			}
		}
		setOpen(true);
	};
	const save = () => {
		const v = form.getFieldsValue();
		const customValues: Record<string, any> = {};
		fields.forEach((f) => {
			const raw = v[`cf_${f.id}`];
			if (f.type === 'Date') {
				customValues[f.id] = raw ? dayjs(raw).format('YYYY-MM-DD') : '';
			} else if (f.type === 'Number') {
				customValues[f.id] = raw ?? null;
			} else {
				customValues[f.id] = raw ?? '';
			}
		});
		const base = {
			diplomaCode: v.diplomaCode,
			studentId: v.studentId,
			fullName: v.fullName,
			dateOfBirth: dayjs(v.dateOfBirth).format('YYYY-MM-DD'),
			decisionId: v.decisionId,
			customValues,
		};
		if (editing) {
			setRecords((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...base } : r)));
		} else {
			const dec = decisions.find((d) => d.id === base.decisionId);
			if (!dec) return;

			const book = books.find((b) => b.id === dec.bookId);
			if (!book) return;

			const next = book.counter + 1;
			setBooks((prev) => prev.map((b) => (b.id === book.id ? { ...b, counter: next } : b)));
			setRecords((prev) => [
				...prev,
				{
					id: uid(),
					serialNumber: next,
					...base,
				},
			]);
		}

		setOpen(false);
	};
	const cols: ColumnsType<DiplomaRecord> = [
		{
			title: 'Số vào sổ',
			key: 'serial',
			render: (_, r) => {
				const dec = decisionById[r.decisionId];
				const book = dec ? bookById[dec.bookId] : undefined;

				if (!book) return <Tag color='red'>N/A</Tag>;

				return <Tag color='blue'>{serialLabel(book.year, r.serialNumber)}</Tag>;
			},
		},
		{
			title: 'Số hiệu VB',
			dataIndex: 'diplomaCode',
			render: (v) => <Text strong>{v}</Text>,
		},
		{ title: 'MSV', dataIndex: 'studentId' },
		{
			title: 'Họ tên',
			dataIndex: 'fullName',
			ellipsis: true,
			sorter: (a, b) => a.fullName.localeCompare(b.fullName),
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'dateOfBirth',
			render: fmtDate,
		},
		{
			title: 'Quyết định',
			render: (_, r) => <Tag>{decisionById[r.decisionId]?.decisionNumber}</Tag>,
		},
		{
			title: '',
			key: 'actions',
			align: 'right',
			render: (_, r) => (
				<Space>
					<Button size='small' onClick={() => setDetail(r)}>
						Chi tiết
					</Button>
					<Button size='small' onClick={() => openModal(r)}>
						Sửa
					</Button>
				</Space>
			),
		},
	];

	return (
		<>
			<SectionHeader
				title='Danh sách văn bằng'
				sub='Quản lý thông tin văn bằng tốt nghiệp của sinh viên'
				btnLabel='+ Cấp văn bằng'
				onAdd={() => openModal()}
			/>

			<Table dataSource={records} columns={cols} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={editing ? 'Chỉnh sửa văn bằng' : 'Cấp văn bằng mới'}
				visible={open} 
				onOk={save}
				onCancel={() => setOpen(false)}
				okText='Lưu'
				cancelText='Huỷ'
				width={620}
			>
				<Form form={form} layout='vertical'>
					{!editing && (
						<Alert
							type='success'
							message='Số vào sổ sẽ được tự động cấp khi lưu.'
							style={{ marginBottom: 16 }}
							
						/>
					)}
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
						<Form.Item name='diplomaCode' label='Số hiệu văn bằng' rules={[{ required: true }]}>
							<Input />
						</Form.Item>

						<Form.Item name='studentId' label='Mã sinh viên' rules={[{ required: true }]}>
							<Input />
						</Form.Item>

						<Form.Item name='fullName' label='Họ và tên' rules={[{ required: true }]} style={{ gridColumn: '1/-1' }}>
							<Input />
						</Form.Item>

						<Form.Item name='dateOfBirth' label='Ngày sinh' rules={[{ required: true }]}>
							<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
						</Form.Item>

						<Form.Item name='decisionId' label='Quyết định TN' rules={[{ required: true }]}>
							<Select
								options={decisions.map((d) => ({
									value: d.id,
									label: d.decisionNumber,
								}))}
							/>
						</Form.Item>
					</div>

					{fields.length > 0 && (
						<>
							<div
								style={{
									borderTop: '1px solid #f0f0f0',
									margin: '8px 0 16px',
									paddingTop: 16,
									color: '#8c8c8c',
									fontSize: 12,
									textTransform: 'uppercase',
								}}
							>
								Thông tin bổ sung
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
								{fields.map((f) => (
									<Form.Item
										key={f.id}
										name={`cf_${f.id}`}
										label={
											<>
												{f.name}
												<Tag color={TYPE_COLOR[f.type]} style={{ marginLeft: 4, fontSize: 10 }}>
													{f.type}
												</Tag>
											</>
										}
									>
										{f.type === 'Number' ? (
											<InputNumber style={{ width: '100%' }} />
										) : f.type === 'Date' ? (
											<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
										) : (
											<Input />
										)}
									</Form.Item>
								))}
							</div>
						</>
					)}
				</Form>
			</Modal>

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

export default RecordsTab;
