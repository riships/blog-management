import React, { useState, useEffect } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsPencil, BsTrash } from 'react-icons/bs';

function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch blogs data when component mounts
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            // Replace with your actual API endpoint
            const response = await fetch(import.meta.env.VITE_API_URL + '/blogs',
                {
                    method: 'GET',
                    headers: {
                        'blog-auth-token': sessionStorage.getItem('authToken')
                    }
                });
            if (response.status === 401) {
                navigate('/login');
                return;
            }
            const data = await response.json();
            if (!data.success) {
                return alert(data.message);
            }
            setBlogs(data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center min-vw-100 min-vh-100">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="p-4 container">
            <h1 className="mb-4 text-center fw-bold">Blogs</h1>
            <div className="row-cols-1 row-cols-lg-2 row-cols-xl-3 row g-4">
                <Table className='table-bordered'>
                    <thead className='table-secondary'>
                        <tr>
                            <th style={{ width: '120px' }}>Logo</th>
                            <th style={{ width: '180px' }}>Title</th>
                            <th>Description</th>
                            <th style={{ width: '120px' }} className='text-center'>Ations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.length > 0 ? (
                            blogs.map((blog) => (
                                <tr key={blog._id}>
                                    <td>
                                        <img src={`${import.meta.env.VITE_MEDIA_URL}${blog.blog_img_url}`} style={{ width: '100px' }} />
                                    </td>
                                    <td>{blog.title}</td>
                                    <td>{blog.description}</td>
                                    <td>
                                        <div className='d-flex gap-3' style={{ transform: 'translate(30%, 50%)' }}>
                                            <span className='bg-primary px-2 pb-1 rounded-2 text-white'><BsPencil /></span>
                                            <span><BsTrash /></span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <div className="py-5 text-center col-12">
                                <p className="text-muted h4">No blogs available in the collection.</p>
                                <p className="text-muted">Please check back later!</p>
                            </div>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default Blogs;