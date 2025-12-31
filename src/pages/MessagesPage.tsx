import React, { useState } from 'react';
import { List, Input, Button, Card, Avatar, Typography, Empty } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  senderNickname: string;
  isRead: boolean;
}

const MessagesPage: React.FC = () => {
  const [messages] = useState<Message[]>([
    {
      id: 1,
      senderId: 2,
      receiverId: 1,
      content: '你好，我想了解一下这个物品的状态。',
      createdAt: '2025-12-30 10:30:00',
      senderNickname: '张三',
      isRead: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: 发送消息逻辑
      console.log('发送消息:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Title level={2}>消息中心</Title>
      
      <Card title="对话列表" style={{ marginBottom: 20 }}>
        {messages.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(message) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{message.senderNickname}</span>
                      {!message.isRead && (
                        <Text type="secondary">未读</Text>
                      )}
                    </div>
                  }
                  description={message.content}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无消息" />
        )}
      </Card>

      <Card title="发送消息">
        <div style={{ marginBottom: 16 }}>
          <TextArea
            rows={3}
            placeholder="输入要发送的消息..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </div>
        <Button 
          type="primary" 
          icon={<SendOutlined />} 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          发送
        </Button>
      </Card>
    </div>
  );
};

export default MessagesPage;