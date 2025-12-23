import { useEffect, useRef,   } from 'react';
import { useNavigate } from "react-router";

import axios from 'axios';
import Spinner from './helper/Spinner';

function Loading() {
    let hasRun = useRef<boolean>(false);
    let navigate = useNavigate();

    useEffect(() => {
        const value = async () => {
            if (hasRun.current) return
            hasRun.current = true;

            const code = new URLSearchParams(location.search).get("code");
            const googleData = await axios.get('/api/auth/get-google-details', {params: {code}});
            const user_id = googleData.data.data;
            
            // Create refresh token and post it - and make a cookie of it.
            await axios.post('/api/auth/create-refresh-token', {user_id});
            // Create access token and put it in cookie.
            await axios.post('/api/auth/create-access-token', {user_id});
            navigate('/home');
        }

        value();
       }, [])

    return(
        <Spinner/>
    )
}

export default Loading;