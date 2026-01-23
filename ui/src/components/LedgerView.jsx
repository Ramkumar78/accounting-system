import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

const LedgerView = () => {
    const [accounts, setAccounts] = useState([]);
    const [filters, setFilters] = useState({
        accountId: '',
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Jan 1st
        endDate: new Date().toISOString().split('T')[0]
    });
    const [ledgerData, setLedgerData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
             try {
                const res = await axios.get('/accounts');
                setAccounts(res.data);
                if (res.data.length > 0) {
                    setFilters(prev => ({ ...prev, accountId: res.data[0].id }));
                }
             } catch (e) {
                 console.error(e);
             }
        };
        fetchAccounts();
    }, []);

    const fetchLedger = async () => {
        if (!filters.accountId) return;
        setLoading(true);
        try {
            const res = await axios.get(`/ledger/view/${filters.accountId}`, {
                params: { startDate: filters.startDate, endDate: filters.endDate }
            });
            setLedgerData(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filters.accountId) {
            fetchLedger();
        }
    }, [filters.accountId]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="netflix-container" style={{ paddingTop: '100px' }}>
            <h2 className="netflix-header mb-4">General Ledger</h2>

            <div className="netflix-card p-4 mb-4">
                <Form>
                    <Row className="align-items-end">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Account</Form.Label>
                                <Form.Select
                                    name="accountId"
                                    value={filters.accountId}
                                    onChange={handleFilterChange}
                                    className="bg-secondary text-white border-0"
                                >
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                    className="bg-secondary text-white border-0"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                    className="bg-secondary text-white border-0"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Button className="netflix-btn w-100" onClick={fetchLedger}>
                                View Ledger
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>

            {loading && <p>Loading...</p>}

            {!loading && ledgerData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="d-flex justify-content-between mb-3 text-muted">
                        <h4>{ledgerData.accountCode} - {ledgerData.accountName}</h4>
                        <div>
                            <span className="me-3">Opening: ${ledgerData.openingBalance?.toLocaleString()}</span>
                            <span className="text-white fw-bold">Closing: ${ledgerData.closingBalance?.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="netflix-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Ref</th>
                                    <th>Description</th>
                                    <th className="text-end">Debit</th>
                                    <th className="text-end">Credit</th>
                                    <th className="text-end">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledgerData.entries.map((entry, idx) => (
                                    <tr key={idx}>
                                        <td>{new Date(entry.entryDate || entry.date).toLocaleDateString()}</td>
                                        <td>{entry.reference}</td>
                                        <td>{entry.description}</td>
                                        <td className="text-end">{entry.debitAmount ? `$${entry.debitAmount.toLocaleString()}` : '-'}</td>
                                        <td className="text-end">{entry.creditAmount ? `$${entry.creditAmount.toLocaleString()}` : '-'}</td>
                                        <td className="text-end fw-bold">${entry.runningBalance?.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {ledgerData.entries.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center">No transactions found for this period.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default LedgerView;
