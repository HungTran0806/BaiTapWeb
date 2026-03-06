import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Tag, Space, Select, Popconfirm, message } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { sanPham } from '@/models/sanpham-donhangmau';

export default function QuanLySanPham() {
	const [products, setProducts] = useState(() => {
		const productsFromLocal = localStorage.getItem('products');
		return productsFromLocal ? JSON.parse(productsFromLocal) : sanPham;
	});
	useEffect(() => {
		localStorage.setItem('products', JSON.stringify(products));
	}, [products]);
	const [searchText, setSearchText] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [selectedCategory, setSelectedCategory] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [editId, setEditId] = useState(null);
	const getFilteredProducts = useMemo(() => {
		let final = products;
		if (statusFilter) {
			final = final.filter((item: any) => {
				if (statusFilter === 'Còn hàng') return item.quantity > 10;
				if (statusFilter === 'Sắp hết') return item.quantity > 0 && item.quantity <= 10;
				if (statusFilter === 'Hết hàng') return item.quantity === 0;
				return true;
			});
		}
		if (selectedCategory) {
			final = final.filter((item: any) => item.category === selectedCategory);
		}
		if (searchText) {
			final = final.filter((item: any) => item.name.toLowerCase().includes(searchText.toLowerCase()));
		}
		return final;
	}, [products, statusFilter, selectedCategory, searchText]);

	const formatPrice = (price: number) => {
		return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
	};
	const getNewStatus = (quantity: number) => {
		if (quantity > 10) return { text: 'Còn hàng', color: 'green' };
		if (quantity > 0 && quantity <= 10) return { text: 'Sắp hết', color: 'yellow' };
		return { text: 'Hết hàng', color: 'red' };
	};
	const categories = [...new Set(products.map((item: any) => item.category))];

	const handleShowModal = () => {
		form.resetFields();
		setIsModalOpen(true);
	};
	const handleHideModal = () => {
		form.resetFields();
		setIsModalOpen(false);
	};
	const handleEdit = (record: any) => {
		setEditId(record.id);
		form.setFieldsValue(record);
		setIsModalOpen(true);
	};

	const handleDeleteProduct = (id: number) => {
		setProducts(products.filter((item: any) => item.id !== id));
		message.success('Xóa sản phẩm thành công!');
	};
	const handleAddProduct = (values: any) => {
		if (editId) {
			setProducts(products.map((item: any) => (item.id === editId ? { ...item, ...values } : item)));
			message.success('Cập nhật sản phẩm thành công');
		} else {
			const maxId = Math.max(...products.map((item: any) => item.id), 0);
			const newProduct = {
				id: maxId + 1,
				name: values.name,
				category: values.category,
				price: values.price,
				quantity: values.quantity,
			};
			setProducts([...products, newProduct]);
			message.success('Thêm sản phẩm thành công!');
			setIsModalOpen(false);
		}
	};
	// Tìm kiếm sản phẩm
	// const handleSearchProduct = products.filter((item: any) =>
	// 	item.name.toLowerCase().includes(searchText.toLowerCase()),
	// );
	const cot = [
		{
			title: 'STT',
			dataIndex: 'id',
			key: 'id',
			width: 40,
			// render: (index: number) => index ,
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
			width: 200,
		},
		{
			title: 'Danh mục',
			dataIndex: 'category',
			key: 'category',
			width: 200,
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			width: 200,
			render: (price: number) => formatPrice(price),
			sorter: (a: any, b: any) => a.price - b.price,
		},
		{
			title: 'Số lượng tồn kho',
			dataIndex: 'quantity',
			key: 'quantity',
			width: 200,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'quantity',
			render: (quantity: number) => {
				const newStatus = getNewStatus(quantity);
				return <Tag color={newStatus.color}>{newStatus.text}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 150,
			render: (record: any) => (
				<Space size='small'>
					<Button type='primary' size='small' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa?'
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => handleDeleteProduct(record.id)}
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
		<>
			<h1>Quản lý sản phẩm</h1>
			<div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
				<Input
					placeholder='Tìm theo tên sản phẩm'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 300 }}
				/>

				<Button type='primary' icon={<PlusOutlined />} onClick={handleShowModal}>
					Thêm sản phẩm
				</Button>
			</div>

			<div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
				<Space direction='vertical' style={{ width: '100%' }} size='middle'>
					<div>
						<label style={{ marginRight: '10px' }}>Danh mục:</label>
						<Select
							placeholder='Chọn danh mục'
							style={{ width: '200px' }}
							allowClear
							value={selectedCategory || undefined}
							onChange={(value) => setSelectedCategory(value || '')}
							options={categories.map((item) => ({ label: item, value: item }))}
						/>
					</div>

					<div>
						<label style={{ marginRight: '10px' }}>Trạng thái</label>
						<Select
							placeholder='Chọn trạng thái'
							style={{ width: '200px' }}
							allowClear
							value={statusFilter || undefined}
							onChange={(value) => setStatusFilter(value || '')}
							options={[
								{ label: 'Còn hàng', value: 'Còn hàng' },
								{ label: 'Sắp hết', value: 'Sắp hết' },
								{ label: 'Hết hàng', value: 'Hết hàng' },
							]}
						/>
					</div>

					<Table columns={cot} dataSource={getFilteredProducts} rowKey='id' pagination={{ pageSize: 5 }} />

					<Modal
						title='Thêm sản phẩm'
						visible={isModalOpen}
						onCancel={handleHideModal}
						onOk={() => form.submit()}
						okText='Thêm'
						cancelText='Hủy'
					>
						<Form form={form} layout='vertical' onFinish={handleAddProduct}>
							<Form.Item label='Tên sản phẩm' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
								<Input />
							</Form.Item>

							<Form.Item
								label='Danh mục '
								name='category'
								rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
							>
								<Input />
							</Form.Item>

							<Form.Item label='Giá' name='price' rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
								<Input type='number' />
							</Form.Item>

							<Form.Item
								label='Số lượng'
								name='quantity'
								rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
							>
								<Input type='number' />
							</Form.Item>
						</Form>
					</Modal>
				</Space>
			</div>
		</>
	);
}
