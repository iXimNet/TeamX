import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <p>Welcome to Zenith. Project overview will be displayed here.</p>
    </div>
  );
};

export default DashboardPage;
