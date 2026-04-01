export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ActionHistory {
  id: string | number;
  action: 'Approved' | 'Rejected';
  adminName: string;
  timestamp: string;
  reason?: string;
}

export interface RegistrationApplication {
  id: string | number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  skills: string;
  clubId: string | number;
  clubName?: string;
  registrationReason: string;
  status: RegistrationStatus;
  rejectionReason?: string;
  actionHistory: ActionHistory[];
  createdAt: string;
  updatedAt?: string;
}

export const registrationsData: RegistrationApplication[] = [
  {
    id: 1,
    fullName: 'Nguyễn Văn E',
    email: 'nguyenvane@email.com',
    phone: '0901234567',
    gender: 'Nam',
    address: 'Hà Nội',
    skills: 'Lập trình Web, JavaScript',
    clubId: 1,
    clubName: 'Câu lạc bộ Lập trình',
    registrationReason: 'Muốn học hỏi thêm về web development',
    status: 'Approved',
    actionHistory: [
      {
        id: 1,
        action: 'Approved',
        adminName: 'Admin 1',
        timestamp: '2024-01-10 10:30',
        reason: 'Hồ sơ đầy đủ',
      },
    ],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-10',
  },
  {
    id: 2,
    fullName: 'Trần Thị F',
    email: 'tranthif@email.com',
    phone: '0912345678',
    gender: 'Nữ',
    address: 'TP Hồ Chí Minh',
    skills: 'Thiết kế UI/UX, Figma',
    clubId: 2,
    clubName: 'Câu lạc bộ Thiết kế Đồ họa',
    registrationReason: 'Muốn nâng cao kỹ năng thiết kế',
    status: 'Pending',
    actionHistory: [],
    createdAt: '2024-01-18',
  },
  {
    id: 3,
    fullName: 'Phạm Văn G',
    email: 'phamvang@email.com',
    phone: '0923456789',
    gender: 'Nam',
    address: 'Đà Nẵng',
    skills: 'Tiếng Anh giao tiếp',
    clubId: 3,
    clubName: 'Câu lạc bộ Tiếng Anh',
    registrationReason: 'Cải thiện kỹ năng nói tiếng Anh',
    status: 'Rejected',
    rejectionReason: 'Hồ sơ không đầy đủ',
    actionHistory: [
      {
        id: 2,
        action: 'Rejected',
        adminName: 'Admin 2',
        timestamp: '2024-01-12 14:15',
        reason: 'Hồ sơ không đầy đủ',
      },
    ],
    createdAt: '2024-01-09',
    updatedAt: '2024-01-12',
  },
  {
    id: 4,
    fullName: 'Lê H Minh',
    email: 'lehminh@email.com',
    phone: '0934567890',
    gender: 'Nam',
    address: 'Hà Nội',
    skills: 'React, TypeScript',
    clubId: 1,
    clubName: 'Câu lạc bộ Lập trình',
    registrationReason: 'Đam mê lập trình React',
    status: 'Pending',
    actionHistory: [],
    createdAt: '2024-01-19',
  },
];
