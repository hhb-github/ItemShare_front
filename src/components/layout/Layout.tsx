import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
import { 
  HomeOutlined, 
  PlusOutlined, 
  UserOutlined, 
  MessageOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/userSlice';
import './Layout.css';

const { Header, Sider, Content } = Layout;

interface LayoutProps {
}

const AppLayout: React.FC<LayoutProps> = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">个人资料</Link>,
      icon: <UserOutlined />
    },
    {
      key: 'messages',
      label: <Link to="/messages">消息中心</Link>,
      icon: <MessageOutlined />
    },
    {
      key: 'settings',
      label: <Link to="/settings">设置</Link>,
      icon: <SettingOutlined />
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  const publicMenuItems = [
    {
      key: 'login',
      label: <Link to="/login">登录</Link>,
      icon: <LoginOutlined />
    },
    {
      key: 'register',
      label: <Link to="/register">注册</Link>
    }
  ];

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="logo">
          <Link to="/">
            <h2>物品分享</h2>
          </Link>
        </div>
        
        <Menu
          className="nav-menu"
          mode="horizontal"
          theme="dark"
          selectable={false}
          items={[
            {
              key: 'home',
              label: <Link to="/"><HomeOutlined /> 首页</Link>
            },
            ...(isAuthenticated ? [{
              key: 'create',
              label: <Link to="/create"><PlusOutlined /> 发布物品</Link>
            }] : [])
          ]}
        />

        <div className="user-actions">
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="user-info">
                <Avatar 
                  src={currentUser?.avatar} 
                  icon={<UserOutlined />} 
                  size="small"
                />
                <span className="username">{currentUser?.nickname || currentUser?.username}</span>
              </Space>
            </Dropdown>
          ) : (
            <Space>
              {publicMenuItems.map(item => (
                <Button
                  key={item.key}
                  type="link"
                  icon={item.icon}
                  onClick={() => window.location.href = item.label.props.to}
                >
                  {item.label.props.children}
                </Button>
              ))}
            </Space>
          )}
        </div>
      </Header>

      <Layout>
        <Sider 
          className="app-sider"
          width={200}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <Menu
            className="side-menu"
            mode="inline"
            defaultSelectedKeys={['home']}
            items={[
              {
                key: 'home',
                label: <Link to="/">首页</Link>,
                icon: <HomeOutlined />
              },
              {
                key: 'categories',
                label: '物品分类',
                icon: <SettingOutlined />,
                children: [
                  {
                    key: 'electronics',
                    label: '电子产品'
                  },
                  {
                    key: 'fashion',
                    label: '服装配饰'
                  },
                  {
                    key: 'home',
                    label: '家居用品'
                  },
                  {
                    key: 'books',
                    label: '书籍文具'
                  }
                ]
              }
            ]}
          />
        </Sider>

        <Layout>
          <Content className="app-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
