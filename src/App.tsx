import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store, persistor } from './store';
import { useUserInitialization } from './hooks/useUserInitialization';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ItemDetailPage from './pages/ItemDetailPage';
import CreateItemPage from './pages/CreateItemPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import './App.css';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  useUserInitialization();
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="item/:id" element={<ItemDetailPage />} />
            <Route 
              path="create" 
              element={
                <ProtectedRoute>
                  <CreateItemPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="messages" 
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider locale={zhCN}>
            <AppContent />
          </ConfigProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
