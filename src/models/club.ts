export interface Club {
  id: string | number;
  name: string;
  avatar?: string;
  foundedDate: string;
  description: string;
  director: string;
  isActive: boolean;
  memberCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const clubsData: Club[] = [
  {
    id: 1,
    name: 'Câu lạc bộ Lập trình',
    avatar: '',
    foundedDate: '2023-01-15',
    description: '<p>Câu lạc bộ dành cho những người yêu thích lập trình</p>',
    director: 'Nguyễn Văn A',
    isActive: true,
    memberCount: 45,
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    name: 'Câu lạc bộ Thiết kế Đồ họa',
    avatar: '',
    foundedDate: '2023-03-20',
    description: '<p>Nơi chia sẻ kinh nghiệm về thiết kế đồ họa</p>',
    director: 'Trần Thị B',
    isActive: true,
    memberCount: 32,
    createdAt: '2023-03-20',
  },
  {
    id: 3,
    name: 'Câu lạc bộ Tiếng Anh',
    avatar: '',
    foundedDate: '2023-02-10',
    description: '<p>Nâng cao kỹ năng tiếng Anh qua các hoạt động</p>',
    director: 'Phạm Văn C',
    isActive: true,
    memberCount: 28,
    createdAt: '2023-02-10',
  },
  {
    id: 4,
    name: 'Câu lạc bộ Thể thao',
    avatar: '',
    foundedDate: '2023-04-05',
    description: '<p>Tập luyện thể thao và phát triển sức khỏe</p>',
    director: 'Lê Văn D',
    isActive: false,
    memberCount: 0,
    createdAt: '2023-04-05',
  },
];
