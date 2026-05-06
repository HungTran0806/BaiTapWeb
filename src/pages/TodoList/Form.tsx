import { Button, DatePicker, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import moment from 'moment';

const priorityOptions = [
	{ value: 'Cao', label: 'Cao' },
	{ value: 'Trung bình', label: 'Trung bình' },
	{ value: 'Thấp', label: 'Thấp' },
];

const statusOptions = [
	{ value: 'todo', label: 'Cần làm' },
	{ value: 'inprogress', label: 'Đang làm' },
	{ value: 'done', label: 'Hoàn thành' },
];

const colors = ['#7498d8', '#f1d9a4', '#67c759', '#f29092'];

const getRandomInt = (min: number, max: number) => {
	const minTemp = Math.ceil(min);
	const maxTemp = Math.floor(max);
	return Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp;
};

const FormTodoList = () => {
	const [form] = Form.useForm();
	const { data, todoItem, isEdit, setVisible, getDataTodo, saveData, visible } = useModel('todolist');

	useEffect(() => {
		if (!visible) {
			form.resetFields();
		}
		form.setFieldsValue({
			title: todoItem?.title,
			description: todoItem?.description,
			priority: todoItem?.priority || 'Trung bình',
			tags: todoItem?.tags || [],
			status: todoItem?.status || 'todo',
			deadline: todoItem?.deadline ? moment(todoItem.deadline, 'YYYY-MM-DD') : null,
		});
	}, [todoItem, visible, form]);

	return (
		<Form
			form={form}
			labelCol={{ span: 24 }}
			onFinish={(values) => {
				const payload: TodoList.TodoItem = {
					id: todoItem?.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
					title: values.title,
					description: values.description || '',
					deadline: values.deadline.format('YYYY-MM-DD'),
					priority: values.priority,
					tags: values.tags || [],
					status: values.status,
					color: todoItem?.color || colors[getRandomInt(0, colors.length - 1)],
				};
				const nextData = isEdit ? data.map((item: TodoList.TodoItem) => (item.id === payload.id ? payload : item)) : [payload, ...data];
				saveData(nextData);
				setVisible(false);
				getDataTodo();
				form.resetFields();
			}}
		>
			<Form.Item
				label='Tên task'
				name='title'
				rules={[{ required: true, message: 'Vui lòng nhập tên task!' }]}
			>
				<Input placeholder='Nhập tên task' />
			</Form.Item>
			<Form.Item label='Mô tả' name='description'>
				<Input.TextArea rows={4} placeholder='Mô tả công việc' />
			</Form.Item>
			<Form.Item
				label='Deadline'
				name='deadline'
				rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}
			>
				<DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
			</Form.Item>
			<Form.Item
				label='Mức độ ưu tiên'
				name='priority'
				rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
			>
				<Select options={priorityOptions} />
			</Form.Item>
			<Form.Item label='Tag' name='tags'>
				<Select mode='tags' tokenSeparators={[',']} placeholder='Thêm tag' />
			</Form.Item>
			<Form.Item label='Trạng thái' name='status'>
				<Select options={statusOptions} />
			</Form.Item>
			<div className='form-footer' style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
				<Button htmlType='submit' type='primary'>
					{isEdit ? 'Chỉnh sửa' : 'Thêm mới'}
				</Button>
				<Button
					onClick={() => {
						setVisible(false);
						form.resetFields();
					}}
				>
					Hủy
				</Button>
			</div>
		</Form>
	);
};

export default FormTodoList;
