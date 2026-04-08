import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, InputNumber,
  Upload, message, Popconfirm, Space, Tag, Image, Row, Col
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined
} from '@ant-design/icons';
import type { Destination } from '@/models/travel';
import { destinationService } from '@/services/travel';import TravelLayout from './index';import styles from './Admin.less';

const { Option } = Select;
const { TextArea } = Input;

const Admin: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [form] = Form.useForm();

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const data = await destinationService.getAll();
      setDestinations(data);
    } catch (error) {
      message.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const handleAdd = () => {
    setEditingDestination(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Destination) => {
    setEditingDestination(record);
    form.setFieldsValue({
      ...record,
      food: record.costs.food,
      accommodation: record.costs.accommodation,
      transportation: record.costs.transportation,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await destinationService.delete(id);
      message.success('Đã xóa điểm đến');
      loadDestinations();
    } catch (error) {
      message.error('Không thể xóa điểm đến');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const destinationData = {
        name: values.name,
        description: values.description,
        location: values.location,
        type: values.type,
        image: values.image || '',
        rating: values.rating,
        visitDuration: values.visitDuration,
        costs: {
          food: values.food,
          accommodation: values.accommodation,
          transportation: values.transportation,
        },
      };

      if (editingDestination) {
        await destinationService.update(editingDestination.id, destinationData);
        message.success('Đã cập nhật điểm đến');
      } else {
        await destinationService.create(destinationData);
        message.success('Đã thêm điểm đến mới');
      }

      setIsModalVisible(false);
      loadDestinations();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await destinationService.uploadImage(file);
      form.setFieldsValue({ image: imageUrl });
      message.success('Đã tải lên hình ảnh');
    } catch (error) {
      message.error('Không thể tải lên hình ảnh');
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <Image
          src={image}
          alt="destination"
          width={60}
          height={40}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Destination, b: Destination) => a.name.localeCompare(b.name),
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeLabels = {
          beach: 'Biển',
          mountain: 'Núi',
          city: 'Thành phố',
          other: 'Khác',
        };
        return <Tag color="blue">{typeLabels[type as keyof typeof typeLabels]}</Tag>;
      },
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => `${rating}/5`,
      sorter: (a: Destination, b: Destination) => a.rating - b.rating,
    },
    {
      title: 'Thời gian tham quan',
      dataIndex: 'visitDuration',
      key: 'visitDuration',
      render: (duration: number) => `${duration}h`,
    },
    {
      title: 'Tổng chi phí',
      key: 'totalCost',
      render: (_: any, record: Destination) => {
        const total = record.costs.food + record.costs.accommodation + record.costs.transportation;
        return `${total.toLocaleString()} VND`;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Destination) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa điểm đến này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const content = (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>Quản lý điểm đến</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm điểm đến
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={destinations}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} điểm đến`,
        }}
      />

      <Modal
        title={editingDestination ? 'Sửa điểm đến' : 'Thêm điểm đến'}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên điểm đến"
                rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Địa điểm"
                rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại hình"
                rules={[{ required: true, message: 'Vui lòng chọn loại hình' }]}
              >
                <Select>
                  <Option value="beach">Biển</Option>
                  <Option value="mountain">Núi</Option>
                  <Option value="city">Thành phố</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rating"
                label="Đánh giá (1-5)"
                rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
              >
                <InputNumber min={1} max={5} step={0.1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="visitDuration"
            label="Thời gian tham quan (giờ)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian tham quan' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="food"
                label="Chi phí ăn uống (VND)"
                rules={[{ required: true, message: 'Vui lòng nhập chi phí ăn uống' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="accommodation"
                label="Chi phí lưu trú (VND)"
                rules={[{ required: true, message: 'Vui lòng nhập chi phí lưu trú' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="transportation"
                label="Chi phí di chuyển (VND)"
                rules={[{ required: true, message: 'Vui lòng nhập chi phí di chuyển' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="image" label="Hình ảnh">
            <Upload
              beforeUpload={(file) => {
                handleImageUpload(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
            {form.getFieldValue('image') && (
              <div style={{ marginTop: 8 }}>
                <Image
                  src={form.getFieldValue('image')}
                  alt="preview"
                  width={200}
                  height={120}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );

  return <TravelLayout>{content}</TravelLayout>;
};

export default Admin;