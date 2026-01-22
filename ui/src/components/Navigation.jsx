import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Navigation = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
            navigate('/login');
        }
    };

    // Don't show nav on login page
    if (window.location.pathname === '/login') return null;

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Accounting System</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/accounts">Accounts</Nav.Link>
                        <Nav.Link as={Link} to="/invoices">Invoices</Nav.Link>
                        <Nav.Link as={Link} to="/journal">Journal</Nav.Link>
                        <Nav.Link as={Link} to="/ledger">Ledger</Nav.Link>
                        <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
                        <Nav.Link as={Link} to="/bank">Bank</Nav.Link>
                        <Nav.Link as={Link} to="/users">Users</Nav.Link>
                    </Nav>
                    <Nav>
                        <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
