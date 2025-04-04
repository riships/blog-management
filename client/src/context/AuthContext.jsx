import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);

    const login = async (email, password) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/user/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                }
            );
            const data = await response.json();
            if (!data.token) {
                return alert(data.message)
            }
            setToken(data.token);
            sessionStorage.setItem('authToken', data.token);
            if (data.success) {

            }
            return true;
        }
        catch (error) {
            setError(error.response.data.error);
            return false;
        }
    }

    const logout = async () => {
        try {
            setToken(null);
            sessionStorage.removeItem('authToken');
            return true;
        }
        catch (error) {
            setError(error);
            return false;
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            setToken(token);
        }
        setLoading(false);
    }, []);




    return (
        <AuthContext.Provider value={{ login, logout, token, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
