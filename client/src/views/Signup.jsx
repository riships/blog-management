import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    // State to store form values
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone_number: '',
        password: ''
    });
    // State to store loading status
    const [loading, setLoading] = useState(false);

    // Handle change for input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        console.log(token);

        if (token) {
            navigate('/blogs');
        }
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // You can process form data here or send it to an API
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone_number || !formData.password) {
            return alert('Please fill all the fields');
        }
        setLoading(true);
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                // clear the data of form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone_number: '',
                    password: ''
                });
                alert(data.message);
                navigate('/login')
            } else {
                alert(data.message)
            }
            setLoading(false);
        } catch (error) {
            alert(error.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="py-5 container">
            <div className="justify-content-center row">
                <div className="col-md-6">
                    <div className="shadow-lg border-0 rounded-lg card">
                        <div className="py-4 text-center card-header" style={{ background: 'linear-gradient(to right, #4e54c8, #8f94fb)' }}>
                            <h2 className="mb-0 text-white fw-bold">Create Account</h2>
                            <p className="mb-0 text-white-50">Join our community today</p>
                        </div>
                        <div className="p-4 p-md-5 card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="firstName"
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="Enter your First Name"
                                            />
                                            <label htmlFor="firstName">First Name</label>
                                        </div>
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="lastName"
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Enter your Last Name"
                                            />
                                            <label htmlFor="lastName">Last Name</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                    />
                                    <label htmlFor="email">Email address</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone_number"
                                        id="phone"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder="Enter your Phone"
                                    />
                                    <label htmlFor="phone">Phone Number</label>
                                </div>

                                <div className="form-floating mb-4">
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                    />
                                    <label htmlFor="password">Password</label>
                                </div>

                                <button 
                                    type="submit" 
                                    className="mb-3 py-3 rounded-3 w-100 text-uppercase fw-bold btn btn-primary"
                                    style={{ 
                                        background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
                                        border: 'none'
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Spinner 
                                            animation="border" 
                                            size="sm" 
                                            className="me-2"
                                        />
                                    ) : 'Sign Up'}
                                </button>

                                <div className="text-center">
                                    <p className="mb-0 text-secondary">
                                        Already have an account?{' '}
                                        <Link 
                                            to="/login" 
                                            className="text-decoration-none fw-bold"
                                            style={{ color: '#4e54c8' }}
                                        >
                                            Login here
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
