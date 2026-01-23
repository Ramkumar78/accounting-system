import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/users/register', {
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName,
                email: formData.email
            });

            // If successful, navigate to login
            navigate('/login');

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            console.error(err);
        }
    };

    return (
        <div style={{
            height: '100vh',
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://assets.nflxext.com/ffe/siteui/vlv3/dace47b4-a5cb-4368-80fe-c26f3e77d540/f5b52435-458f-498f-9d1d-ccd4f1af9913/US-en-20231023-popsignuptwoweeks-perspective_alpha_website_large.jpg')`,
            backgroundSize: 'cover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: 'rgba(0,0,0,0.75)',
                    padding: '3rem',
                    borderRadius: '4px',
                    width: '100%',
                    maxWidth: '450px',
                    position: 'relative',
                    zIndex: 20
                }}
            >
                <h1 style={{ color: 'white', marginBottom: '2rem', fontWeight: 'bold' }}>Sign Up</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={{ background: '#333', border: 'none', color: 'white', height: '50px' }}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ background: '#333', border: 'none', color: 'white', height: '50px' }}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            style={{ background: '#333', border: 'none', color: 'white', height: '50px' }}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ background: '#333', border: 'none', color: 'white', height: '50px' }}
                        />
                    </div>
                    <button type="submit" className="netflix-btn w-100" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                        Sign Up
                    </button>

                    <div className="mt-4 text-secondary">
                        Already have an account? <Link to="/login" className="text-white" style={{ textDecoration: 'none' }}>Sign in now</Link>.
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
