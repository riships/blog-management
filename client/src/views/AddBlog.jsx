import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function AddBlog() {
    const [blog, setBlog] = useState({
        title: '',
        description: '', 
        blogImg: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [pageType, setPageType] = useState('add');

    const { id } = useParams(); // Changed from blogId to id to match route param
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setPageType('update');
            fetchBlogData(id);
        }
    }, [id]);

    const fetchBlogData = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${id}`, {
                method: 'GET',
                headers: {
                    'blog-auth-token': sessionStorage.getItem('authToken')
                }
            });
            if (response.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
                return;
            }
            const data = await response.json();
            if (!data.success) {
                alert(data.message);
                return;
            }
            setBlog({
                title: data.data.title,
                description: data.data.description,
                blogImg: data.data.blog_img_url
            });
            setImgPreview(`${import.meta.env.VITE_MEDIA_URL}${data.data.blog_img_url}`);
        } catch (error) {
            setError(error.message);
            alert('Error fetching blog data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const imgFile = files[0];

            if (!['image/png', 'image/jpg', 'image/jpeg'].includes(imgFile.type)) {
                alert("Please choose a supported file type (PNG, JPG, JPEG)");
                return;
            }

            const blogUrl = URL.createObjectURL(imgFile);
            setImgPreview(blogUrl);

            setBlog(prevState => ({
                ...prevState,
                [name]: imgFile
            }));
        } else {
            setBlog(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('title', blog.title);
            formData.append('description', blog.description);
            if (blog.blogImg) {
                formData.append('blogImg', blog.blogImg);
            }

            const url = pageType === 'update' ? 
                `${import.meta.env.VITE_API_URL}/blogs/${id}` :
                `${import.meta.env.VITE_API_URL}/blogs`;

            const response = await fetch(url, {
                method: pageType === 'update' ? 'PUT' : 'POST',
                headers: {
                    'blog-auth-token': sessionStorage.getItem('authToken')
                },
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                alert(`Blog ${pageType === 'update' ? 'updated' : 'added'} successfully!`);
                if (pageType === 'add') {
                    setBlog({
                        title: '',
                        description: '',
                        blogImg: ''
                    });
                    removeFile();
                }
                navigate('/blogs');
            } else {
                alert(data.message || 'Operation failed');
            }
        } catch (error) {
            setError(error.message);
            alert(`Error ${pageType === 'update' ? 'updating' : 'adding'} blog`);
        } finally {
            setLoading(false);
        }
    };

    const removeFile = () => {
        setImgPreview(null);
        setBlog(prevState => ({
            ...prevState,
            blogImg: ''
        }));
    };

    return (
        <div className="bg-light py-5 min-vh-100 container-fluid">
            <div className="justify-content-center row">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="shadow card">
                        <div className="p-4 p-md-5 card-body">
                            <h2 className="mb-4 text-center">
                                {pageType === 'update' ? 'Update Blog' : 'Add New Blog'}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    {!imgPreview ? (
                                        <div className="form-floating">
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="blogImg"
                                                name="blogImg"
                                                onChange={handleChange}
                                                accept="image/png, image/jpeg, image/jpg"
                                                required={pageType === 'add'}
                                            />
                                            <label htmlFor="blogImg">Blog Image</label>
                                        </div>
                                    ) : (
                                        <div className="d-flex align-content-center justify-content-center mb-3">
                                            <div className='position-relative' style={{
                                                maxWidth: '150px'
                                            }}>
                                                <img
                                                    src={imgPreview}
                                                    alt="Selected preview"
                                                    className="border rounded-circle img-fluid"
                                                    style={{ maxHeight: '150px' }}
                                                />
                                                <span
                                                    onClick={removeFile}
                                                    style={{
                                                        cursor: 'pointer',
                                                        color: 'red',
                                                        display: 'inline-block',
                                                        marginTop: '0.5rem',
                                                        position: 'absolute',
                                                        top: '0px',
                                                        right: '0px'
                                                    }}
                                                >
                                                    ×
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={blog.title}
                                        onChange={handleChange}
                                        placeholder="Enter title"
                                        required
                                    />
                                    <label htmlFor="title">Title</label>
                                </div>

                                <div className="form-floating mb-4">
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={blog.description}
                                        onChange={handleChange}
                                        placeholder="Enter Description"
                                        style={{ height: '120px' }}
                                        required
                                    />
                                    <label htmlFor="description">Description</label>
                                </div>
                                {error && <p className="text-danger">{error}</p>}

                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? <Spinner animation="border" size="sm" /> : 
                                            pageType === 'update' ? 'Update Blog' : 'Add Blog'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddBlog;