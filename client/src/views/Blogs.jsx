import React, { useState, useEffect } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsPencil, BsTrash, BsEye } from 'react-icons/bs';

function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
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
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/blogs/' + id,
                {
                    method: 'DELETE',
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
            setBlogs(blogs.filter(blog => blog._id !== id));
            alert('Blog deleted successfully');
        }
        catch (error) {
            alert(error.message)
        } finally {
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
                            <th style={{ width: '160px' }} className='text-center'>Actions</th>
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
                                    <td style={{ verticalAlign: 'middle' }} className='text-center'>
                                        <div className='d-flex justify-content-center gap-3'>
                                            <span className='bg-success px-2 pb-1 rounded-2 text-white'
                                                onClick={() => navigate('/blog/' + blog._id)}
                                                style={{ cursor: 'pointer' }} title='View Blog'
                                            ><BsEye /></span>
                                            <span className='bg-primary px-2 pb-1 rounded-2 text-white'
                                                onClick={() => navigate('/updateBlog/' + blog._id)}
                                                style={{ cursor: 'pointer' }} title='Update Blog'
                                            ><BsPencil /></span>
                                            <span className='bg-danger px-2 pb-1 rounded-2 text-white'
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this blog?')) {
                                                        handleDelete(blog._id);
                                                    }
                                                }}
                                                style={{ cursor: 'pointer' }} title='Delete Blog'

                                            ><BsTrash /></span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>
                                    <div className="py-5 text-center col-12">
                                        <p className="text-muted h4">No blogs available in the collection.</p>
                                        <p className="text-muted">Please check back later!</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default Blogs;