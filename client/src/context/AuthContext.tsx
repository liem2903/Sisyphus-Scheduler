import React, { createContext, useState, type ReactNode, useEffect, useRef  } from 'react';
import { api } from '../interceptor/interceptor';

type AuthContextType = {
    status: string,
    setStatus: React.Dispatch<React.SetStateAction<string>>
}

export const AuthContext = createContext<AuthContextType | null> (null);

export function AuthProvider({children}: {children: ReactNode}) {
    let hasRun = useRef<boolean>(false);
    const [status, setStatus ] = useState("loading");
        
    useEffect(() => {       
        const checkUser = async () => {
            if (hasRun.current) return;
            hasRun.current = true; 
                        
            try {
                await api.get('/auth/me');
                setStatus("authenticated");
            } catch (err: any) {
                if (err.response.status == 401) {                   
                    setStatus("unauthenticated");
                }              
            }
        }

        checkUser();
    }, [])

    return (
        <AuthContext.Provider value={{ status, setStatus }}>
            {children}
        </AuthContext.Provider>
    );
} 
