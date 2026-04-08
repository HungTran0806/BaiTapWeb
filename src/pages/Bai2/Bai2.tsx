// import React, { useState } from 'react';
// import { Tabs } from 'antd';
// import QuanLySanPham from '@/pages/QuanLySanPham/Bai2';
// import QuanLyDonHang from '@/pages/QuanLyDonHang/Bai2';

// export default function BaiTap() {
//   const [activeTab, setActiveTab] = useState('san-pham');

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1 style={{ marginBottom: '20px' }}>Ứng dụng Quản lý</h1>
      
//       <Tabs 
//         activeKey={activeTab} 
//         onChange={setActiveTab}
//       >
//         <Tabs.TabPane 
//           tab="Quản lý Sản phẩm" 
//           key="san-pham"
//         >
//           <QuanLySanPham />
//         </Tabs.TabPane>
        
//         <Tabs.TabPane 
//           tab="Quản lý Đơn hàng" 
//           key="don-hang"
//         >
//           <QuanLyDonHang />
//         </Tabs.TabPane>
//       </Tabs>
//     </div>
//   );
// }