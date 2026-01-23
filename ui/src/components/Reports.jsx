import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { Tabs, Tab, Form, Button, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('trial-balance');
    const [dates, setDates] = useState({
        asOfDate: new Date().toISOString().split('T')[0],
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        setLoading(true);
        setReportData(null);
        try {
            let url = '';
            let params = {};
            if (activeTab === 'trial-balance') {
                url = '/reports/trial-balance';
                params = { asOfDate: dates.asOfDate };
            } else if (activeTab === 'profit-loss') {
                url = '/reports/profit-loss';
                params = { startDate: dates.startDate, endDate: dates.endDate };
            } else if (activeTab === 'balance-sheet') {
                url = '/reports/balance-sheet';
                params = { asOfDate: dates.asOfDate };
            }

            const res = await axios.get(url, { params });
            setReportData(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [activeTab]);

    const handleDateChange = (e) => {
        setDates({ ...dates, [e.target.name]: e.target.value });
    };

    const RenderTrialBalance = ({ data }) => (
        <div className="table-responsive">
            <h3 className="text-center mb-4">Trial Balance</h3>
            <p className="text-center text-muted">As of {data.asOfDate}</p>
            <table className="netflix-table">
                <thead>
                    <tr>
                        <th>Account</th>
                        <th className="text-end">Debit</th>
                        <th className="text-end">Credit</th>
                    </tr>
                </thead>
                <tbody>
                    {data.lines.map((line, idx) => (
                        <tr key={idx}>
                            <td>{line.accountCode} - {line.accountName}</td>
                            <td className="text-end">{line.debitBalance > 0 ? `$${line.debitBalance.toLocaleString()}` : ''}</td>
                            <td className="text-end">{line.creditBalance > 0 ? `$${line.creditBalance.toLocaleString()}` : ''}</td>
                        </tr>
                    ))}
                    <tr className="fw-bold border-top border-white">
                        <td>Total</td>
                        <td className="text-end">${data.totalDebit.toLocaleString()}</td>
                        <td className="text-end">${data.totalCredit.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

    const RenderProfitLoss = ({ data }) => (
        <div className="table-responsive">
            <h3 className="text-center mb-4">Profit & Loss Statement</h3>
            <p className="text-center text-muted">{data.startDate} to {data.endDate}</p>

            <h5 className="mt-4 text-success">Revenue</h5>
            <table className="netflix-table">
                <tbody>
                    {data.revenueAccounts.map((acc, idx) => (
                        <tr key={idx}>
                            <td>{acc.accountCode} - {acc.accountName}</td>
                            <td className="text-end">${acc.balance.toLocaleString()}</td>
                        </tr>
                    ))}
                    <tr className="fw-bold">
                        <td>Total Revenue</td>
                        <td className="text-end">${data.totalRevenue.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>

            <h5 className="mt-4 text-danger">Expenses</h5>
            <table className="netflix-table">
                <tbody>
                    {data.expenseAccounts.map((acc, idx) => (
                        <tr key={idx}>
                            <td>{acc.accountCode} - {acc.accountName}</td>
                            <td className="text-end">${acc.balance.toLocaleString()}</td>
                        </tr>
                    ))}
                    <tr className="fw-bold">
                        <td>Total Expenses</td>
                        <td className="text-end">${data.totalExpenses.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-4 p-3 bg-dark border border-secondary text-center">
                <h3>Net Income: <span style={{ color: data.netIncome >= 0 ? '#46d369' : '#e50914' }}>${data.netIncome.toLocaleString()}</span></h3>
            </div>
        </div>
    );

    const RenderBalanceSheet = ({ data }) => (
        <div className="table-responsive">
             <h3 className="text-center mb-4">Balance Sheet</h3>
             <p className="text-center text-muted">As of {data.asOfDate}</p>

             <div className="row">
                <div className="col-md-6">
                    <h5 className="mt-3 text-success">Assets</h5>
                    <table className="netflix-table">
                        <tbody>
                            {data.assetAccounts.map((acc, idx) => (
                                <tr key={idx}>
                                    <td>{acc.accountCode} - {acc.accountName}</td>
                                    <td className="text-end">${acc.balance.toLocaleString()}</td>
                                </tr>
                            ))}
                            <tr className="fw-bold border-top">
                                <td>Total Assets</td>
                                <td className="text-end">${data.totalAssets.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6">
                    <h5 className="mt-3 text-danger">Liabilities</h5>
                    <table className="netflix-table">
                        <tbody>
                            {data.liabilityAccounts.map((acc, idx) => (
                                <tr key={idx}>
                                    <td>{acc.accountCode} - {acc.accountName}</td>
                                    <td className="text-end">${acc.balance.toLocaleString()}</td>
                                </tr>
                            ))}
                            <tr className="fw-bold border-top">
                                <td>Total Liabilities</td>
                                <td className="text-end">${data.totalLiabilities.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h5 className="mt-4 text-info">Equity</h5>
                    <table className="netflix-table">
                        <tbody>
                            {data.equityAccounts.map((acc, idx) => (
                                <tr key={idx}>
                                    <td>{acc.accountCode} - {acc.accountName}</td>
                                    <td className="text-end">${acc.balance.toLocaleString()}</td>
                                </tr>
                            ))}
                             <tr>
                                <td>Retained Earnings</td>
                                <td className="text-end">${data.retainedEarnings.toLocaleString()}</td>
                            </tr>
                            <tr className="fw-bold border-top">
                                <td>Total Equity</td>
                                <td className="text-end">${(data.totalEquity + data.retainedEarnings).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                     <div className="mt-3 p-2 bg-secondary text-white fw-bold d-flex justify-content-between">
                        <span>Total Liabilities & Equity</span>
                        <span>${(data.totalLiabilities + data.totalEquity + data.retainedEarnings).toLocaleString()}</span>
                    </div>
                </div>
             </div>
        </div>
    );

    return (
        <div className="netflix-container" style={{ paddingTop: '100px' }}>
            <h2 className="netflix-header mb-4">Reports</h2>

            <div className="netflix-card p-4 mb-4">
                <Form>
                    <Row className="align-items-end">
                         {activeTab === 'profit-loss' ? (
                            <>
                                <Col md={3}>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" name="startDate" value={dates.startDate} onChange={handleDateChange} className="bg-secondary text-white border-0" />
                                </Col>
                                <Col md={3}>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date" name="endDate" value={dates.endDate} onChange={handleDateChange} className="bg-secondary text-white border-0" />
                                </Col>
                            </>
                         ) : (
                            <Col md={3}>
                                <Form.Label>As Of Date</Form.Label>
                                <Form.Control type="date" name="asOfDate" value={dates.asOfDate} onChange={handleDateChange} className="bg-secondary text-white border-0" />
                            </Col>
                         )}
                         <Col md={2}>
                             <Button className="netflix-btn w-100" onClick={fetchReport}>Generate Report</Button>
                         </Col>
                    </Row>
                </Form>
            </div>

            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3 netflix-tabs"
                style={{ borderBottom: '1px solid #333' }}
            >
                <Tab eventKey="trial-balance" title="Trial Balance" />
                <Tab eventKey="profit-loss" title="Profit & Loss" />
                <Tab eventKey="balance-sheet" title="Balance Sheet" />
            </Tabs>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="netflix-card p-4"
            >
                {loading && <p className="text-center">Loading Report...</p>}
                {!loading && reportData && (
                    <>
                        {activeTab === 'trial-balance' && <RenderTrialBalance data={reportData} />}
                        {activeTab === 'profit-loss' && <RenderProfitLoss data={reportData} />}
                        {activeTab === 'balance-sheet' && <RenderBalanceSheet data={reportData} />}
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default Reports;
