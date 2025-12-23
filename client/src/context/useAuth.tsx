import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within provider"); 
    }

    return context;
}

export default useAuth; 