import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, notification } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import * as dashboardService from '../services/dashboardService';

const { Title } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const DashboardPage: React.FC = () => {
  const [statusData, setStatusData] = useState<dashboardService.StatusDistributionData[]>([]);
  const [burndownData, setBurndownData] = useState<dashboardService.BurndownData | null>(null);
  const [loading, setLoading] = useState(true);
  const projectId = 1; // Hardcoded for now

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statusRes, burndownRes] = await Promise.all([
          dashboardService.getStatusDistribution(projectId),
          dashboardService.getBurndownData(projectId),
        ]);
        setStatusData(statusRes);
        setBurndownData(burndownRes);
      } catch (error) {
        notification.error({ message: 'Failed to load dashboard data' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const burndownChartData = burndownData ? [
    { name: 'Remaining', effort: burndownData.remainingEffort },
    { name: 'Completed', effort: burndownData.completedEffort },
  ] : [];

  return (
    <div>
      <Title level={2}>Project Dashboard</Title>
      {loading ? (
        <Spin size="large" style={{ display: 'block', marginTop: 50 }} />
      ) : (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Card title="Work Item Status">
              <PieChart width={400} height={300}>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="statusName"
                  label={(props) => `${props.statusName}: ${props.count}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Effort Burndown (Simplified)">
                <BarChart
                    width={400}
                    height={300}
                    data={burndownChartData}
                    layout="vertical"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Bar dataKey="effort" fill="#82ca9d" barSize={40}>
                         {burndownChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 1 ? '#00C49F' : '#FF8042'} />
                        ))}
                    </Bar>
                </BarChart>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DashboardPage;
