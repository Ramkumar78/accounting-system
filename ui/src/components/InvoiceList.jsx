import React, { useEffect, useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import api from '../api/axiosConfig';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Invoices</h2>
        <Button variant="primary">Create Invoice</Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Invoice #</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.invoiceDate}</td>
              <td>{invoice.invoiceNumber}</td>
              <td>{invoice.customer ? invoice.customer.name : '-'}</td>
              <td>{invoice.totalAmount}</td>
              <td>
                <Badge bg={
                    invoice.status === 'PAID' ? 'success' :
                    invoice.status === 'DRAFT' ? 'secondary' :
                    invoice.status === 'SENT' ? 'primary' : 'warning'
                }>
                    {invoice.status}
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

export default InvoiceList;
