import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { itemService } from '../services/itemService';
import { ItemCreateRequest } from '../types';

const { TextArea } = Input;
const { Option } = Select;

interface CreateItemFormData {
  title: string;
  description: string;
  categoryId: string;
  conditionType: string;
  price?: number;
}

const CreateItemPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  // 获取当前用户信息
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  
  // 如果用户未登录，跳转到登录页面
   useEffect(() => {
     if (!isAuthenticated) {
       message.warning('请先登录后再发布物品');
       navigate('/login');
     }
   }, [isAuthenticated, navigate]);
  
  const createItemMutation = useMutation(
    (data: ItemCreateRequest) => {
      console.log('开始创建物品:', data);
      return itemService.create(data);
    },
    {
      onSuccess: (response) => {
        console.log('API响应成功:', response);
        if (response && response.success) {
          message.success('物品发布成功！');
          navigate('/');
        } else {
          console.error('API响应失败:', response);
          message.error(response?.message || '发布失败，请重试');
        }
      },
      onError: (error: any) => {
        console.error('创建物品失败:', error);
        message.error(error?.response?.data?.message || '发布失败，请重试');
      },
    }
  );

  const loading = createItemMutation.isLoading;

  const categories = [
    '电子产品',
    '服装配饰',
    '家居用品',
    '图书文具',
    '运动器材',
    '其他'
  ];

  const conditions = [
    '全新',
    '九成新',
    '八成新',
    '七成新',
    '六成新',
    '五成新及以下'
  ];

  const onFinish = async (values: CreateItemFormData) => {
    // 检查用户是否已登录
    if (!currentUser?.id) {
      message.error('用户未登录，请先登录');
      navigate('/login');
      return;
    }

    // 将类别名称映射为ID
    const categoryMap: { [key: string]: number } = {
      '电子产品': 1,
      '服装配饰': 2,
      '家居用品': 3,
      '图书文具': 4,
      '运动器材': 5,
      '其他': 6
    };

    // 将条件字符串映射为枚举值
    const conditionMap: { [key: string]: number } = {
      '全新': 1,
      '九成新': 2,
      '八成新': 3,
      '七成新': 4,
      '六成新': 5,
      '五成新及以下': 6
    };

    const itemData: ItemCreateRequest = {
      title: values.title,
      description: values.description,
      categoryId: categoryMap[values.categoryId] || 6, // 默认使用"其他"分类
      conditionType: conditionMap[values.conditionType] || 2, // 默认使用"九成新"
      price: values.price || 0,
      originalPrice: values.price || 0,
      isFree: values.price ? 0 : 1, // 如果没有价格则为免费
      userId: currentUser.id
    };
    
    createItemMutation.mutate(itemData);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <h2>发布物品</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          categoryId: '其他',
          conditionType: '九成新'
        }}
      >
        <Form.Item
          label="物品标题"
          name="title"
          rules={[{ required: true, message: '请输入物品标题' }]}
        >
          <Input placeholder="请输入物品标题" />
        </Form.Item>

        <Form.Item
          label="物品描述"
          name="description"
          rules={[{ required: true, message: '请输入物品描述' }]}
        >
          <TextArea
            rows={4}
            placeholder="请详细描述物品的状态、特点等信息"
          />
        </Form.Item>

        <Form.Item
          label="物品分类"
          name="categoryId"
          rules={[{ required: true, message: '请选择物品分类' }]}
        >
          <Select placeholder="请选择物品分类">
            {categories.map(category => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="新旧程度"
          name="conditionType"
          rules={[{ required: true, message: '请选择新旧程度' }]}
        >
          <Select placeholder="请选择新旧程度">
            {conditions.map(condition => (
              <Option key={condition} value={condition}>
                {condition}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="期望价格（元）"
          name="price"
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="可留空表示免费赠送"
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item label="物品图片">
          <Upload
            action="/api/upload"
            listType="picture-card"
            multiple
            beforeUpload={() => false}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            发布物品
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateItemPage;