import { Button, Card, Col, Input, Modal, Row, Select, Space, Statistic, Table, Tabs, Tag } from 'antd';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import moment from 'moment';
import TodoItem from './TodoItem';
import FormTodoList from './Form';

const statusLabels: Record<TodoList.TaskStatus, string> = {
	todo: 'Cần làm',
	inprogress: 'Đang làm',
	done: 'Hoàn thành',
};

const statusTagColors: Record<TodoList.TaskStatus, string> = {
	todo: 'default',
	inprogress: 'processing',
	done: 'success',
};

const TodoList: React.FC = () => {
	const { data, setIsEdit, setTodoItem, setVisible, visible, getDataTodo, saveData } = useModel('todolist');
	const [searchText, setSearchText] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [activeTab, setActiveTab] = useState<string>('kanban');

	useEffect(() => {
		getDataTodo();
	}, []);

	const tasksByStatus = useMemo(
		() => ({
			todo: data.filter((item) => item.status === 'todo'),
			inprogress: data.filter((item) => item.status === 'inprogress'),
			done: data.filter((item) => item.status === 'done'),
		}),
		[data],
	);

	const totalTasks = data.length;
	const completedTasks = data.filter((item) => item.status === 'done').length;
	const overdueTasks = data.filter(
		(item) => moment(item.deadline).isBefore(moment(), 'day') && item.status !== 'done',
	).length;

	const filteredData = useMemo(() => {
		let list = data;
		if (searchText) {
			list = list.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));
		}
		if (statusFilter) {
			list = list.filter((item) => item.status === statusFilter);
		}
		return list;
	}, [data, searchText, statusFilter]);

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) {
			return;
		}
		const sourceStatus = result.source.droppableId as TodoList.TaskStatus;
		const targetStatus = result.destination.droppableId as TodoList.TaskStatus;
		if (sourceStatus === targetStatus) {
			return;
		}
		const taskId = result.draggableId;
		const nextData = data.map((item) =>
			item.id === taskId
				? {
					...item,
					status: targetStatus,
				}
				: item,
		);
		saveData(nextData);
	};

	const columns = [
		{
			title: 'Tên task',
			dataIndex: 'title',
			key: 'title',
			sorter: (a: TodoList.TodoItem, b: TodoList.TodoItem) => a.title.localeCompare(b.title),
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			key: 'deadline',
			sorter: (a: TodoList.TodoItem, b: TodoList.TodoItem) =>
				moment(a.deadline).valueOf() - moment(b.deadline).valueOf(),
			render: (value: string) => moment(value).format('DD/MM/YYYY'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (value: TodoList.TaskStatus) => (
				<Tag color={statusTagColors[value]}>{statusLabels[value]}</Tag>
			),
		},
		{
			title: 'Mức độ',
			dataIndex: 'priority',
			key: 'priority',
		},
		{
			title: 'Tag',
			dataIndex: 'tags',
			key: 'tags',
			render: (tags: string[]) => (
				<Space wrap>
					{tags.map((tag) => (
						<Tag key={tag}>{tag}</Tag>
					))}
				</Space>
			),
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_: any, record: TodoList.TodoItem) => (
				<Button
					onClick={() => {
						setTodoItem(record);
						setIsEdit(true);
						setVisible(true);
					}}
					type='link'
				>
					Chỉnh sửa
				</Button>
			),
		},
	];

	return (
		<div>
			<div style={{ textAlign: 'center', marginBottom: 24 }}>
				<h1>Quản lý công việc cá nhân</h1>
				<Button
					type='primary'
					onClick={() => {
						setIsEdit(false);
						setTodoItem(undefined);
						setVisible(true);
					}}
				>
					Thêm task mới
				</Button>
			</div>
			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Card bordered>
						<Statistic title='Tổng số task' value={totalTasks} />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card bordered>
						<Statistic title='Đã hoàn thành' value={completedTasks} />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card bordered>
						<Statistic title='Task quá hạn' value={overdueTasks} />
					</Card>
				</Col>
			</Row>
			<Tabs
				activeKey={activeTab}
				onChange={(key) => setActiveTab(key)}
				style={{ marginTop: 24 }}
			>
				<Tabs.TabPane tab='Kanban Board' key='kanban'>
					<DragDropContext onDragEnd={onDragEnd}>
						<Row gutter={[16, 16]}>
							{(['todo', 'inprogress', 'done'] as TodoList.TaskStatus[]).map((status) => (
								<Col xs={24} md={8} key={status}>
									<Card title={statusLabels[status]} bordered style={{ minHeight: 520 }}>
										<Droppable droppableId={status}>
											{(provided) => (
												<div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 420 }}>
													{tasksByStatus[status].map((item, index) => (
														<Draggable key={item.id} draggableId={item.id} index={index}>
															{(dragProvided, snapshot) => (
																<div
																		ref={dragProvided.innerRef}
																		{...dragProvided.draggableProps}
																		{...dragProvided.dragHandleProps}
																		style={{
																			marginBottom: 12,
																			background: snapshot.isDragging ? '#fafafa' : undefined,
																			...dragProvided.draggableProps.style,
																	}}
																>
																	<TodoItem record={item} index={index} />
																</div>
															)}
														</Draggable>
													))}
													{provided.placeholder}
												</div>
											)}
											</Droppable>
									</Card>
								</Col>
							))}
						</Row>
					</DragDropContext>
				</Tabs.TabPane>
				<Tabs.TabPane tab='Danh sách task' key='table'>
					<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
						<Col xs={24} md={12}>
							<Input.Search
								allowClear
								placeholder='Tìm kiếm theo tên task'
								onSearch={(value) => setSearchText(value)}
								onChange={(event) => setSearchText(event.target.value)}
								value={searchText}
							/>
						</Col>
						<Col xs={24} md={12}>
							<Select
								allowClear
								placeholder='Lọc theo trạng thái'
								style={{ width: '100%' }}
								value={statusFilter}
								onChange={(value) => setStatusFilter(value)}
								options={[
									{ value: 'todo', label: 'Cần làm' },
									{ value: 'inprogress', label: 'Đang làm' },
									{ value: 'done', label: 'Hoàn thành' },
								]}
							/>
						</Col>
					</Row>
					<Table
						rowKey='id'
						columns={columns}
						dataSource={filteredData}
						pagination={{ pageSize: 8 }}
					/>
				</Tabs.TabPane>
			</Tabs>
			<Modal destroyOnClose visible={visible} footer={null} onCancel={() => setVisible(false)}>
				<FormTodoList />
			</Modal>
		</div>
	);
};

export default TodoList;
