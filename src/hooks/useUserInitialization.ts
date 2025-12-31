import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeUser } from '../store/slices/userSlice';

export const useUserInitialization = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 在组件挂载时初始化用户状态
    dispatch(initializeUser());
  }, [dispatch]);
};
