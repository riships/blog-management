import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';

function ProtectedRoutes() {
    let token = sessionStorage.getItem('authToken');
    if (token === null || token === '' || token === 'undefined') {
        return <Navigate to="/login" />
    }
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    )
}

export default ProtectedRoutes