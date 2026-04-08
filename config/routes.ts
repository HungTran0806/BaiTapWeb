export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	// {
  	// 	path: '/products',
	// 	name:'Sanpham',
  	// 	component: '@/pages/QuanLySanPham/Bai1',
	// },

	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	// TRAVEL PLANNING APP
	{
		name: 'Travel',
		path: '/travel',
		icon: 'GlobalOutlined',
		routes: [
			{
				path: '/travel',
				redirect: '/travel/home',
			},
			{
				path: '/travel/home',
				name: 'Khám phá điểm đến',
				component: './Travel/Home',
				icon: 'HomeOutlined',
			},
			{
				path: '/travel/itinerary',
				name: 'Tạo lịch trình',
				component: './Travel/Itinerary',
				icon: 'CalendarOutlined',
			},
			{
				path: '/travel/budget',
				name: 'Quản lý ngân sách',
				component: './Travel/Budget',
				icon: 'DollarOutlined',
			},
			{
				path: '/travel/admin',
				name: 'Quản lý điểm đến',
				component: './Travel/Admin',
				icon: 'SettingOutlined',
			},
			{
				path: '/travel/statistics',
				name: 'Thống kê',
				component: './Travel/Statistics',
				icon: 'BarChartOutlined',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
