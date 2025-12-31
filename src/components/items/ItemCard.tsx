import React from 'react';
import { Card, Typography, Tag, Button } from 'antd';
import { HeartOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { Item } from '../../types';

const { Text, Paragraph } = Typography;

interface ItemCardProps {
  item: Item;
  showFavorite?: boolean;
  onFavorite?: (itemId: number) => void;
  showOwner?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  showFavorite = true, 
  onFavorite,
  showOwner = true 
}) => {
  const formatPrice = (price: number, isFree: number) => {
    if (isFree === 1) return '免费';
    return `¥${price}`;
  };

  const formatCondition = (conditionType: number) => {
    const conditions = {
      1: '全新',
      2: '九成新',
      3: '八成新',
      4: '七成新',
      5: '六成新及以下'
    };
    return conditions[conditionType as keyof typeof conditions] || '未知';
  };

  return (
    <Card
      hoverable
      cover={
        <div style={{ 
          height: 200, 
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {item.images && item.images.length > 0 ? (
            <img
              alt={item.title}
              src={item.images[0].filePath}
              style={{ 
                maxHeight: '100%', 
                maxWidth: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <UserOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
          )}
        </div>
      }
      actions={showFavorite && onFavorite ? [
        <Button 
          type="text" 
          icon={<HeartOutlined />} 
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(item.id);
          }}
        >
          收藏
        </Button>
      ] : []}
    >
      <Card.Meta
        title={
          <div>
            <Text strong ellipsis style={{ width: '100%' }}>
              {item.title}
            </Text>
            <div style={{ marginTop: 4 }}>
              <Tag color={item.isFree === 1 ? 'green' : 'blue'}>
                {formatPrice(item.price, item.isFree)}
              </Tag>
              <Tag>
                {formatCondition(item.conditionType)}
              </Tag>
            </div>
          </div>
        }
        description={
          <div>
            <Paragraph 
              ellipsis={{ rows: 2 }} 
              style={{ marginBottom: 8, fontSize: 12 }}
            >
              {item.description || '暂无描述'}
            </Paragraph>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontSize: 12,
              color: '#999'
            }}>
              <div>
                <EyeOutlined /> {item.viewCount}
                <span style={{ marginLeft: 8 }}>
                  {item.favoriteCount} 收藏
                </span>
              </div>
              {showOwner && item.user && (
                <div>
                  {item.user.nickname || item.user.username}
                </div>
              )}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ItemCard;