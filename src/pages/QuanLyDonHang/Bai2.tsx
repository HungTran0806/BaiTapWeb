import { useEffect, useState, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  Space,
  Select,
  Popconfirm,
  message,
  InputNumber,
  Drawer,
} from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { sanPham, donHang, khachHang } from '@/models/sanpham-donhangmau';

export default function QuanLyDonHang() {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : donHang;
  });

  const [customers] = useState(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : khachHang;
  });

  const [products] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : sanPham;
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search
    if (searchText) {
      result = result.filter(
        (item: any) =>
          item.id.toLowerCase().includes(searchText.toLowerCase()) ||
          item.customerName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      result = result.filter((item: any) => item.status === statusFilter);
    }

    // Sort
    if (sortBy === 'date') {
      result.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'amount') {
      result.sort((a: any, b: any) => b.totalAmount - a.totalAmount);
    }

    return result;
  }, [orders, searchText, statusFilter, sortBy]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'Chờ xác nhận': 'blue',
      'Đang giao': 'orange',
      'Hoàn thành': 'green',
      'Hủy': 'red',
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

  const getCustomerInfo = (customerId: number) => {
    return customers.find((c: any) => c.id === customerId);
  };

  const handleShowModal = () => {
    setEditId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditId(record.id);
    form.setFieldsValue({
      customerId: record.customerId,
      products: record.products,
      status: record.status,
    });
    setIsModalOpen(true);
  };

  // Validate form data
  const validateOrderData = (values: any) => {
    // Check if customer is selected
    if (!values.customerId) {
      message.error('Vui lòng chọn khách hàng!');
      return false;
    }

    // Check if products are selected
    if (!values.products || values.products.length === 0) {
      message.error('Vui lòng chọn ít nhất một sản phẩm!');
      return false;
    }

    // Check if all products have valid data
    for (const item of values.products) {
      if (!item.productId || !item.quantity) {
        message.error('Vui lòng chọn sản phẩm và số lượng!');
        return false;
      }

      const product = products.find((p: any) => p.id === item.productId);
      if (!product) {
        message.error('Sản phẩm không tồn tại!');
        return false;
      }

      // Only check quantity for new orders or if product is changed
      if (!editId) {
        if (item.quantity > product.quantity) {
          message.error(
            `Số lượng "${product.name}" không đủ! Tồn kho: ${product.quantity}`
          );
          return false;
        }
      }
    }

    // Check for duplicate order ID (when editing)
    if (editId) {
      const isDuplicate = orders.some(
        (o: any) => o.id === editId && o.id !== editId
      );
      if (isDuplicate) {
        message.error('Mã đơn hàng đã tồn tại!');
        return false;
      }
    }

    return true;
  };

  const handleAddOrEditOrder = (values: any) => {
    if (!validateOrderData(values)) {
      return;
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

    const customerInfo = getCustomerInfo(values.customerId);

    if (editId) {
      // Edit existing order
      setOrders(
        orders.map((order: any) =>
          order.id === editId
            ? {
                ...order,
                customerId: values.customerId,
                customerName: customerInfo.name,
                phone: customerInfo.phone,
                address: customerInfo.address,
                products: orderProducts,
                totalAmount,
                status: values.status || order.status,
              }
            : order
        )
      );
      message.success('Cập nhật đơn hàng thành công!');
    } else {
      // Add new order
      const newOrder = {
        id: generateOrderId(),
        customerId: values.customerId,
        customerName: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        products: orderProducts,
        totalAmount,
        status: 'Chờ xác nhận',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setOrders([...orders, newOrder]);
      message.success('Thêm đơn hàng thành công!');
    }

    setIsModalOpen(false);
  };

  const handleDeleteOrder = (orderId: string) => {
    const order = orders.find((o: any) => o.id === orderId);
    if (order && order.status !== 'Chờ xác nhận') {
      message.error('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"!');
      return;
    }
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
      width: 100,
      sorter: (a: any, b: any) => a.id.localeCompare(b.id),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
      sorter: (a: any, b: any) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'products',
      key: 'productCount',
      width: 120,
      render: (orderProducts: any[]) => orderProducts.length,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      render: (price: number) => formatPrice(price),
      sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataindex: 'createdAt',
      key: 'createdAt',
      sorter: (a: any, b: any)=> new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
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
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title={
              record.status !== 'Chờ xác nhận'
                ? 'Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"!'
                : 'Hành động này không thể hoàn tác.'
            }
            okText="Hủy"
            cancelText="Không"
            onConfirm={() => handleDeleteOrder(record.id)}
            disabled={record.status !== 'Chờ xác nhận'}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              disabled={record.status !== 'Chờ xác nhận'}
            >
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Quản lý Đơn hàng</h1>

      {/* Search and Filter Section */}
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
              placeholder="Tìm theo mã đơn hàng hoặc tên khách hàng"
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '300px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <label style={{ marginRight: '10px' }}>Trạng thái:</label>
              <Select
                placeholder="Lọc theo trạng thái"
                style={{ width: '200px' }}
                allowClear
                onChange={setStatusFilter}
                value={statusFilter || undefined}
                options={[
                  { label: 'Chờ xác nhận', value: 'Chờ xác nhận' },
                  { label: 'Đang giao', value: 'Đang giao' },
                  { label: 'Hoàn thành', value: 'Hoàn thành' },
                  { label: 'Hủy', value: 'Hủy' },
                ]}
              />
            </div>

            <div>
              <label style={{ marginRight: '10px' }}>Sắp xếp:</label>
              <Select
                placeholder="Sắp xếp theo"
                style={{ width: '200px' }}
                allowClear
                onChange={(value) => setSortBy(value || '')}
                value={sortBy || undefined}
                options={[
                  { label: 'Ngày đặt hàng (mới nhất)', value: 'date' },
                  { label: 'Tổng tiền (cao nhất)', value: 'amount' },
                ]}
              />
            </div>
          </div>
        </Space>
      </div>

      {/* Add Order Button */}
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleShowModal}>
          Thêm đơn hàng
        </Button>
      </div>

      {/* Orders Table */}
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      {/* Add/Edit Order Modal */}
      <Modal
        title={editId ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng mới'}
        visible={isModalOpen}
        okText={editId ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          setEditId(null);
        }}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrEditOrder}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            label="Khách hàng"
            name="customerId"
            rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
          >
            <Select
              placeholder="Chọn khách hàng"
              options={customers.map((c: any) => ({
                label: `${c.name} - ${c.phone}`,
                value: c.id,
              }))}
            />
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
                      backgroundColor: '#fafafa',
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
                          label: `${p.name} - ${formatPrice(p.price)} (${p.quantity} cái)`,
                          value: p.id,
                        }))}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Số lượng"
                      name={[field.name, 'quantity']}
                      rules={[
                        { required: true, message: 'Nhập số lượng!' },
                        { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        placeholder="Nhập số lượng"
                      />
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button
                        danger
                        size="small"
                        onClick={() => remove(field.name)}
                        block
                      >
                        Xóa sản phẩm
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  style={{ marginTop: '10px' }}
                >
                  + Thêm sản phẩm
                </Button>
              </>
            )}
          </Form.List>

          {editId && (
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select
                placeholder="Chọn trạng thái"
                options={[
                  { label: 'Chờ xác nhận', value: 'Chờ xác nhận' },
                  { label: 'Đang giao', value: 'Đang giao' },
                  { label: 'Hoàn thành', value: 'Hoàn thành' },
                  { label: 'Hủy', value: 'Hủy' },
                ]}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Order Details Drawer */}
      <Drawer
        title="Chi tiết đơn hàng"
        onClose={() => setIsDrawerOpen(false)}
        visible={isDrawerOpen}
        width={600}
      >
        {selectedOrder && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <p>
                <strong>Mã đơn hàng:</strong> {selectedOrder.id}
              </p>
              <p>
                <strong>Khách hàng:</strong> {selectedOrder.customerName}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedOrder.address}
              </p>
              <p>
                <strong>Ngày đặt hàng:</strong> {selectedOrder.createdAt}
              </p>
              <p>
                <strong>Trạng thái:</strong>{' '}
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </Tag>
              </p>
            </div>

            <h3>Danh sách sản phẩm:</h3>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '20px',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '2px solid #1890ff' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Sản phẩm</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>SL</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Giá</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map((p: any) => (
                  <tr key={p.productId} style={{ borderBottom: '1px solid #ddd' }}>
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

            <div
              style={{
                padding: '15px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                textAlign: 'right',
              }}
            >
              <h3 style={{ margin: 0 }}>
                Tổng tiền: <span style={{ color: '#1890ff' }}>{formatPrice(selectedOrder.totalAmount)}</span>
              </h3>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}