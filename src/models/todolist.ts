import { useState } from 'react';
import moment from 'moment';

const STORAGE_KEY = 'todolist';
const defaultColors = ['#7498d8', '#f1d9a4', '#67c759', '#f29092'];

const getRandomInt = (min: number, max: number) => {
	const minTemp = Math.ceil(min);
	const maxTemp = Math.floor(max);
	return Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp;
};

const normalize = (item: any): TodoList.TodoItem => ({
	id: item.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
	title: item.title || item.content || 'Untitled task',
	description: item.description || '',
	deadline: item.deadline || moment().add(1, 'day').format('YYYY-MM-DD'),
	priority: item.priority || 'Trung bình',
	tags: item.tags || [],
	status: item.status || 'todo',
	color: item.color || defaultColors[getRandomInt(0, defaultColors.length - 1)],
});

export default () => {
	const [data, setData] = useState<TodoList.TodoItem[]>([]);
	const [todoItem, setTodoItem] = useState<TodoList.TodoItem>();
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);

	const saveData = (nextData: TodoList.TodoItem[]) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
		setData(nextData);
	};

	const getDataTodo = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem(STORAGE_KEY) as any) || [];
		setData(dataLocal.map(normalize));
	};

	const deleteTodo = (id: string) => {
		saveData(data.filter((item) => item.id !== id));
	};

	return {
		data,
		setData,
		getDataTodo,
		todoItem,
		setTodoItem,
		isEdit,
		setIsEdit,
		visible,
		setVisible,
		saveData,
		deleteTodo,
	};
};
