import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { Folder, Plus } from 'lucide-react';
import { Modal, Button, Form } from 'react-bootstrap';

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        accountType: 'ASSET',
        description: ''
    });

    const fetchAccounts = async () => {
        try {
            const response = await axios.get('/accounts');
            setAccounts(response.data);
        } catch (error) {
            console.error("Error fetching accounts", error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/accounts/save', formData);
            setShowModal(false);
            setFormData({ code: '', name: '', accountType: 'ASSET', description: '' });
            fetchAccounts();
        } catch (error) {
            console.error("Error creating account", error);
            alert("Failed to create account. Please check the code is unique.");
        }
    };

    return (
        <div className="netflix-container" style={{ paddingTop: '100px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="netflix-header">Chart of Accounts</h2>
                <button
                    className="netflix-btn d-flex align-items-center gap-2"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={20} /> Add Account
                </button>
            </div>

            <div className="row g-4">
                {accounts.map((account, index) => (
                    <div className="col-12 col-md-6 col-lg-4" key={account.id}>
                        <motion.div
                            className="netflix-card p-4 h-100 d-flex flex-column justify-content-between"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="badge bg-secondary">{account.code}</span>
                                    <span style={{
                                        color: account.type === 'ASSET' || account.type === 'EXPENSE' ? '#46d369' : '#e50914',
                                        fontWeight: 'bold'
                                    }}>
                                        {account.type}
                                    </span>
                                </div>
                                <h3>{account.name}</h3>
                            </div>

                            <div className="mt-4 pt-3 border-top border-secondary">
                                <span className="text-muted small">Current Balance</span>
                                <h4 className="mt-1">${(account.balance || 0).toLocaleString()}</h4>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} contentClassName="bg-dark text-white">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Add New Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Account Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                                className="bg-secondary text-white border-0"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Account Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="bg-secondary text-white border-0"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Account Type</Form.Label>
                            <Form.Select
                                name="accountType"
                                value={formData.accountType}
                                onChange={handleInputChange}
                                className="bg-secondary text-white border-0"
                            >
                                <option value="ASSET">Asset</option>
                                <option value="LIABILITY">Liability</option>
                                <option value="EQUITY">Equity</option>
                                <option value="REVENUE">Revenue</option>
                                <option value="EXPENSE">Expense</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="bg-secondary text-white border-0"
                            />
                        </Form.Group>
                        <Button variant="danger" type="submit" className="w-100 netflix-btn">
                            Save Account
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AccountList;
