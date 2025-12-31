import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Input, 
  Button, 
  Select, 
  Slider, 
  Checkbox, 
  Pagination, 
  Spin,
  message,
  Empty
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  HeartOutlined, 
  ShoppingCartOutlined,
  FilterOutlined 
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { itemService } from '../services/itemService';
import { categoryService } from '../services/categoryService';
import { favoriteService } from '../services/favoriteService';
import ItemCard from '../components/items/ItemCard';
import { Item, Category } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [isFreeOnly, setIsFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [showFilters, setShowFilters] = useState(false);

  // 获取当前登录用户
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const queryClient = useQueryClient();

  // 获取物品列表
  const { data: itemsData, isLoading: itemsLoading, refetch } = useQuery(
    ['items', currentPage, searchKeyword, selectedCategory, priceRange, isFreeOnly, sortBy],
    () => {
      const params = {
        page: currentPage - 1,
        size: 12,
        keyword: searchKeyword || undefined,
        categoryId: selectedCategory || undefined,
        minPrice: isFreeOnly ? 0 : priceRange[0],
        maxPrice: isFreeOnly ? 0 : priceRange[1],
        sortBy,
        isFree: isFreeOnly ? 1 : undefined,
      };
      return itemService.search(params);
    }
  );

  // 获取分类列表
  const { data: categoriesData } = useQuery(
    'categories',
    () => categoryService.getAll()
  );

  // 收藏物品的mutation
  const favoriteMutation = useMutation(
    ({ itemId, isFavorite }: { itemId: number; isFavorite: boolean }) => {
      if (!currentUser) {
        message.error('请先登录');
        return Promise.reject(new Error('用户未登录'));
      }
      
      if (isFavorite) {
        return favoriteService.remove(currentUser.id, itemId);
      } else {
        return favoriteService.add(currentUser.id, itemId);
      }
    },
    {
      onSuccess: (data, variables) => {
        if (data?.success) {
          // 刷新收藏状态
          queryClient.invalidateQueries('favorites');
          
          // 更新物品数据中的收藏状态
          if (itemsData?.data?.content) {
            const updatedItems = itemsData.data.content.map(item => {
              if (item.id === variables.itemId) {
                return {
                  ...item,
                  favoriteCount: variables.isFavorite ? 
                    item.favoriteCount - 1 : 
                    item.favoriteCount + 1
                };
              }
              return item;
            });
            
            // 更新缓存
            queryClient.setQueryData(['items', currentPage, searchKeyword, selectedCategory, priceRange, isFreeOnly, sortBy], {
              ...itemsData,
              data: {
                ...itemsData.data,
                content: updatedItems
              }
            });
          }
          
          message.success(variables.isFavorite ? '已取消收藏' : '收藏成功');
        } else {
          message.error(data?.message || '操作失败');
        }
      },
      onError: (error) => {
        console.error('收藏操作失败:', error);
        message.error('收藏操作失败，请重试');
      }
    }
  );

  // 处理收藏操作
  const handleFavorite = (itemId: number, isFavorite: boolean) => {
    favoriteMutation.mutate({ itemId, isFavorite });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedCategory(null);
    setPriceRange([0, 10000]);
    setIsFreeOnly(false);
    setSortBy('createdAt');
    setCurrentPage(1);
    setTimeout(() => refetch(), 100);
  };

  const items = itemsData?.data?.content || [];
  const totalItems = itemsData?.data?.totalElements || 0;
  const categories = categoriesData?.data || [];

  return (
    <div className="home-page" style={{ padding: '24px' }}>
      {/* 顶部导航栏 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>物品分享</Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            发现身边的闲置好物
          </Paragraph>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/create')}
          >
            发布物品
          </Button>
        </Col>
      </Row>

      {/* 搜索和筛选区域 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              placeholder="搜索物品..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              size="large"
            />
          </Col>
          
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="分类"
              value={selectedCategory || undefined}
              onChange={setSelectedCategory}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value={null}>全部分类</Option>
              {categories.map((category: Category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="createdAt">最新发布</Option>
              <Option value="price">价格排序</Option>
              <Option value="favoriteCount">热门收藏</Option>
              <Option value="viewCount">浏览量</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Row gutter={8}>
              <Col flex="auto">
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? '收起筛选' : '展开筛选'}
                </Button>
              </Col>
              <Col>
                <Button onClick={handleResetFilters}>
                  重置
                </Button>
              </Col>
              <Col>
                <Button type="primary" onClick={handleSearch}>
                  搜索
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* 高级筛选 */}
        {showFilters && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>价格范围：</Text>
                  <Slider
                    range
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onChange={(value) => setPriceRange(value as [number, number])}
                    style={{ marginTop: 8 }}
                    marks={{
                      0: '¥0',
                      2500: '¥2.5k',
                      5000: '¥5k',
                      7500: '¥7.5k',
                      10000: '¥10k+'
                    }}
                  />
                  <div style={{ textAlign: 'center' }}>
                    <Text>¥{priceRange[0]} - ¥{priceRange[1]}</Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>特殊筛选：</Text>
                  <div style={{ marginTop: 8 }}>
                    <Checkbox
                      checked={isFreeOnly}
                      onChange={(e) => setIsFreeOnly(e.target.checked)}
                    >
                      只显示免费物品
                    </Checkbox>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* 物品列表 */}
      <div className="items-section">
        {itemsLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text>加载中...</Text>
            </div>
          </div>
        ) : items.length > 0 ? (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              {items.map((item: Item) => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                  <ItemCard item={item} />
                </Col>
              ))}
            </Row>

            {/* 分页 */}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Pagination
                current={currentPage}
                total={totalItems}
                pageSize={12}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => 
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                }
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        ) : (
          <Empty
            description="暂无相关物品"
            style={{ padding: '50px 0' }}
          >
            <Button type="primary" onClick={() => navigate('/create')}>
              发布第一个物品
            </Button>
          </Empty>
        )}
      </div>

      {/* 底部提示 */}
      <Card style={{ marginTop: 24, textAlign: 'center' }}>
        <Paragraph type="secondary">
          没有找到合适的物品？
          <Link to="/create" style={{ marginLeft: 8 }}>
            立即发布
          </Link>
          或者
          <Button type="link" style={{ padding: 0, marginLeft: 8 }} onClick={() => setShowFilters(!showFilters)}>
            调整筛选条件
          </Button>
        </Paragraph>
      </Card>
    </div>
  );
};

export default HomePage;