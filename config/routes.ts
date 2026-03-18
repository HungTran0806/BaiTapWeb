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
	{
		path: '/bookingmanager',
		name: 'Bookingmanager',
		component: '@/pages/TH03/App',
		
	},
	// {
	// 	path: '/minigame',
	// 	name: 'Minigame',
	// 	component: '@/pages/TH01/Bai1',
	// 	icon: 'BugOutlined'
		
	// },
	// {
	// 	path: '/studytracker',
	// 	name: 'StudyTracker',
	// 	component: '@/pages/TH01/Bai2',
	// 	icon: 'BugOutlined'
		
	// },
	// {
	// 	path: '/quan-ly-san-pham',
	// 	name: 'Quản lý sản phẩm',
	// 	component: '@/pages/QuanLySanPham/Bai2',
	// },
	// {
	// 	path: '/quan-ly-don-hang',
	// 	name: 'Quản lý Đơn hàng',
	// 	component: '@/pages/QuanLyDonHang/Bai2',
	// },
	// {
	// 	path: '/bai-tap',
	// 	name: 'Bài tập',
	// 	component: '@/pages/BaiTap02/BaiTap',
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
