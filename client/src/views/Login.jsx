import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (token && token !== '' && token !== 'undefined') {
            navigate('/blogs');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please fill all fields');
            return;
        }
        setLoading(true);
        try {
            const res = await login(email, password);
            if (res) {
                navigate('/blogs')
            }
            setLoading(false)
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="d-flex align-items-center bg-light min-vh-100">
            <div className="container">
                <div className="justify-content-center row">
                    <div className="col-md-7 col-lg-5">
                        <div className="shadow card">
                            <div className="py-3 text-white text-center card-header" style={{ background: 'linear-gradient(to right, #4e54c8, #8f94fb)' }}>
                                <h2 className="mb-0">Log In</h2>
                            </div>
                            <div className="p-4 card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            id="email"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <label htmlFor="email">Email</label>
                                    </div>
                                    <div className="form-floating mb-4">
                                        <input
                                            type="password"
                                            className="form-control form-control-lg"
                                            id="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <label htmlFor="password">Password</label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-100 text-white btn btn-lg"
                                        style={{ background: 'linear-gradient(to right, #4e54c8, #8f94fb)' }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : 'Log In'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
