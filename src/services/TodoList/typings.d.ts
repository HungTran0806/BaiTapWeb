declare module TodoList {
	export type TaskStatus = 'todo' | 'inprogress' | 'done';
	export type TaskPriority = 'Cao' | 'Trung bình' | 'Thấp';

	export interface TodoItem {
		id: string;
		title: string;
		description?: string;
		deadline: string;
		priority: TaskPriority;
		tags: string[];
		status: TaskStatus;
		color: string;
	}
}
