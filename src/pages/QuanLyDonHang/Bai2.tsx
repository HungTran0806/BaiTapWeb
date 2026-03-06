import React, { useState, useMemo, useEffect } from 'react';
import {  Table,  Button,  Modal,  Form,  Input,  InputNumber,  Select,  Popconfirm,message,Tag,Space,Drawer,DatePicker,} from 'antd';
import { DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { sanPham, donHang } from '@/models/sanpham-donhangmau';

export default function QuanLyDonHang() {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : donHang;
  });


  // const [filteredOrders, setFilteredOrders] = useState(donHang);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [form] = Form.useForm();
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : sanPham;
  });
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);
  const filteredOrders = useMemo(() => {
    let result = orders;
    if (searchText) {
      result = result.filter(
        (item: any) =>
          item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (statusFilter) {
      result = result.filter((item: any) => item.status === statusFilter);
    }
    if (dateRange[0] && dateRange[1]) {
      result = result.filter((item: any) => {
        const orderDate = new Date(item.createdAt);
        return orderDate >= dateRange[0]! && orderDate <= dateRange[1]!;
      });
    }
    return result;
    // setFilteredOrders(result); 
  }, [orders, searchText, statusFilter, dateRange]);
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  const getStatusColor = (status: string) => {
    const colors: any = {
      'Chờ xử lý': 'blue',
      'Đang giao': 'yellow',
      'Hoàn thành': 'green',
      'Đã hủy': 'red',
    };
    return colors[status] || 'default';
  };

  const generateOrderId = () => {
    const maxId = Math.max(
      ...orders.map((o: any) => parseInt(o.id.replace('DH', ''), 10)),
      0
    );
    return `DH${String(maxId + 1).padStart(3, '0')}`;
  };
  const handleShowModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };
  const handleCreateOrder = (values: any) => {
    for (const item of values.products) {
      const product = products.find((p: any) => p.id === item.productId);
      if (!product) {
        message.error('Sản phẩm không tồn tại!');
        return;
      }
      if (item.quantity > product.quantity) {
        message.error(
          `Số lượng "${product.name}" không đủ! Tồn kho: ${product.quantity}`
        );
        return;
      }
    }
    let totalAmount = 0;
    const orderProducts = values.products.map((item: any) => {
      const product = products.find((p: any) => p.id === item.productId);
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const newOrder = {
      id: generateOrderId(),
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      products: orderProducts,
      totalAmount,
      status: 'Chờ xử lý',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOrders([...orders, newOrder]);
    message.success('Tạo đơn hàng thành công!');
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order: any) => {
      if (order.id === orderId) {
        const oldStatus = order.status;
        if (newStatus === 'Hoàn thành' && oldStatus !== 'Hoàn thành') {
          const updatedProducts = products.map((product: any) => {
            const orderProduct = order.products.find(
              (p: any) => p.productId === product.id
            );
            if (orderProduct) {
              return {
                ...product,
                quantity: product.quantity - orderProduct.quantity,
              };
            }
            return product;
          });
          setProducts(updatedProducts);
          localStorage.setItem('products', JSON.stringify(updatedProducts));
        }
        if (newStatus === 'Đã hủy' && oldStatus === 'Chờ xử lý') {
          const updatedProducts = products.map((product: any) => {
            const orderProduct = order.products.find(
              (p: any) => p.productId === product.id
            );
            if (orderProduct) {
              return {
                ...product,
                quantity: product.quantity + orderProduct.quantity,
              };
            }
            return product;
          });
          setProducts(updatedProducts);
          localStorage.setItem('products', JSON.stringify(updatedProducts));
        }

        return { ...order, status: newStatus };
      }
      return order;
    });

    setOrders(updatedOrders);
    message.success('Cập nhật trạng thái thành công!');
  };

  const handleDelete = (orderId: string) => {
    setOrders(orders.filter((item: any) => item.id !== orderId));
    message.success('Xóa đơn hàng thành công!');
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: any, b: any) => a.id.localeCompare(b.id),
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a: any, b: any) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Số sản phẩm',
      dataIndex: 'products',
      key: 'productCount',
      render: () => products.length,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (price: number) => formatPrice(price),
      sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => (
        <Select
          value={status}
          onChange={(value) => handleUpdateStatus(record.id, value)}
          options={[
            { label: 'Chờ xử lý', value: 'Chờ xử lý' },
            { label: 'Đang giao', value: 'Đang giao' },
            { label: 'Hoàn thành', value: 'Hoàn thành' },
            { label: 'Đã hủy', value: 'Đã hủy' },
          ]}
          style={{ width: '120px' }}
        />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Chi tiết
          </Button>
          <Popconfirm
            title="Chắc chắn muốn xóa đơn hàng?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Quản lý Đơn hàng</h1>

          <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <label style={{ marginRight: '10px' }}>Tìm kiếm:</label>
            <Input.Search
              placeholder="Tên khách hàng hoặc mã đơn hàng..."
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '300px' }}
            />
          </div>

          <div>
            <label style={{ marginRight: '10px' }}>Trạng thái:</label>
            <Select
              placeholder="Chọn trạng thái"
              style={{ width: '200px' }}
              allowClear
              onChange={setStatusFilter}
              value={statusFilter}
              options={[
                { label: 'Chờ xử lý', value: 'Chờ xử lý' },
                { label: 'Đang giao', value: 'Đang giao' },
                { label: 'Hoàn thành', value: 'Hoàn thành' },
                { label: 'Đã hủy', value: 'Đã hủy' },
              ]}
            />
          </div>

          <div>
            <label style={{ marginRight: '10px' }}>Khoảng ngày:</label>
            <DatePicker.RangePicker
              onChange={(dates) =>
                setDateRange([dates?.[0]?.toDate() || null, dates?.[1]?.toDate() || null])
              }
            />
          </div>
        </Space>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleShowModal}>
          Tạo đơn hàng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Tạo đơn hàng mới"
        visible={isModalOpen}
        okText="Tạo"
        cancelText="Hủy"
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrder}>
          <Form.Item
            label="Tên khách hàng"
            name="customerName"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              {
                pattern: /^[0-9]{10,11}$/,
                message: 'Số điện thoại phải 10-11 chữ số!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.List name="products" initialValue={[{ productId: null, quantity: 1 }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    style={{
                      marginBottom: '10px',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  >
                    <Form.Item
                      label="Sản phẩm"
                      name={[field.name, 'productId']}
                      rules={[{ required: true, message: 'Chọn sản phẩm!' }]}
                    >
                      <Select
                        placeholder="Chọn sản phẩm"
                        options={products.map((p: any) => ({
                          label: `${p.name} (${p.quantity} cái)`,
                          value: p.id,
                        }))}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Số lượng"
                      name={[field.name, 'quantity']}
                      rules={[{ required: true, message: 'Nhập số lượng!' }]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button danger onClick={() => remove(field.name)}>
                        Xóa sản phẩm
                      </Button>
                    )}
                  </div>
                ))}
                <Button onClick={() => add()}>+ Thêm sản phẩm</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Drawer
  title="Chi tiết đơn hàng"
  onClose={() => setIsDrawerOpen(false)}
  visible={isDrawerOpen}
