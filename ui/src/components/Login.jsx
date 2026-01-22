import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);

            // Post to the configured Spring Security login processing URL
            // axios baseURL is '/api', so this requests '/api/login'
            await axios.post('/login', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            // On success, the session cookie is set by the browser.
            // We set a marker in localStorage for the frontend to know we are logged in.
            localStorage.setItem('token', 'session-active');
            localStorage.setItem('username', username);
            // Default role or fetch from /users/me if needed. For now assume USER/ADMIN based on login.
            localStorage.setItem('role', 'ADMIN'); // Simplified for now

            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{
            height: '100vh',
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://assets.nflxext.com/ffe/siteui/vlv3/dace47b4-a5cb-4368-80fe-c26f3e77d540/f5b52435-458f-498f-9d1d-ccd4f1af9913/US-en-20231023-popsignuptwoweeks-perspective_alpha_website_large.jpg')`,
            backgroundSize: 'cover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: 'rgba(0,0,0,0.75)',
                    padding: '4rem',
                    borderRadius: '4px',
                    width: '100%',
                    maxWidth: '450px',
                    minHeight: '600px'
                }}
            >
                <h1 style={{ color: 'white', marginBottom: '2rem', fontWeight: 'bold' }}>Sign In</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ background: '#333', border: 'none', color: 'white', height: '50px' }}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ background: '#333', border: 'none', color: 'white', height: '50px' }}
                        />
                    </div>
                    <button type="submit" className="netflix-btn w-100" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                        Sign In
                    </button>

                    <div className="mt-3 text-secondary d-flex justify-content-between">
                         <div>
                             <input type="checkbox" id="remember" style={{ marginRight: '5px' }} />
                             <label htmlFor="remember">Remember me</label>
                         </div>
                         <span>Need help?</span>
                    </div>

                    <div className="mt-5 text-secondary">
                        New to NetFin? <Link to="/register" className="text-white" style={{ textDecoration: 'none' }}>Sign up now</Link>.
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
