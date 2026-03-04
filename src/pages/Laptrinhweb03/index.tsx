import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Space, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
const QuanLiSanPham = () =>{
    <h1>Quản lí sản phẩm </h1>
    export QuanLiSanPham 
};

const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
    { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
    { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
    { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const handleAddProduct = (values) => {
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: values.name,
      price: values.price,
      quantity: values.quantity
    };

    setProducts([...products, newProduct]);
    message.success('Thêm sản phẩm thành công!');
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
    message.success('Xóa sản phẩm thành công!');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      render: (_, __, index) => index + 1,
      align: 'center'
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price),
      align: 'right'
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center'
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Xóa sản phẩm"
          description="Bạn có chắc chắn muốn xóa sản phẩm này?"
          onConfirm={() => handleDeleteProduct(record.id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Quản lý Sản phẩm</h2>}
        style={{ maxWidth: 1200, margin: '0 auto' }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Phần tìm kiếm và nút thêm */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <Input.Search
              placeholder="Tìm kiếm sản phẩm theo tên..."
              allowClear
              prefix={<SearchOutlined />}
              style={{ maxWidth: 400 }}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              size="large"
            >
              Thêm sản phẩm
            </Button>
          </div>

          {/* Bảng hiển thị sản phẩm */}
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng số: ${total} sản phẩm`,
              showSizeChanger: true
            }}
            bordered
          />
        </Space>
      </Card>

      {/* Modal thêm sản phẩm */}
      <Modal
        title="Thêm sản phẩm mới"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddProduct}
          autoComplete="off"
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
              { whitespace: true, message: 'Tên sản phẩm không được chỉ chứa khoảng trắng!' }
            ]}
          >
            <Input placeholder="Nhập tên sản phẩm" size="large" />
          </Form.Item>

          <Form.Item
            label="Giá (VNĐ)"
            name="price"
            rules={[
              { required: true, message: 'Vui lòng nhập giá sản phẩm!' },
              {
                type: 'number',
                min: 1,
                message: 'Giá phải là số dương!'
              }
            ]}
          >
            <InputNumber
              placeholder="Nhập giá sản phẩm"
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng!' },
              {
                type: 'number',
                min: 1,
                message: 'Số lượng phải là số nguyên dương!'
              }
            ]}
          >
            <InputNumber
              placeholder="Nhập số lượng"
              style={{ width: '100%' }}
              min={1}
              precision={0}
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsModalOpen(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Thêm sản phẩm
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;