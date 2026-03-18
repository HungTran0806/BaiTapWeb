import { useState, useEffect } from 'react';
import { Card, Form, Select, DatePicker, Button, Table, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Service, Staff, Appointment } from '@/models/types';

const { Option } = Select;
const AppointmentPage = () => {
	const [form] = Form.useForm();
	const [services, setServices] = useState<Service[]>([]);
	const [staffs, setStaffs] = useState<Staff[]>([]);
	const [appointments, setAppointments] = useState<Appointment[]>([]);

	useEffect(() => {
		const savedServices = localStorage.getItem('services');
		const savedStaffs = localStorage.getItem('staffs');
		const savedAppointments = localStorage.getItem('appointments');
		if (savedServices) setServices(JSON.parse(savedServices));
		if (savedStaffs) setStaffs(JSON.parse(savedStaffs));
		if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
	}, []);

	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'staffs' && e.newValue) {
				setStaffs(JSON.parse(e.newValue));
			}
			if (e.key === 'services' && e.newValue) {
				setServices(JSON.parse(e.newValue));
			}
		};
		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, []);
    
	const updateAppointments = (newList: Appointment[]) => {
		setAppointments(newList);
		localStorage.setItem('appointments', JSON.stringify(newList));
	};

	const reloadLookupData = () => {
		const savedServices = localStorage.getItem('services');
		const savedStaffs = localStorage.getItem('staffs');
		if (savedServices) setServices(JSON.parse(savedServices));
		if (savedStaffs) setStaffs(JSON.parse(savedStaffs));
	};

	useEffect(() => {
		reloadLookupData();
		const onUpdated = () => reloadLookupData();
		window.addEventListener('dataUpdated', onUpdated);
		return () => window.removeEventListener('dataUpdated', onUpdated);
	}, []);

	const addAppointment = (values: any) => {
		const newAppointment: Appointment = {
			id: Date.now(),
			staffId: values.staffId,
			serviceId: values.serviceId,
			customerName: values.customerName,
			date: values.date.format('YYYY-MM-DD'),
			startTime: values.startTime,
			endTime: values.endTime,
			status: 'CHỜ DUYỆT',
		};

		const newList = [...appointments, newAppointment];
		updateAppointments(newList);

		message.success('Đặt lịch thành công!');
		form.resetFields();
	};
	const deleteAppointment = (id: number) => {
		const newList = appointments.filter((a) => a.id !== id);
		updateAppointments(newList);
		message.success('Đã xóa lịch hẹn!');
	};
	const columns: ColumnsType<Appointment> = [
		{
			title: 'Nhân viên',
			dataIndex: 'staffId',
			render: (id) => staffs.find((s) => s.id === id)?.name || 'Không rõ',
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'serviceId',
			render: (id) => services.find((s) => s.id === id)?.name || 'Không rõ',
		},
		{
			title: 'Ngày hẹn',
			dataIndex: 'date',
		},
		{
			title: 'Hành động',
			render: (_, record) => (
				<Button danger onClick={() => deleteAppointment(record.id)}>
					Xóa
				</Button>
			),
		},
	];
	return (
		<Card title='Đặt lịch dịch vụ'>
			<Form form={form} layout='vertical' onFinish={addAppointment}>
				<Space style={{ width: '100%' }} wrap>
					<Form.Item label='Nhân viên' name='staffId' rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}>
						<Select placeholder='Chọn nhân viên' style={{ width: 200 }}>
							{staffs.map((s) => (
								<Option key={s.id} value={s.id}>
									{s.name}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label='Dịch vụ' name='serviceId' rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}>
						<Select placeholder='Chọn dịch vụ' style={{ width: 200 }}>
							{services.map((s) => (
								<Option key={s.id} value={s.id}>
									{s.name}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label='Ngày hẹn' name='date' rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
						<DatePicker style={{ width: 200 }} />
					</Form.Item>

					<Form.Item label=' '>
						<Button type='primary' htmlType='submit'>
							Đặt lịch
						</Button>
					</Form.Item>
				</Space>
			</Form>
			<Table
				style={{ marginTop: 20 }}
				rowKey='id'
				columns={columns}
				dataSource={appointments}
				pagination={{ pageSize: 5 }}
				bordered
			/>
		</Card>
	);
};
export default AppointmentPage;
