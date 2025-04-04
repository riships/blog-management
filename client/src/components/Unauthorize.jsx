import React from 'react'

function Unauthorize() {
    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 container">
            <div className="text-center">
                <h1 className="mb-4 text-danger display-1">401</h1>
                <h2 className="mb-3 display-6">Unauthorized Access</h2>
                <p className="text-muted lead">
                    Access denied. Please login to access this page.
                </p>
                <hr className="my-4" />
                <a href="/login" className="btn btn-primary">
                    Go to Login
                </a>
            </div>
        </div>
    )
}

export default Unauthorize