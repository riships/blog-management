import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

function BlogView() {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${id}`, {
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
                alert(data.message);
                return;
            }

            setBlog(data.data);
        } catch (error) {
            alert(error.message || "Error fetching blog")
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'blog-auth-token': sessionStorage.getItem('authToken')
                },
                body: JSON.stringify({ comment })
            });

            if (response.status === 401) {
                navigate('/login');
                return;
            }

            const data = await response.json();
            if (data.success) {
                setComment('');
                fetchBlog(); // Refresh blog data to show new comment
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Failed to post comment');
        }
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center min-vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!blog) {
        return <div className="mt-5 text-center">Blog not found</div>;
    }

    return (
        <div className="py-5 container">
            <div className="justify-content-center row">
                <div className="col-12 col-lg-8">
                    <div className="shadow card">
                        {blog.blog_img_url && (
                            <img
                                src={`${import.meta.env.VITE_MEDIA_URL}${blog.blog_img_url}`}
                                className="card-img-top"
                                alt={blog.title}
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                            />
                        )}
                        <div className="card-body">
                            <h1 className="mb-4 card-title">{blog.title}</h1>
                            <p className="card-text">{blog.description}</p>

                            {/* Author info if available */}
                            {blog.author && (
                                <p className="mb-4 text-muted">
                                    Author: {blog.author.name || 'Anonymous'}
                                </p>
                            )}

                            {/* Comments section */}
                            <div className="mt-5">
                                <h3>Comments</h3>
                                <form onSubmit={handleCommentSubmit} className="mb-4">
                                    <div className="form-group">
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Write a comment..."
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="mt-2 btn btn-primary">
                                        Post Comment
                                    </button>
                                </form>

                                {/* Display comments */}
                                <div className="comments-list">
                                    {blog.comments && blog.comments.map((comment, index) => (
                                        <div key={index} className="mb-2 card">
                                            <div className="card-body">
                                                <p className="card-text">{comment.comment}</p>
                                                {comment.user && (
                                                    <small className="text-muted">
                                                        By: {comment.user.firstName || 'Anonymous'}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogView;
