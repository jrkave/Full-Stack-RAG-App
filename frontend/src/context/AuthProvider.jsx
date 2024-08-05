import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAlert } from 'react-alert'
import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
const AuthContext = createContext(null);


export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(null);
    const alert = useAlert();

    useEffect(() => {
        auth();
    }, []);

    async function login(username, password) {
        try {
            const res = await api.post('/api/token/', {username, password});
            if (res.status < 200 || res.status >= 300) {
                throw new Error('HTTP Error fetching tokens');
            }
            // Set tokens in local storage
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

            // Update state
            setUser(res.data.user);
            setError('');
            setIsAuthorized(true);
        } catch (error) {
            alert.error(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCircleXmark className='mr-1'/>An error occurred while logging in.</div>);
            setError('Login failed.');
            setUser(null);
            setIsAuthorized(false);
        }
    }

    function logout() {
        localStorage.clear();
        setError('');
        setUser(null);
        setIsAuthorized(false);
    }

    async function register(username, password) {
        localStorage.clear();
        try {
            const res = await api.post('/api/user/register/', {username, password});
            if (res.status < 200 || res.status >= 300) {
                throw new Error('Encountered HTTP Error while registering user');
            }
            await login(username, password);
        } catch (error) {
            alert.error(<div className='flex items-center' style={{ textTransform: 'initial' }}><FaCircleXmark className='mr-1'/>An error occurred while registering.</div>);
            setError('Registration failed. Please try again.');
            setIsAuthorized(false);
            setUser(null);
        }
    }

    async function refreshToken() {
        // Set refresh token from local storage
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try {
            const res = await api.post('/api/token/refresh/', {
                refresh: refreshToken
            });
            // Get and set new access token
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
            } else {
                throw new Error('HTTP Error refreshing token');
            }
        } catch (error) {
            setIsAuthorized(false);
            setUser(null);
            setError(`Refresh token failed.`);
        }
    };

    async function auth() {
        // Set access token from local storage
        const token = localStorage.getItem(ACCESS_TOKEN);

        // Token absent
        if (!token) {
            setError('');
            setIsAuthorized(null);
            setUser(null);
            return;
        }

        // Token present
        try {
            const decodedToken = jwtDecode(token);
            const tokenExpiration = decodedToken.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                // Token is not valid, attempt to refresh
                await refreshToken();
                // Clear any previous error after successful refresh
                setError('');
            } else {
                // Token is valid 
                setIsAuthorized(true);
            }
        } catch (error) {
            setUser(null);
            setIsAuthorized(null);
            setError('Oops! An error occurred.');
        }
    };

    const value = { user, error, isAuthorized, login, logout, register, auth } ;

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}
