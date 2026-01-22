import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table } from 'react-bootstrap';
import api from '../api/axiosConfig';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/api/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard', error);
      }
    };
    fetchDashboard();
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-white bg-primary mb-3">
            <Card.Header>Total Assets</Card.Header>
            <Card.Body>
              <Card.Title>{dashboardData.totalAssets}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-danger mb-3">
            <Card.Header>Total Liabilities</Card.Header>
            <Card.Body>
              <Card.Title>{dashboardData.totalLiabilities}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-success mb-3">
            <Card.Header>Total Revenue</Card.Header>
            <Card.Body>
              <Card.Title>{dashboardData.totalRevenue}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-warning mb-3">
            <Card.Header>Total Expenses</Card.Header>
            <Card.Body>
              <Card.Title>{dashboardData.totalExpenses}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
            <Card>
                <Card.Header>Recent Transactions</Card.Header>
                <Card.Body>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.recentTransactions && dashboardData.recentTransactions.map((tx, idx) => (
                                <tr key={idx}>
                                    <td>{tx.date}</td>
                                    <td>{tx.description}</td>
                                    <td>{tx.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
