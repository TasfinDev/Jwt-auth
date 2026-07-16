import axios from 'axios';
import { useEffect } from 'react';
import {useAuth} from '../context/AuthContext.jsx';
// Create a private axios instance
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const axiosPrivate = axios.create({
    baseURL: `${API_URL}`,
    withCredentials: true, // Crucial for sending/receiving cookies
    headers: { 'Content-Type': 'application/json' }
});

export const useAxiosPrivate = () => {
    const { accessToken, setAccessToken } = useAuth();

    useEffect(() => {
        // 1. Request Interceptor: Attach access token to headers
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                const hasAuthHeader = config.headers?.Authorization || config.headers?.authorization;
                if (accessToken && !hasAuthHeader) {
                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${accessToken}`
                    };
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        // 2. Response Interceptor: Catch 401, refresh token, retry
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                
                const isRefreshRequest = prevRequest?.url?.includes('/refresh-token');
                if (error?.response?.status === 401 && !prevRequest?.sent && !isRefreshRequest) {
                    prevRequest.sent = true; // prevents infinite loop

                    try {
                        // Hit the refresh endpoint
                        const response = await axios.get(`${API_URL}/api/routes/refresh-token`, {
                            withCredentials: true
                        });
                        
                        const newTargetToken = response.data.accessToken;
                        setAccessToken(newTargetToken); // update react state

                        // Retry original request with new token
                        prevRequest.headers['Authorization'] = `Bearer ${newTargetToken}`;
                        return axiosPrivate(prevRequest);
                    } catch (refreshError) {
                        // Refresh token expired too -> Log out user completely
                        setAccessToken(null);
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        // Eject interceptors on unmount to prevent memory leaks
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [accessToken, setAccessToken]);

    return axiosPrivate;
};