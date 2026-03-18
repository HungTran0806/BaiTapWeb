import { useState, useEffect } from 'react';
import type { Staff } from '@/models/types';
import { Card, Input, Button, List, Space, message } from 'antd';

const StaffManager = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('staffs');
    if (saved) {
      setStaffs(JSON.parse(saved));
    }
  }, []);
  const updateStaffs = (newStaffs: Staff[]) => {
    setStaffs(newStaffs);
    localStorage.setItem('staffs', JSON.stringify(newStaffs));
    window.dispatchEvent(new Event('dataUpdated'));
  };
  const addStaff = () => {
    if (!name || !limit) {
      message.warning('Vui lòng nhập đầy đủ thông tin!');   
      return;
    }
    const newStaff: Staff = {
      id: Date.now(),
      name: name,
      maxCustomersPerDay: Number(limit),
      schedules: [],
    };
    const newList = [...staffs, newStaff];
    updateStaffs(newList);
    message.success('Thêm nhân viên thành công!');
    setName('');
    setLimit('');
  };
  const deleteStaff = (id: number) => {
    const newList = staffs.filter((s) => s.id !== id);
    updateStaffs(newList);
    message.success('Đã xóa nhân viên!');
  };
  return (
    <Card title='Quản lý nhân viên' style={{ marginBottom: 20 }}>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Input
          placeholder='Tên nhân viên'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder='Số khách tối đa mỗi ngày'
          type='number'
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
        <Button type='primary' onClick={addStaff}>
          Thêm nhân viên
        </Button>
      </Space>
      <List
        style={{ marginTop: 20 }}
        bordered
        dataSource={staffs}
        renderItem={(s) => (
          <List.Item
            actions={[
              <Button
                key='delete'
                danger
                onClick={() => deleteStaff(s.id)}
              >
                Xóa
              </Button>
            ]}
          >
            {s.name} - Giới hạn: {s.maxCustomersPerDay} khách/ngày
          </List.Item>
        )}
      />
    </Card>
  );
};
export default StaffManager;