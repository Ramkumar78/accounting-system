import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { Folder, Plus } from 'lucide-react';

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        // Mock data or Fetch
        const fetchAccounts = async () => {
            try {
                // const response = await axios.get('/accounts');
                // setAccounts(response.data);

                // Mock data
                setAccounts([
                    { id: 1, code: '1001', name: 'Cash', type: 'ASSET', balance: 50000.00 },
                    { id: 2, code: '1002', name: 'Bank', type: 'ASSET', balance: 125000.00 },
                    { id: 3, code: '2001', name: 'Accounts Payable', type: 'LIABILITY', balance: 4500.00 },
                    { id: 4, code: '4001', name: 'Sales Revenue', type: 'REVENUE', balance: 250000.00 },
                    { id: 5, code: '5001', name: 'Rent Expense', type: 'EXPENSE', balance: 12000.00 },
                    { id: 6, code: '5002', name: 'Salaries', type: 'EXPENSE', balance: 85000.00 },
                ]);
            } catch (error) {
                console.error("Error fetching accounts", error);
            }
        };
        fetchAccounts();
    }, []);

    return (
        <div className="netflix-container" style={{ paddingTop: '100px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="netflix-header">Chart of Accounts</h2>
                <button className="netflix-btn d-flex align-items-center gap-2">
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
                                <h4 className="mt-1">${account.balance.toLocaleString()}</h4>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AccountList;
