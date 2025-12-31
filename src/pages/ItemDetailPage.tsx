import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Typography, Button, Row, Col, Tag, Divider, message, Spin } from 'antd';
import { HeartOutlined, ShareAltOutlined, MessageOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { itemService } from '../services/itemService';
import { messageService } from '../services/messageService';
import { favoriteService } from '../services/favoriteService';
import { Item } from '../types';
import { RootState } from '../store';

const { Title, Paragraph, Text } = Typography;

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isFavorited, setIsFavorited] = useState(false);

  // 获取物品详情
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const { data: itemData, isLoading, error } = useQuery(
    ['item', id],
    () => itemService.getById(Number(id)),
    {
      onSuccess: (response) => {
        if (response.success && response.data && currentUser) {
          // 检查是否已收藏
          favoriteService.check(currentUser.id, Number(id)).then(favResponse => {
            if (favResponse.success) {
              setIsFavorited(favResponse.data.isFavorite);
            }
          });
        }
      },
    }
  );

  // 收藏/取消收藏
  const favoriteMutation = useMutation(
    () => {
      if (!currentUser) return Promise.reject('用户未登录');
      return isFavorited 
        ? favoriteService.remove(currentUser.id, Number(id)) 
        : favoriteService.add(currentUser.id, Number(id));
    },
    {
      onSuccess: (response) => {
        if (response.success) {
          setIsFavorited(!isFavorited);
          message.success(isFavorited ? '已取消收藏' : '已添加到收藏');
          // 更新物品的收藏数
          queryClient.invalidateQueries(['item', id]);
        } else {
          message.error(response.message || '操作失败');
        }
      },
      onError: () => {
        message.error('操作失败');
      },
    }
  );

  // 发送消息
  const sendMessageMutation = useMutation(
    (data: { receiverId: number; content: string; itemId?: number }) => 
      messageService.send(data),
    {
      onSuccess: (response) => {
        if (response.success) {
          message.success('消息发送成功');
        } else {
          message.error(response.message || '发送失败');
        }
      },
      onError: () => {
        message.error('发送失败');
      },
    }
  );

  const handleContactSeller = () => {
    const item = itemData?.data;
    if (!item) return;
    
    sendMessageMutation.mutate({
      receiverId: item.userId,
      content: `你好，我对"${item.title}"很感兴趣，请问还在线吗？`,
      itemId: item.id
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: itemData?.data?.title,
        text: itemData?.data?.description,
        url: window.location.href,
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      message.success('链接已复制到剪贴板');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>加载中...</Text>
        </div>
      </div>
    );
  }

  if (error || !itemData?.success) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>物品不存在</Title>
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      </div>
    );
  }

  const item: Item = itemData!.data;

  const getConditionText = (conditionType: number) => {
    const conditions = {
      1: '全新',
      2: '几乎全新',
      3: '轻微使用痕迹',
      4: '明显使用痕迹',
      5: '需要维修'
    };
    return conditions[conditionType as keyof typeof conditions] || '未知';
  };

  const getStatusText = (status: number) => {
    const statuses = {
      1: '待审核',
      2: '在售',
      3: '审核拒绝',
      4: '已下架'
    };
    return statuses[status as keyof typeof statuses] || '未知';
  };

  return (
    <div className="item-detail-page" style={{ padding: '24px' }}>
      <Row gutter={24}>
        {/* 左侧物品图片和信息 */}
        <Col xs={24} md={16}>
          <Card>
            {/* 图片展示 */}
            <div style={{ marginBottom: 24 }}>
              {item.images && item.images.length > 0 ? (
                <div>
                  <img
                    src={item.images[0].filePath}
                    alt={item.title}
                    style={{ 
                      width: '100%', 
                      maxHeight: 400, 
                      objectFit: 'cover',
                      borderRadius: 8 
                    }}
                  />
                  {item.images.length > 1 && (
                    <div style={{ marginTop: 8 }}>
                      {item.images.slice(1, 5).map((image, index) => (
                        <img
                          key={image.id}
                          src={image.filePath}
                          alt={`${item.title} ${index + 2}`}
                          style={{ 
                            width: 80, 
                            height: 80, 
                            objectFit: 'cover',
                            borderRadius: 4,
                            marginRight: 8 
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: 300, 
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8 
                }}>
                  <Text type="secondary">暂无图片</Text>
                </div>
              )}
            </div>

            {/* 物品信息 */}
            <div>
              <div style={{ marginBottom: 16 }}>
                <Title level={2}>{item.title}</Title>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Tag color="blue">{item.category?.name}</Tag>
                  <Tag color={item.status === 2 ? 'green' : 'orange'}>
                    {getStatusText(item.status)}
                  </Tag>
                  <Text type="secondary">
                    浏览 {item.viewCount} | 收藏 {item.favoriteCount}
                  </Text>
                </div>
              </div>

              <Divider />

              <div style={{ marginBottom: 16 }}>
                <Title level={4}>物品描述</Title>
                <Paragraph>{item.description || '暂无描述'}</Paragraph>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={4}>物品信息</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>成色：</Text>
                    <Text>{getConditionText(item.conditionType)}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>价格：</Text>
                    <Text>
                      {item.isFree ? (
                        <Text type="success" strong>免费</Text>
                      ) : (
                        `¥${item.price}`
                      )}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>原价：</Text>
                    <Text>¥{item.originalPrice}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>发布时间：</Text>
                    <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
                  </Col>
                  {item.location && (
                    <Col span={24}>
                      <Text strong>位置：</Text>
                      <Text>{item.location}</Text>
                    </Col>
                  )}
                  {item.contactMethod && (
                    <Col span={24}>
                      <Text strong>联系方式：</Text>
                      <Text>{item.contactMethod}</Text>
                    </Col>
                  )}
                </Row>
              </div>

              {item.tags && (
                <div style={{ marginBottom: 16 }}>
                  <Title level={4}>标签</Title>
                  <div>
                    {item.tags.split(',').map((tag, index) => (
                      <Tag key={index} style={{ marginBottom: 4 }}>
                        {tag.trim()}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* 右侧卖家信息和操作 */}
        <Col xs={24} md={8}>
          <Card style={{ position: 'sticky', top: 24 }}>
            {/* 价格信息 */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              {item.isFree ? (
                <Title level={1} type="success">免费</Title>
              ) : (
                <Title level={1}>¥{item.price}</Title>
              )}
              {item.originalPrice > 0 && item.originalPrice !== item.price && (
                <Text delete type="secondary">原价：¥{item.originalPrice}</Text>
              )}
            </div>

            <Divider />

            {/* 卖家信息 */}
            <div style={{ marginBottom: 24 }}>
              <Title level={4}>卖家信息</Title>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                {item.user?.avatar ? (
                  <img
                    src={item.user.avatar}
                    alt={item.user.nickname || item.user.username}
                    style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 12 }}
                  />
                ) : (
                  <UserOutlined style={{ fontSize: 40, color: '#d9d9d9', marginRight: 12 }} />
                )}
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {item.user?.nickname || item.user?.username}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    @{item.user?.username}
                  </Text>
                </div>
              </div>
            </div>

            <Divider />

            {/* 操作按钮 */}
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                size="large"
                block
                icon={<MessageOutlined />}
                onClick={handleContactSeller}
                loading={sendMessageMutation.isLoading}
                style={{ marginBottom: 12 }}
              >
                联系卖家
              </Button>

              <Button
                size="large"
                block
                icon={<HeartOutlined />}
                type={isFavorited ? 'primary' : 'default'}
                onClick={() => favoriteMutation.mutate()}
                loading={favoriteMutation.isLoading}
                style={{ marginBottom: 12 }}
              >
                {isFavorited ? '已收藏' : '收藏'}
              </Button>

              <Button
                size="large"
                block
                icon={<ShareAltOutlined />}
                onClick={handleShare}
              >
                分享
              </Button>
            </div>

            <Divider />

            {/* 安全保障 */}
            <div>
              <Title level={5}>安全保障</Title>
              <ul style={{ paddingLeft: 20, color: '#666' }}>
                <li>平台担保交易</li>
                <li>实名认证卖家</li>
                <li>7天无理由退款</li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 相关推荐 */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card>
            <Title level={3}>相关推荐</Title>
            <Paragraph type="secondary">正在加载相关物品...</Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ItemDetailPage;