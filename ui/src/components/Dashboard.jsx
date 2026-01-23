import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Activity, CreditCard } from 'lucide-react';

const HeroSection = ({ netIncome }) => (
    <div style={{
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        background: 'linear-gradient(to top, var(--bg-color) 0%, rgba(0,0,0,0) 100%), url("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        marginTop: '-80px' // Pull behind navbar
    }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}
            >
                Financial Health
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#ddd' }}
            >
                Your Net Income this month is <span style={{ color: '#46d369', fontWeight: 'bold' }}>${netIncome.toLocaleString()}</span>.
                Manage your assets and liabilities with precision.
            </motion.p>
            <div className="d-flex gap-3">
                <button className="netflix-btn" style={{ fontSize: '1.2rem', padding: '0.8rem 2rem' }}>View Reports</button>
                <button className="btn btn-outline-light" style={{ fontSize: '1.2rem', padding: '0.8rem 2rem' }}>Manage Accounts</button>
            </div>
        </div>
    </div>
);

const MetricCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-4"
        style={{
            background: 'var(--card-bg)',
            borderRadius: '8px',
            minWidth: '250px',
            borderTop: `4px solid ${color}`
        }}
    >
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 style={{ fontSize: '1.2rem', color: '#888' }}>{title}</h3>
            <Icon color={color} size={24} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>${(value || 0).toLocaleString()}</h2>
    </motion.div>
);

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        totalAssets: 0,
        totalLiabilities: 0,
        netIncome: 0,
        recentTransactions: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // axios baseURL is '/api', so this requests '/api/dashboard'
                const response = await axios.get('/dashboard');
                if (response.data) {
                    setMetrics(response.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchData();
    }, []);

    const formatDate = (date) => {
        if (!date) return '';
        if (Array.isArray(date)) {
            return new Date(date[0], date[1] - 1, date[2]).toLocaleDateString();
        }
        return date;
    };

    if (!metrics) return <div>Loading...</div>;

    // Safety checks for rendering
    const netIncome = metrics.netIncome !== undefined && metrics.netIncome !== null ? metrics.netIncome : 0;
    const recentTransactions = metrics.recentTransactions || [];

    return (
        <div>
            <HeroSection netIncome={netIncome} />

            <div className="netflix-container" style={{ marginTop: '-100px', position: 'relative', zIndex: 2 }}>
                <h3 className="mb-4 text-white">Overview</h3>
                <div className="d-flex gap-4 flex-wrap">
                    <MetricCard title="Total Assets" value={metrics.totalAssets} icon={DollarSign} color="#46d369" />
                    <MetricCard title="Total Liabilities" value={metrics.totalLiabilities} icon={CreditCard} color="#e50914" />
                    <MetricCard title="Net Income" value={metrics.netIncome} icon={TrendingUp} color="#5e81f4" />
                </div>
            </div>

            <div className="netflix-container">
                <h3 className="netflix-header">Recent Activity</h3>
                <div className="d-flex gap-3" style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
                    {recentTransactions.map((t) => (
                        <motion.div
                            key={t.id}
                            className="netflix-card p-4"
                            style={{ minWidth: '300px' }}
                        >
                            <div className="d-flex justify-content-between mb-2">
                                <span style={{ color: '#888' }}>{formatDate(t.date)}</span>
                                <Activity size={16} color="#888" />
                            </div>
                            <h4>{t.desc}</h4>
                            <h3 style={{ color: t.amount > 0 ? '#46d369' : '#e50914' }}>
                                {t.amount > 0 ? '+' : ''}{t.amount}
                            </h3>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
