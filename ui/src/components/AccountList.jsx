import React, { useEffect, useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import api from '../api/axiosConfig';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Chart of Accounts</h2>
        <Button variant="primary">Add Account</Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Type</th>
            <th>Currency</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.code}</td>
              <td>{account.name}</td>
              <td>{account.accountType}</td>
              <td>{account.currency ? account.currency.code : '-'}</td>
              <td>
                <Badge bg={account.isActive ? 'success' : 'secondary'}>
                    {account.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2">Edit</Button>
                <Button variant="outline-info" size="sm">View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AccountList;
