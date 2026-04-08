import React, { useState, useEffect } from 'react';
import {
  Card, Button, List, Typography, Modal, Form, Input, DatePicker,
  Select, message, Row, Col, Statistic, Alert, Space
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EditOutlined, ClockCircleOutlined,
  DollarOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import type { Destination, Itinerary, ItineraryItem } from '@/models/travel';
import { destinationService, itineraryService } from '@/services/travel';
import TravelLayout from './index';
import moment from 'moment';
import styles from './Itinerary.less';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ItineraryPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [form] = Form.useForm();
  const loadDestinations = async () => {
    try {
      const data = await destinationService.getAll();
      setDestinations(data);
    } catch (error) {
      message.error('Failed to load destinations');
    }
  };

  const loadCurrentItinerary = () => {
    const saved = localStorage.getItem('currentItinerary');
    if (saved) {
      setCurrentItinerary(JSON.parse(saved));
    }
  };
  useEffect(() => {
    loadDestinations();
    loadCurrentItinerary();
  }, []);


  const addDestinationToItinerary = (destination: Destination, day: number) => {
    if (!currentItinerary) {
      const newItinerary: Itinerary = {
        id: Date.now().toString(),
        name: 'Lịch trình mới',
        userId: 'user1',
        items: [],
        totalBudget: 0,
        startDate: moment().format(),
        endDate: moment().add(1, 'week').format(),
        createdAt: moment().format(),
      };
      setCurrentItinerary(newItinerary);
    }

    const updatedItinerary = { ...currentItinerary! };
    const saveItinerary = (itinerary: Itinerary) => {
    localStorage.setItem('currentItinerary', JSON.stringify(itinerary));
    setCurrentItinerary(itinerary);
  };
    const newItem: ItineraryItem = {
      id: Date.now().toString(),
      destinationId: destination.id,
      day,
      order: updatedItinerary.items.filter(item => item.day === day).length + 1,
    };

    updatedItinerary.items.push(newItem);
    updatedItinerary.totalBudget = itineraryService.calculateBudget(
      destinations.filter(d => updatedItinerary.items.some(item => item.destinationId === d.id)),
      moment(updatedItinerary.endDate).diff(moment(updatedItinerary.startDate), 'days') + 1
    );

    saveItinerary(updatedItinerary);
    message.success('Đã thêm điểm đến vào lịch trình');
  };

  const removeFromItinerary = (itemId: string) => {
    if (!currentItinerary) return;

    const updatedItinerary = { ...currentItinerary };
    updatedItinerary.items = updatedItinerary.items.filter(item => item.id !== itemId);
    updatedItinerary.totalBudget = itineraryService.calculateBudget(
      destinations.filter(d => updatedItinerary.items.some(item => item.destinationId === d.id)),
      moment(updatedItinerary.endDate).diff(moment(updatedItinerary.startDate), 'days') + 1
    );

    saveItinerary(updatedItinerary);
    message.success('Đã xóa điểm đến khỏi lịch trình');
  };

  const getDestinationById = (id: string) => {
    return destinations.find(d => d.id === id);
  };

  const getItemsByDay = (day: number) => {
    if (!currentItinerary) return [];
    return currentItinerary.items
      .filter(item => item.day === day)
      .sort((a, b) => a.order - b.order);
  };

  const calculateDayBudget = (day: number) => {
    const dayItems = getItemsByDay(day);
    return dayItems.reduce((total, item) => {
      const dest = getDestinationById(item.destinationId);
      if (dest) {
        return total + dest.costs.food + dest.costs.accommodation + dest.costs.transportation;
      }
      return total;
    }, 0);
  };

  const renderDayCard = (day: number) => {
    const dayItems = getItemsByDay(day);
    const dayBudget = calculateDayBudget(day);

    return (
      <Card
        title={`Ngày ${day}`}
        extra={<Text type="secondary">{dayBudget.toLocaleString()} VND</Text>}
        style={{ marginBottom: 16 }}
      >
        <List
          dataSource={dayItems}
          renderItem={(item) => {
            const destination = getDestinationById(item.destinationId);
            if (!destination) return null;

            return (
              <List.Item
                actions={[
                  <Button
                    key={`remove-${item.id}`}
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromItinerary(item.id)}
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={<EnvironmentOutlined />}
                  title={destination.name}
                  description={
                    <Space direction="vertical" size="small">
                      <Text>{destination.location}</Text>
                      <Text type="secondary">
                        <ClockCircleOutlined /> {destination.visitDuration}h
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedDestination(null);
            setIsModalVisible(true);
          }}
          block
        >
          Thêm điểm đến
        </Button>
      </Card>
    );
  };

  const handleAddDestination = () => {
    form.validateFields().then((values) => {
      const destination = destinations.find(d => d.id === values.destinationId);
      if (destination) {
        addDestinationToItinerary(destination, values.day);
        setIsModalVisible(false);
        form.resetFields();
      }
    });
  };

  const totalDays = currentItinerary ?
    moment(currentItinerary.endDate).diff(moment(currentItinerary.startDate), 'days') + 1 : 7;

  const content = (
    <div className={styles.itinerary}>
      <div className={styles.header}>
        <Title level={2}>Tạo lịch trình du lịch</Title>
        <Space>
          <Button type="primary">Lưu lịch trình</Button>
          <Button>Tải xuống PDF</Button>
        </Space>
      </div>

      {currentItinerary && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} md={8}>
            <Statistic
              title="Tổng ngân sách"
              value={currentItinerary.totalBudget}
              prefix={<DollarOutlined />}
              suffix="VND"
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic
              title="Số ngày"
              value={totalDays}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic
              title="Số điểm đến"
              value={currentItinerary.items.length}
            />
          </Col>
        </Row>
      )}

      {currentItinerary && currentItinerary.totalBudget > 10000000 && (
        <Alert
          message="Cảnh báo vượt ngân sách"
          description="Ngân sách của bạn đã vượt quá 10 triệu VND. Hãy cân nhắc điều chỉnh lịch trình."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          {Array.from({ length: totalDays }, (_, i) => i + 1).map(day =>
            renderDayCard(day)
          )}
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Danh sách điểm đến" className={styles.destinationList}>
            <List
              dataSource={destinations}
              renderItem={(destination) => (
                <List.Item
                  actions={[
                    <Button
                      key={`add-${destination.id}`}
                      size="small"
                      onClick={() => {
                        setSelectedDestination(destination);
                        setIsModalVisible(true);
                      }}
                    >
                      Thêm
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={destination.name}
                    description={destination.location}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Thêm điểm đến vào lịch trình"
        visible={isModalVisible}
        onOk={handleAddDestination}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="destinationId"
            label="Điểm đến"
            rules={[{ required: true, message: 'Vui lòng chọn điểm đến' }]}
            initialValue={selectedDestination?.id}
          >
            <Select placeholder="Chọn điểm đến">
              {destinations.map(dest => (
                <Option key={dest.id} value={dest.id}>
                  {dest.name} - {dest.location}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="day"
            label="Ngày"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <Select placeholder="Chọn ngày">
              {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
                <Option key={day} value={day}>Ngày {day}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );

  return <TravelLayout>{content}</TravelLayout>;
};

export default ItineraryPage;