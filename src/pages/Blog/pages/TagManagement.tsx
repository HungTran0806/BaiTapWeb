import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Popconfirm, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Tag as TagType } from '@/models/blog';
import { mockTags } from '@/models/blog';

const TagManagement: React.FC = () => {
	const [tags, setTags] = useState<TagType[]>(mockTags);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingTag, setEditingTag] = useState<TagType | null>(null);
	const [searchText, setSearchText] = useState('');
	const [form] = Form.useForm();

	const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchText.toLowerCase()));

	const handleAdd = () => {
		setEditingTag(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (tag: TagType) => {
		setEditingTag(tag);
		form.setFieldsValue({
			name: tag.name,
			slug: tag.slug,
			description: tag.description,
			color: tag.color,
		});
		setIsModalVisible(true);
	};

	const handleDelete = (tagId: string) => {
		setTags(tags.filter((tag) => tag.id !== tagId));
		message.success('Xóa thẻ thành công');
	};

	const handleSubmit = (values: any) => {
		if (editingTag) {
			// Cập nhật thẻ
			setTags(
				tags.map((tag) =>
					tag.id === editingTag.id
						? {
								...tag,
								name: values.name,
								slug: values.slug,
								description: values.description,
								color: values.color,
						  }
						: tag,
				),
			);
			message.success('Cập nhật thẻ thành công');
		} else {
			// Thêm thẻ mới
			const newTag: TagType = {
				id: Date.now().toString(),
				name: values.name,
				slug: values.slug,
				description: values.description,
				color: values.color,
				postCount: 0,
			};
			setTags([...tags, newTag]);
			message.success('Thêm thẻ thành công');
		}

		setIsModalVisible(false);
		form.resetFields();
	};

	const columns = [
		{
			title: 'Tên thẻ',
			dataIndex: 'name',
			key: 'name',
			width: 150,
			render: (name: string, record: TagType) => <Tag color={record.color}>{name}</Tag>,
		},
		{
			title: 'Slug',
			dataIndex: 'slug',
			key: 'slug',
			width: 150,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			width: 250,
			ellipsis: true,
		},
		{
			title: 'Màu sắc',
			dataIndex: 'color',
			key: 'color',
			width: 100,
			render: (color: string) => (
				<div
					style={{
						width: 20,
						height: 20,
						backgroundColor: color,
						borderRadius: 2,
						border: '1px solid #d9d9d9',
					}}
				/>
			),
		},
		{
			title: 'Số bài viết',
			dataIndex: 'postCount',
			key: 'postCount',
			width: 120,
			sorter: (a: TagType, b: TagType) => a.postCount - b.postCount,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 150,
			render: (_: any, record: TagType) => (
				<Space size='small'>
					<Button size='small' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa thẻ này?'
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
			<h1>Quản lý thẻ</h1>

			<div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
				<Input
					placeholder='Tìm kiếm theo tên thẻ...'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 300 }}
				/>

				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm thẻ
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={filteredTags}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 800 }}
			/>

			<Modal
				title={editingTag ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={600}
			>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item label='Tên thẻ' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}>
						<Input />
					</Form.Item>

					<Form.Item label='Slug' name='slug' rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
						<Input />
					</Form.Item>

					<Form.Item label='Mô tả' name='description'>
						<Input.TextArea rows={3} />
					</Form.Item>

					<Form.Item label='Màu sắc' name='color' rules={[{ required: true, message: 'Vui lòng chọn màu sắc' }]}>
						<Select placeholder='Chọn màu sắc'>
							<Select.Option value='#1890ff'>Xanh dương</Select.Option>
							<Select.Option value='#52c41a'>Xanh lá</Select.Option>
							<Select.Option value='#faad14'>Vàng</Select.Option>
							<Select.Option value='#f5222d'>Đỏ</Select.Option>
							<Select.Option value='#722ed1'>Tím</Select.Option>
							<Select.Option value='#13c2c2'>Xanh ngọc</Select.Option>
							<Select.Option value='#eb2f96'>Hồng</Select.Option>
							<Select.Option value='#fa8c16'>Cam</Select.Option>
							<Select.Option value='#a0d911'>Lục nhạt</Select.Option>
							<Select.Option value='#fadb14'>Vàng nhạt</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
						<Space>
							<Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
							<Button type='primary' htmlType='submit'>
								{editingTag ? 'Cập nhật' : 'Thêm'}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default TagManagement;
