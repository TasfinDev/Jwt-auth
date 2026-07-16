import { useEffect, useState, useRef } from 'react';
import { useAxiosPrivate } from './hooks/useAxiosPrivate.js'; 
export default function Getme() {
    const [userData, setUserData] = useState(null);
    const axiosPrivate = useAxiosPrivate(); // Get our magic interceptor instance
    const isMounted = useRef(true);
   const [Timeout, setTimeout] = useState(false);
    useEffect(() => {
        const getDashboardData = async () => {
            if (!isMounted.current) return; // Prevent state updates if component unmounted
            try {
                // No token configuration needed here! The interceptor does it all.
                const response = await axiosPrivate.get('/api/routes/get-me');
                console.log(response.data);
               
                setUserData(response.data);
            } catch (err) {
                console.error("Could not fetch data", err);
                if (err.status === 401) {
                    setTimeout(true);
                }
            }
        };

        getDashboardData();
    }, []);
 


    /// REfresh token not working on this page, need to check if the interceptor is properly attached and if the refresh token logic is correct.
    //  Also check if the backend is properly sending the new access token on refresh.
    // the token dissapairs after refreshing the page, need to check if the refresh token is properly stored in the browser .



    
    if (Timeout) {
        return <h1>Please login first</h1>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {userData ? <p>Welcome, {userData.user.username}</p> : <p>Loading data...</p>}
        </div>
    );
}