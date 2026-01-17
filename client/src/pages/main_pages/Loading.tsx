import { useEffect, useRef} from 'react';
import Spinner from '../component/global_components/Spinner';
import useAuth from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { api } from '../../interceptor/interceptor';

function Loading() {
    let hasRun = useRef<boolean>(false);
    const { setStatus } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const value = async () => {
            if (hasRun.current) return
            hasRun.current = true;

            const code = new URLSearchParams(location.search).get("code");
            const googleData = await api.get('/auth/get-google-details', {params: {code}});
            const user_id = googleData.data.data;            
            // Create refresh token and post it - and make a cookie of it.
            await api.post('/auth/create-refresh-token', {user_id});
            // Create access token and put it in cookie.
            await api.post('/auth/create-access-token', {user_id});
            setStatus('authenticated');
            navigate('/home');
        }

        value();
       }, [])

    return(
        <Spinner/>
    )
}

export default Loading;