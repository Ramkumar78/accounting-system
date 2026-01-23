import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { Table, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

const JournalList = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [accounts, setAccounts] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        entryDate: new Date().toISOString().split('T')[0],
        description: '',
        reference: '',
        lines: [
            { accountId: '', debitAmount: '', creditAmount: '' },
            { accountId: '', debitAmount: '', creditAmount: '' }
        ]
    });

    const fetchEntries = async () => {
        try {
            const response = await axios.get('/journal');
            setEntries(response.data.content);
        } catch (error) {
            console.error("Error fetching entries", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAccounts = async () => {
        try {
            const response = await axios.get('/accounts');
            setAccounts(response.data);
        } catch (error) {
            console.error("Error fetching accounts", error);
        }
    };

    useEffect(() => {
        fetchEntries();
        fetchAccounts();
    }, []);

    const formatDate = (date) => {
        if (!date) return '';
        if (Array.isArray(date)) {
            return new Date(date[0], date[1] - 1, date[2]).toLocaleDateString();
        }
        return date;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLineChange = (index, field, value) => {
        const newLines = [...formData.lines];
        newLines[index][field] = value;
        setFormData({ ...formData, lines: newLines });
    };

    const addLine = () => {
        setFormData({
            ...formData,
            lines: [...formData.lines, { accountId: '', debitAmount: '', creditAmount: '' }]
        });
    };

    const removeLine = (index) => {
        if (formData.lines.length <= 2) return; // Keep at least 2 lines
        const newLines = formData.lines.filter((_, i) => i !== index);
        setFormData({ ...formData, lines: newLines });
    };

    const calculateTotals = () => {
        const totalDebit = formData.lines.reduce((sum, line) => sum + (parseFloat(line.debitAmount) || 0), 0);
        const totalCredit = formData.lines.reduce((sum, line) => sum + (parseFloat(line.creditAmount) || 0), 0);
        return { totalDebit, totalCredit };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { totalDebit, totalCredit } = calculateTotals();

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            alert(`Entries must balance! Difference: ${Math.abs(totalDebit - totalCredit).toFixed(2)}`);
            return;
        }

        try {
            await axios.post('/journal/save', formData);
            setShowModal(false);
            setFormData({
                entryDate: new Date().toISOString().split('T')[0],
                description: '',
                reference: '',
                lines: [
                    { accountId: '', debitAmount: '', creditAmount: '' },
                    { accountId: '', debitAmount: '', creditAmount: '' }
                ]
            });
            fetchEntries();
        } catch (error) {
            console.error("Error saving entry", error);
            alert("Failed to save entry");
        }
    };

    const { totalDebit, totalCredit } = calculateTotals();
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    return (
        <div className="netflix-container" style={{ paddingTop: '100px' }}>
             <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="netflix-header">Journal Entries</h2>
                 <button
                    className="netflix-btn d-flex align-items-center gap-2"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={20} /> New Entry
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="table-responsive">
                    <table className="netflix-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Entry #</th>
                                <th>Description</th>
                                <th>Reference</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(entry => (
                                <motion.tr
                                    key={entry.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <td>{formatDate(entry.entryDate)}</td>
                                    <td>{entry.entryNumber}</td>
                                    <td>{entry.description}</td>
                                    <td>{entry.reference}</td>
                                    <td>
                                        <Badge bg={entry.status === 'POSTED' ? 'success' : 'secondary'}>
                                            {entry.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        ${entry.lines ? entry.lines.reduce((sum, l) => sum + (l.debitAmount || 0), 0).toLocaleString() : '0.00'}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" contentClassName="bg-dark text-white">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>New Journal Entry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="entryDate"
                                        value={formData.entryDate}
                                        onChange={handleInputChange}
                                        required
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Reference</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reference"
                                        value={formData.reference}
                                        onChange={handleInputChange}
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-4">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="bg-secondary text-white border-0"
                            />
                        </Form.Group>

                        <h5 className="mb-3">Lines</h5>
                        {formData.lines.map((line, index) => (
                            <Row key={index} className="mb-2 align-items-center">
                                <Col md={5}>
                                    <Form.Select
                                        value={line.accountId}
                                        onChange={(e) => handleLineChange(index, 'accountId', e.target.value)}
                                        required
                                        className="bg-secondary text-white border-0"
                                    >
                                        <option value="">Select Account</option>
                                        {accounts.map(acc => (
                                            <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col md={3}>
                                    <Form.Control
                                        type="number"
                                        placeholder="Debit"
                                        step="0.01"
                                        value={line.debitAmount}
                                        onChange={(e) => handleLineChange(index, 'debitAmount', e.target.value)}
                                        className="bg-secondary text-white border-0"
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Control
                                        type="number"
                                        placeholder="Credit"
                                        step="0.01"
                                        value={line.creditAmount}
                                        onChange={(e) => handleLineChange(index, 'creditAmount', e.target.value)}
                                        className="bg-secondary text-white border-0"
                                    />
                                </Col>
                                <Col md={1}>
                                    <Button variant="link" className="text-danger p-0" onClick={() => removeLine(index)}>
                                        <Trash2 size={20} />
                                    </Button>
                                </Col>
                            </Row>
                        ))}

                        <Button variant="outline-light" size="sm" onClick={addLine} className="mb-3">
                            <Plus size={16} /> Add Line
                        </Button>

                        <div className="d-flex justify-content-between align-items-center border-top pt-3">
                            <div>
                                <span className={totalDebit !== totalCredit ? "text-danger" : "text-success"}>
                                    Total Debit: ${totalDebit.toFixed(2)} | Total Credit: ${totalCredit.toFixed(2)}
                                </span>
                            </div>
                            <Button
                                type="submit"
                                className="netflix-btn"
                                disabled={!isBalanced}
                            >
                                Save Entry
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default JournalList;
