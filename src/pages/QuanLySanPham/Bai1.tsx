import React, {useState} from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, message} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { sanPham } from '@/models/sanpham';


export default function QuanLySanPham() {
    const [products,setProducts] = useState(sanPham);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    // Đóng mở modal
    const handleShowModal = () => {
        form.resetFields();
        setIsModalOpen(true);
    };
    const handleHideModal = () => {
        form.resetFields();
        setIsModalOpen(false);
    };
    // Xóa sản phẩm
    const handleDeleteProduct = (id: number) => {
        setProducts(products.filter((item: any) => item.id !== id));
        message.success('Xóa sản phẩm thành công!');
    };
    // Thêm sản phẩm
    const handleAddProduct = (values: any) => {
    const maxId = Math.max(...products.map((p: any) => p.id), 0);
    const newProduct = {
        id: maxId + 1,
        name: values.name,
        price: values.price,
        quantity: values.quantity,
    };
        setProducts([...products, newProduct]);
        message.success('Thêm sản phẩm thành công!');
        setIsModalOpen(false);
    };
    // Tìm kiếm sản phẩm
    const handleSearchProduct = products.filter((item: any) => item.name.toLowerCase().includes(searchText.toLowerCase()));
    const cot = [
        {
            title: 'STT',
            dataIndex:'id',
            key:'id',
            width:40,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex:'name',
            key:'name',
            width:200,
        },
        {
            title: 'Giá',
            dataIndex:'price',
            key:'price',
            width:200,
        },
        {
            title: 'Số lượng',
            dataIndex:'quantity',
            key:'quantity',
            width:200,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            render: (_: any, record: any) => (
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa?"
                    okText="Xóa"
                    cancelText="Hủy"
                    onConfirm={() => handleDeleteProduct(record.id)}
                >
                    <Button danger size="small" icon={<DeleteOutlined />}>
                        Xóa
                    </Button>
                </Popconfirm>
            ),
        },
    ];
    return (
    <>
        {/* Thanh công cụ */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <Input
                placeholder="Tìm theo tên sản phẩm"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
            />

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleShowModal}
            >
                Thêm sản phẩm
            </Button>
        </div>

        {/* Bảng sản phẩm */}
        <Table
            columns={cot}
            dataSource={handleSearchProduct}
            rowKey="id"
            pagination={{ pageSize: 5 }}
        />

        {/* Modal thêm sản phẩm */}
        <Modal
            title="Thêm sản phẩm"
            visible={isModalOpen}
            onCancel={handleHideModal}
            onOk={() => form.submit()}
            okText="Thêm"
            cancelText="Hủy"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleAddProduct}
            >
                <Form.Item
                    label="Tên sản phẩm"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label="Số lượng"
                    name="quantity"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                    <Input type="number" />
                </Form.Item>
            </Form>
        </Modal>
    </>
);
};
