import { useState, useEffect } from 'react';
import { Card, Input, Button, List, Rate, Select, Space, message } from 'antd';
import type { Service } from '@/models/types';

const { TextArea } = Input;
const { Option } = Select;
interface Review {
  id: number
  customerName: string
  serviceId: number
  rating: number
  comment: string
}
const ReviewPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [serviceId, setServiceId] = useState<number | undefined>();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const loadData = () => {
    const savedReviews = localStorage.getItem('reviews');
    const savedServices = localStorage.getItem('services');
    if (savedReviews) setReviews(JSON.parse(savedReviews));
    if (savedServices) setServices(JSON.parse(savedServices));
  };

  useEffect(() => {
    loadData();
    const onUpdated = () => loadData();
    window.addEventListener('dataUpdated', onUpdated);
    return () => window.removeEventListener('dataUpdated', onUpdated);
  }, []);
  const updateReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    localStorage.setItem('reviews', JSON.stringify(newReviews));
  };
  const addReview = () => {
    if (!customerName || !serviceId || !comment) {
      message.warning('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    const newReview: Review = {
      id: Date.now(),
      customerName,
      serviceId,
      rating,
      comment
    };
    const newList = [...reviews, newReview];
    updateReviews(newList);
    message.success('Gửi đánh giá thành công!');
    setCustomerName('');
    setServiceId(undefined);
    setRating(5);
    setComment('');
  };
  return (
    <Card title="Đánh giá dịch vụ">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          placeholder="Tên khách hàng"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <Select
          placeholder="Chọn dịch vụ"
          value={serviceId}
          onChange={(val) => setServiceId(val)}
        >
          {services.map((s) => (
            <Option key={s.id} value={s.id}>
              {s.name}
            </Option>
          ))}
        </Select>

        <Rate value={rating} onChange={setRating} />
        <TextArea
          rows={3}
          placeholder="Nhận xét"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button type="primary" onClick={addReview}>
          Gửi đánh giá
        </Button>
      </Space>
      <List
        style={{ marginTop: 20 }}
        bordered
        dataSource={reviews}
        renderItem={(r) => (
          <List.Item>
            <List.Item.Meta
              title={`${r.customerName} - ${
                services.find((s) => s.id === r.serviceId)?.name || ''
              }`}
              description={
                <>
                  <Rate disabled value={r.rating} />
                  <div>{r.comment}</div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
export default ReviewPage;