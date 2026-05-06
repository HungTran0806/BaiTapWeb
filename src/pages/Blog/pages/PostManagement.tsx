import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Popconfirm, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { BlogPost, Tag as TagType } from '@/models/blog';
import { mockPosts, mockTags } from '@/models/blog';

const PostManagement: React.FC = () => {
	const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [form] = Form.useForm();

	const filteredPosts = posts.filter((post) => {
		const matchesSearch = post.title.toLowerCase().includes(searchText.toLowerCase());
		const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const handleAdd = () => {
		setEditingPost(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (post: BlogPost) => {
		setEditingPost(post);
		form.setFieldsValue({
			title: post.title,
			slug: post.slug,
			excerpt: post.excerpt,
			content: post.content,
			coverImage: post.coverImage,
			tags: post.tags.map((tag) => tag.id),
			status: post.status,
		});
		setIsModalVisible(true);
	};

	const handleDelete = (postId: string) => {
		setPosts(posts.filter((post) => post.id !== postId));
		message.success('Xóa bài viết thành công');
	};

	const handleSubmit = (values: any) => {
		const selectedTags = mockTags.filter((tag) => values.tags.includes(tag.id));

		if (editingPost) {
			// Cập nhật bài viết
			setPosts(
				posts.map((post) =>
					post.id === editingPost.id
						? {
								...post,
								title: values.title,
								slug: values.slug,
								excerpt: values.excerpt,
								content: values.content,
								coverImage: values.coverImage,
								tags: selectedTags,
								status: values.status,
								updatedAt: new Date().toISOString(),
						  }
						: post,
				),
			);
			message.success('Cập nhật bài viết thành công');
		} else {
			// Thêm bài viết mới
			const newPost: BlogPost = {
				id: Date.now().toString(),
				title: values.title,
				slug: values.slug,
				excerpt: values.excerpt,
				content: values.content,
				coverImage: values.coverImage,
				author: mockPosts[0].author, // Sử dụng author mặc định
				tags: selectedTags,
				status: values.status,
				views: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			setPosts([...posts, newPost]);
			message.success('Thêm bài viết thành công');
		}

		setIsModalVisible(false);
		form.resetFields();
	};

	const columns = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			key: 'title',
			width: 200,
			ellipsis: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (status: string) => (
				<Tag color={status === 'published' ? 'green' : 'orange'}>{status === 'published' ? 'Đã đăng' : 'Nháp'}</Tag>
			),
		},
		{
			title: 'Thẻ',
			dataIndex: 'tags',
			key: 'tags',
			width: 200,
			render: (tags: TagType[]) => (
				<div>
					{tags.map((tag) => (
						<Tag key={tag.id} color={tag.color} style={{ marginBottom: 4 }}>
							{tag.name}
						</Tag>
					))}
				</div>
			),
		},
		{
			title: 'Lượt xem',
			dataIndex: 'views',
			key: 'views',
			width: 100,
			sorter: (a: BlogPost, b: BlogPost) => a.views - b.views,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 150,
			render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
			sorter: (a: BlogPost, b: BlogPost) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 150,
			render: (_: any, record: BlogPost) => (
				<Space size='small'>
					<Button
						type='primary'
						size='small'
						icon={<EyeOutlined />}
						onClick={() => window.open(`/blog/post/${record.slug}`, '_blank')}
					>
						Xem
					</Button>
					<Button size='small' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa bài viết này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button danger size='small' icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '20px' }}>
			<h1>Quản lý bài viết</h1>

			<div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
				<Input
					placeholder='Tìm kiếm theo tiêu đề...'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 300 }}
				/>

				<Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
					<Select.Option value='all'>Tất cả</Select.Option>
					<Select.Option value='published'>Đã đăng</Select.Option>
					<Select.Option value='draft'>Nháp</Select.Option>
				</Select>

				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm bài viết
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={filteredPosts}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 800 }}
			/>

			<Modal
				title={editingPost ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={800}
			>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item label='Tiêu đề' name='title' rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
						<Input />
					</Form.Item>

					<Form.Item label='Slug' name='slug' rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
						<Input />
					</Form.Item>

					<Form.Item
						label='Mô tả ngắn'
						name='excerpt'
						rules={[{ required: true, message: 'Vui lòng nhập mô tả ngắn' }]}
					>
						<Input.TextArea rows={2} />
					</Form.Item>

					<Form.Item
						label='Nội dung (Markdown)'
						name='content'
						rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
					>
						<Input.TextArea rows={10} />
					</Form.Item>

					<Form.Item
						label='Ảnh đại diện'
						name='coverImage'
						rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item label='Thẻ' name='tags' rules={[{ required: true, message: 'Vui lòng chọn ít nhất một thẻ' }]}>
						<Select mode='multiple' placeholder='Chọn thẻ'>
							{mockTags.map((tag) => (
								<Select.Option key={tag.id} value={tag.id}>
									{tag.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
						<Select>
							<Select.Option value='draft'>Nháp</Select.Option>
							<Select.Option value='published'>Đã đăng</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
						<Space>
							<Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
							<Button type='primary' htmlType='submit'>
								{editingPost ? 'Cập nhật' : 'Thêm'}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default PostManagement;
