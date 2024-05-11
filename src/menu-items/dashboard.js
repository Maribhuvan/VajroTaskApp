import { DashboardOutlined, ProfileOutlined } from '@ant-design/icons';

const icons = {
  DashboardOutlined,
  ProfileOutlined
};

const dashboard = {
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined
    },
    {
      id: 'register1',
      title: 'Tasks',
      type: 'item',
      url: '/tasks',
      icon: icons.ProfileOutlined
    }
  ]
};

export default dashboard;
