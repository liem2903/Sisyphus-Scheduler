import { Routes, Route } from 'react-router-dom';
import Login from '../src/pages/main_pages/Login';
import ProtectedRoutes from './ProtectedRoutes';
import Loading from '../src/pages/main_pages/Loading';

function AppRouter () {
    return (
        <Routes>
            <Route path="/" element={<Login/>}> </Route>
            <Route path="/loading" element={<Loading/>}> </Route>
            <Route path ="/*" element={<ProtectedRoutes/>}> </Route>           
        </Routes>
    )
}

export default AppRouter;