import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import { useNavigate } from 'react-router-dom';

export default function ThemeRoutes() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.users);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const routes = useRoutes(isLoggedIn ? [MainRoutes] : [LoginRoutes]);
  return routes;
}
