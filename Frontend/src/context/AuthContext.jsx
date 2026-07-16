import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true); // Prevents flash of unauthenticated UI

    // This handles the "Silent Refresh" on Page Refresh
    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                // Send the request to backend; browser automatically attaches cookies
                const response = await axios.get('http://localhost:3000/api/routes/refresh-token', {
                    withCredentials: true,
                });
                setAccessToken(response.data.accessToken);
            } catch (err) {
                console.log("No valid refresh token found on mount.");
            } finally {
                setLoading(false); 
            }
        };

        // Only try to refresh if we don't have an access token yet
        if (!accessToken) {
            verifyRefreshToken();
        } else {
            setLoading(false);
        }
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook so we don't have to import useContext everywhere
export const useAuth = () => useContext(AuthContext);