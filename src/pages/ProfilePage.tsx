import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Tabs, Button, Row, Col, message } from 'antd';
import { UserOutlined, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { userService } from '../services/userService';
import { itemService } from '../services/itemService';
import { followService } from '../services/followService';
import ItemCard from '../components/items/ItemCard';
import { User, Item } from '../types';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('items');
  const [user, setUser] = useState<User | null>(null);

  // 获取当前用户信息
  const { data: profileData, isLoading: profileLoading } = useQuery(
    'profile',
    () => userService.getProfile(),
    {
      onSuccess: (response) => {
        if (response.success && response.data) {
          setUser(response.data);
        }
      },
      onError: () => {
        navigate('/login');
      },
    }
  );

  // 获取用户发布的物品
  const { data: itemsData, isLoading: itemsLoading } = useQuery(
    ['user-items', user?.id],
    () => itemService.getUserItems(user!.id, 0, 12),
    {
      enabled: !!user && activeTab === 'items',
    }
  );

  // 获取用户收藏的物品
  const { data: favoritesData, isLoading: favoritesLoading } = useQuery(
    ['user-favorites', user?.id],
    () => itemService.getUserFavorites(user!.id, 0, 12),
    {
      enabled: !!user && activeTab === 'favorites',
    }
  );

  // 获取用户关注/粉丝数据
  const { data: followStats } = useQuery(
    ['follow-stats', user?.id],
    () => followService.getStats(user!.id),
    {
      enabled: !!user,
    }
  );

  useEffect(() => {
    if (!profileLoading && (!profileData || !profileData.success)) {
      navigate('/login');
    }
  }, [profileData, profileLoading, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('已退出登录');
    navigate('/login');
  };

  if (profileLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>加载中...</Title>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page" style={{ padding: '24px' }}>
      <Row gutter={24}>
        {/* 左侧个人信息 */}
        <Col xs={24} md={8} lg={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 16 }}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.nickname || user.username}
                    style={{ width: 100, height: 100, borderRadius: '50%' }}
                  />
                ) : (
                  <UserOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                )}
              </div>
              <Title level={3}>{user.nickname || user.username}</Title>
              <Paragraph type="secondary">@{user.username}</Paragraph>
              {user.bio && (
                <Paragraph style={{ marginBottom: 16 }}>
                  {user.bio}
                </Paragraph>
              )}
              <div style={{ marginBottom: 16 }}>
                <span>关注: {followStats?.data?.followingCount || 0}</span>
                <span style={{ marginLeft: 16 }}>
                  粉丝: {followStats?.data?.followersCount || 0}
                </span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span>物品: {itemsData?.data?.totalElements || 0}</span>
                <span style={{ marginLeft: 16 }}>
                  收藏: {favoritesData?.data?.totalElements || 0}
                </span>
              </div>
              <Button type="primary" block onClick={() => navigate('/profile/edit')}>
                编辑资料
              </Button>
              <Button style={{ marginTop: 8 }} block onClick={handleLogout}>
                退出登录
              </Button>
            </div>
          </Card>
        </Col>

        {/* 右侧内容区域 */}
        <Col xs={24} md={16} lg={18}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane
                tab={
                  <span>
                    <ShoppingCartOutlined />
                    我的物品
                  </span>
                }
                key="items"
              >
                <Row gutter={[16, 16]}>
                  {itemsLoading ? (
                    <div style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
                      加载中...
                    </div>
                  ) : itemsData?.data?.content?.length ? (
                    itemsData.data.content.map((item: Item) => (
                      <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                        <ItemCard item={item} />
                      </Col>
                    ))
                  ) : (
                    <div style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                      <ShoppingCartOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                      <Paragraph type="secondary">还没有发布任何物品</Paragraph>
                      <Button type="primary" onClick={() => navigate('/create')}>
                        发布第一个物品
                      </Button>
                    </div>
                  )}
                </Row>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <HeartOutlined />
                    我的收藏
                  </span>
                }
                key="favorites"
              >
                <Row gutter={[16, 16]}>
                  {favoritesLoading ? (
                    <div style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
                      加载中...
                    </div>
                  ) : favoritesData?.data?.content?.length ? (
                    favoritesData.data.content.map((item: Item) => (
                      <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                        <ItemCard item={item} />
                      </Col>
                    ))
                  ) : (
                    <div style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                      <HeartOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                      <Paragraph type="secondary">还没有收藏任何物品</Paragraph>
                      <Button type="primary" onClick={() => navigate('/')}>
                        去发现好物品
                      </Button>
                    </div>
                  )}
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;