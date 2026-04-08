import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Input, Rate, Button, Spin, message } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { Destination } from '@/models/travel';
import { destinationService } from '@/services/travel';
import TravelLayout from './index';
import styles from './Home.less';

const { Option } = Select;
const { Meta } = Card;

const Home: React.FC = () => {
	const [destinations, setDestinations] = useState<Destination[]>([]);
	const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchText, setSearchText] = useState('');
	const [typeFilter, setTypeFilter] = useState<string>('');
	const [sortBy, setSortBy] = useState<string>('rating');

	const loadDestinations = async () => {
		try {
			setLoading(true);
			const data = await destinationService.getAll();
			setDestinations(data);
		} catch (error) {
			message.error('Failed to load destinations');
		} finally {
			setLoading(false);
		}
	};

	const filterAndSortDestinations = () => {
		let filtered = destinations.filter(
			(dest) =>
				dest.name.toLowerCase().includes(searchText.toLowerCase()) ||
				dest.location.toLowerCase().includes(searchText.toLowerCase()),
		);

		if (typeFilter) {
			filtered = filtered.filter((dest) => dest.type === typeFilter);
		}

		// Sort
		filtered.sort((a, b) => {
			switch (sortBy) {
				case 'rating':
					return b.rating - a.rating;
				case 'name':
					return a.name.localeCompare(b.name);
				case 'cost':
					const costA = a.costs.food + a.costs.accommodation + a.costs.transportation;
					const costB = b.costs.food + b.costs.accommodation + b.costs.transportation;
					return costA - costB;
				default:
					return 0;
			}
		});

		setFilteredDestinations(filtered);
	};
	useEffect(() => {
		loadDestinations();
	}, []);

	useEffect(() => {
		filterAndSortDestinations();
	}, [destinations, searchText, typeFilter, sortBy]);
	const handleAddToItinerary = (destination: Destination) => {
		// TODO: Implement add to itinerary functionality
		message.success(`${destination.name} added to itinerary`);
	};

	const content = (
		<div className={styles.home}>
			<div className={styles.header}>
				<h1>Khám phá điểm đến</h1>
				<p>Tìm kiếm và khám phá các điểm đến du lịch tuyệt vời</p>
			</div>

			<div className={styles.filters}>
				<Row gutter={16}>
					<Col xs={24} sm={12} md={8}>
						<Input
							placeholder='Tìm kiếm điểm đến...'
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Select
							placeholder='Loại hình'
							style={{ width: '100%' }}
							value={typeFilter}
							onChange={setTypeFilter}
							allowClear
						>
							<Option value='beach'>Biển</Option>
							<Option value='mountain'>Núi</Option>
							<Option value='city'>Thành phố</Option>
							<Option value='other'>Khác</Option>
						</Select>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Select placeholder='Sắp xếp theo' style={{ width: '100%' }} value={sortBy} onChange={setSortBy}>
							<Option value='rating'>Đánh giá</Option>
							<Option value='name'>Tên</Option>
							<Option value='cost'>Chi phí</Option>
						</Select>
					</Col>
				</Row>
			</div>

			<div className={styles.destinations}>
				<Row gutter={[16, 16]}>
					{filteredDestinations.map((destination) => (
						<Col xs={24} sm={12} md={8} lg={6} key={destination.id}>
							<Card
								hoverable
								cover={
									<img alt={destination.name} src={destination.image} style={{ height: 200, objectFit: 'cover' }} />
								}
								actions={[
									<Button key={`add-itinerary-${destination.id}`} type='primary' onClick={() => handleAddToItinerary(destination)}>
										Thêm vào lịch trình
									</Button>,
								]}
							>
								<Meta
									title={destination.name}
									description={
										<div>
											<p>{destination.location}</p>
											<Rate disabled defaultValue={destination.rating} />
											<p>Thời gian tham quan: {destination.visitDuration}h</p>
											<p>
												Chi phí ước tính:{' '}
												{(
													destination.costs.food +
													destination.costs.accommodation +
													destination.costs.transportation
												).toLocaleString()}{' '}
												VND
											</p>
										</div>
									}
								/>
							</Card>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);

	if (loading) {
		return (
			<TravelLayout>
				<div style={{ textAlign: 'center', padding: '50px' }}>
					<Spin size='large' />
				</div>
			</TravelLayout>
		);
	}

	return <TravelLayout>{content}</TravelLayout>;
};

export default Home;
