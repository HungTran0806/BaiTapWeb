import { useState, useEffect } from 'react';
import type { Service } from '@/models/types';
import { Card, Table, Button, Input, InputNumber, Space, message, Divider } from 'antd';

const ServicePage = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [duration, setDuration] = useState<number | undefined>(undefined);

    useEffect(() => {
        const saved = localStorage.getItem('services');
        if (saved) {
            const parsed: Service[] = JSON.parse(saved);
            const normalized = parsed.map((s) => ({
                ...s,
                id: Number(s.id),
                price: Number(s.price),
                duration: Number(s.duration),
            }));
            setServices(normalized);
        }
    }, []);

    const updateServices = (newServices: Service[]) => {
        setServices(newServices);
        localStorage.setItem('services', JSON.stringify(newServices));
        window.dispatchEvent(new Event('dataUpdated'));
    };

    const addService = () => {
        if (!name || price == null || duration == null) {
            message.warning('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        const newService: Service = {
            id: Date.now(),
            name: name.trim(),
            price: price,
            duration: duration,
        };
        const newList = [...services, newService];
        updateServices(newList);
        message.success('Thêm dịch vụ thành công!');
        setName('');
        setPrice(undefined);
        setDuration(undefined);
    };
    const deleteService = (id: number) => {
        const newList = services.filter((s) => s.id !== id);
        updateServices(newList);
        message.success('Đã xóa dịch vụ!');
    };
    const columns = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            render: (val: number) => val.toLocaleString() + 'đ',
        },
        {
            title: 'Thời gian (Phút)',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Service) => (
                <Button danger onClick={() => deleteService(record.id)}>
                    Xóa
                </Button>
            ),
        },
    ];

    return (
        <Card title='Quản lý danh sách dịch vụ'>
            <Space direction='vertical' style={{ width: '100%' }}>
                <Space wrap>
                    <Input 
                        placeholder='Tên dịch vụ' 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        style={{ width: 200 }}
                    />
                    <InputNumber 
                        placeholder='Giá' 
                        value={price} 
                        onChange={(val) => setPrice(val ?? undefined)} 
                        style={{ width: 150 }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                    <InputNumber 
                        placeholder='Phút' 
                        value={duration} 
                        onChange={(val) => setDuration(val ?? undefined)} 
                        style={{ width: 100 }}
                    />
                    <Button type='primary' onClick={addService}>
                        Thêm mới
                    </Button>
                </Space>
                <Divider />
                <Table
                    rowKey='id'
                    columns={columns}
                    dataSource={services}
                    pagination={{ pageSize: 5 }}
                />
            </Space>
        </Card>
    );
};

export default ServicePage;