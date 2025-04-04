import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddBlog() {
    const [blog, setBlog] = useState({
        title: '',
        description: '',
        blogImg: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type == 'file') {
            let imgFile = files[0];

            if (imgFile.type != 'image/png' &&
                imgFile.type != 'image/jpg' &&
                imgFile.type != 'image/jpeg') {
                alert("Kindly Choose supported file type.")
                return;
            }

            let blogUrl = URL.createObjectURL(imgFile);
            setImgPreview(blogUrl)

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
            formData.append('blogImg', blog.blogImg);

            const response = await fetch(import.meta.env.VITE_API_URL + '/blogs', {
                method: 'POST',
                headers: {
                    'blog-auth-token': sessionStorage.getItem('authToken')
                },
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                alert('Blog added successfully!');
                setBlog({
                    title: '',
                    description: '',
                    blogImg: '',
                });
                removeFile();
            }
            setLoading(false);
            setError(null)
        } catch (error) {
            setError(error.message);
            alert('Error adding blog');
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
    }

    return (
        <div className="bg-light py-5 min-vh-100 container-fluid">
            <div className="justify-content-center row">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="shadow card">
                        <div className="p-4 p-md-5 card-body">
                            <h2 className="mb-4 text-center">Add New Blog</h2>
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
                                                required
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
                                                    x
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
                                    />
                                    <label htmlFor="description">Description</label>
                                </div>
                                {error ? (<p>{error}</p>) : ''}

                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 btn btn-primary"
                                    >
                                        {loading ? (<Spinner />) : ' Add Blog'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default AddBlog;