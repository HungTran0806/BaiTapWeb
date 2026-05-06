import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Typography } from 'antd';
import {
	HomeOutlined,
	UserOutlined,
	SettingOutlined,
	FileTextOutlined,
	TagsOutlined,
	MenuOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import About from './pages/About';
import PostManagement from './pages/PostManagement';
import TagManagement from './pages/TagManagement';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const BlogLayout: React.FC = () => {
	const [collapsed, setCollapsed] = useState(false);
	const location = useLocation();

	const menuItems = [
		{
			key: '/blog',
			icon: <HomeOutlined />,
			label: <Link to='/blog'>Trang chủ</Link>,
		},
		{
			key: '/blog/about',
			icon: <UserOutlined />,
			label: <Link to='/blog/about'>Giới thiệu</Link>,
		},
		{
			key: '/blog/posts',
			icon: <FileTextOutlined />,
			label: <Link to='/blog/posts'>Quản lý bài viết</Link>,
		},
		{
			key: '/blog/tags',
			icon: <TagsOutlined />,
			label: <Link to='/blog/tags'>Quản lý thẻ</Link>,
		},
	];

	const renderContent = () => {
		const path = location.pathname;

		if (path === '/blog' || path === '/blog/') {
			return <Home />;
		} else if (path.startsWith('/blog/post/')) {
			const postSlug = path.replace('/blog/post/', '');
			return (
				<PostDetail
					postSlug={postSlug}
					onBack={() => window.history.back()}
					onPostClick={(post) => window.history.back()}
					onTagClick={(tagSlug) => {
						// Có thể thêm logic lọc theo tag nếu cần
						window.history.back();
					}}
				/>
			);
		} else if (path === '/blog/about') {
			return <About />;
		} else if (path === '/blog/posts') {
			return <PostManagement />;
		} else if (path === '/blog/tags') {
			return <TagManagement />;
		}

		return <Home />;
	};

	const getBreadcrumbItems = () => {
		const path = location.pathname;
		const items = [{ title: 'Blog' }];

		if (path === '/blog/about') {
			items.push({ title: 'Giới thiệu' });
		} else if (path === '/blog/posts') {
			items.push({ title: 'Quản lý bài viết' });
		} else if (path === '/blog/tags') {
			items.push({ title: 'Quản lý thẻ' });
		} else if (path.startsWith('/blog/post/')) {
			items.push({ title: 'Chi tiết bài viết' });
		}

		return items;
	};

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider
				collapsible
				collapsed={collapsed}
				onCollapse={setCollapsed}
				theme='light'
				style={{
					borderRight: '1px solid #f0f0f0',
				}}
			>
				<div
					style={{
						height: 64,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderBottom: '1px solid #f0f0f0',
					}}
				>
					<Title level={collapsed ? 4 : 3} style={{ margin: 0, color: '#1890ff' }}>
						{collapsed ? 'B' : 'Blog'}
					</Title>
				</div>

				<Menu mode='inline' selectedKeys={[location.pathname]} items={menuItems} style={{ borderRight: 0 }} />
			</Sider>

			<Layout>
				<Header
					style={{
						background: '#fff',
						padding: '0 24px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						borderBottom: '1px solid #f0f0f0',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<MenuOutlined
							style={{ fontSize: 18, marginRight: 16, cursor: 'pointer' }}
							onClick={() => setCollapsed(!collapsed)}
						/>
						<Breadcrumb>
							{getBreadcrumbItems().map((item, index) => (
								<Breadcrumb.Item key={item.title}>{item.title}</Breadcrumb.Item>
							))}
						</Breadcrumb>
					</div>

					<Dropdown
						overlay={
							<Menu
								onClick={({ key }) => {
									if (key === 'logout') {
										console.log('Logout');
									}
								}}
							>
								<Menu.Item key='profile' icon={<UserOutlined />}>
									Hồ sơ
								</Menu.Item>
								<Menu.Item key='settings' icon={<SettingOutlined />}>
									Cài đặt
								</Menu.Item>
								<Menu.Divider />
								<Menu.Item key='logout'>
									Đăng xuất
								</Menu.Item>
							</Menu>
						}
						placement='bottomRight'
					>
						<div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
							<Avatar style={{ backgroundColor: '#1890ff', marginRight: 8 }} icon={<UserOutlined />} />
							<span>Admin</span>
						</div>
					</Dropdown>
				</Header>

				<Content
					style={{
						margin: '24px 16px',
						padding: 24,
						background: '#fff',
						minHeight: 280,
					}}
				>
					{renderContent()}
				</Content>
			</Layout>
		</Layout>
	);
};

export default BlogLayout;
