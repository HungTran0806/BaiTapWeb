import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { Card, Space, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const statusLabels: Record<TodoList.TaskStatus, string> = {
	todo: 'Cần làm',
	inprogress: 'Đang làm',
	done: 'Hoàn thành',
};

const priorityColors: Record<TodoList.TaskPriority, string> = {
	Cao: 'volcano',
	'Trung bình': 'gold',
	Thấp: 'green',
};

const TodoItem = (props: { record: TodoList.TodoItem; index: number }) => {
	const { deleteTodo, setVisible, setTodoItem, setIsEdit } = useModel('todolist');
	const { record } = props;

	return (
		<Card
			size='small'
			style={{ width: '100%', borderRadius: 8, overflow: 'hidden' }}
			bodyStyle={{ padding: 16 }}
		>
			<div style={{ height: 4, backgroundColor: record.color, marginBottom: 12, borderRadius: 4 }} />
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
				<div>
					<div style={{ fontWeight: 600, fontSize: 16 }}>{record.title}</div>
					<div style={{ color: '#777', marginTop: 6, fontSize: 12 }}>{statusLabels[record.status]}</div>
				</div>
				<div style={{ display: 'flex', gap: 8 }}>
					<Tooltip title='Chỉnh sửa'>
						<FormOutlined
							style={{ color: record.color, cursor: 'pointer' }}
							onClick={() => {
							setVisible(true);
							setTodoItem(record);
							setIsEdit(true);
						}}
						/>
					</Tooltip>
					<Tooltip title='Xóa task'>
						<DeleteOutlined
							style={{ color: record.color, cursor: 'pointer' }}
							onClick={() => deleteTodo(record.id)}
						/>
					</Tooltip>
				</div>
			</div>
			<div style={{ color: '#444', marginBottom: 12, minHeight: 50 }}>{record.description || 'Không có mô tả'}</div>
			<Space direction='vertical' size={4} style={{ width: '100%' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
					<Tag color={priorityColors[record.priority]}>{record.priority}</Tag>
					<Tag color='blue'>{moment(record.deadline).format('DD/MM/YYYY')}</Tag>
				</div>
				<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
					{record.tags?.map((tag) => (
						<Tag key={tag}>{tag}</Tag>
					))}
				</div>
			</Space>
		</Card>
	);
};

export default TodoItem;