>
  {selectedOrder && (
    <div>
      <p>
        <strong>Mã đơn hàng:</strong> {selectedOrder.id}
      </p>
      <p>
        <strong>Tên khách hàng:</strong> {selectedOrder.customerName}
      </p>
      <p>
        <strong>Số điện thoại:</strong> {selectedOrder.phone}
      </p>
      <p>
        <strong>Địa chỉ:</strong> {selectedOrder.address}
      </p>
      <p>
        <strong>Trạng thái:</strong>{' '}
        <Tag color={getStatusColor(selectedOrder.status)}>
          {selectedOrder.status}
        </Tag>
      </p>
      <p>
        <strong>Ngày tạo:</strong> {selectedOrder.createdAt}
      </p>

      <h3>Danh sách sản phẩm:</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>Sản phẩm</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>Số lượng</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>Giá</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>Tổng</th>
          </tr>
        </thead>
        <tbody>
          {selectedOrder.products.map((p: any) => (
            <tr key={p.productId}>
              <td style={{ padding: '8px' }}>{p.productName}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>
                {p.quantity}
              </td>
              <td style={{ padding: '8px', textAlign: 'right' }}>
                {formatPrice(p.price)}
              </td>
              <td style={{ padding: '8px', textAlign: 'right' }}>
                {formatPrice(p.price * p.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: '20px' }}>
        Tổng tiền: {formatPrice(selectedOrder.totalAmount)}
      </h3>
    </div>
  )}
</Drawer>
    </div>
  );
}