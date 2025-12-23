import { Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Login';
import ProtectedRoutes from './ProtectedRoutes';

function AppRouter () {
    return (
        <Routes>
            <Route path="/" element={<Login/>}> </Route>
            <Route path ="/*" element={<ProtectedRoutes/>}> </Route>           
        </Routes>
    )
}

export default AppRouter;