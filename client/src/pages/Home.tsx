import { useEffect, useRef } from 'react';
import axios from 'axios';
 
function Home () {
    let hasRun = useRef<boolean>(false);

     if (hasRun.current) return
        hasRun.current = true;
    
    useEffect(() => {
        axios.get('/api/auth/refresh');
    }, [])  

    return (
        <div>   
            
        </div>
    )
}

export default Home;