import { Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home';
import Setting from '../src/pages/Setting';
import ProtectedRoute from '../src/pages/ProtectedRoute';

function ProtectedRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute/>}>
                <Route path="/home" element={<Home/>}></Route>
                <Route path="/settings" element={<Setting/>}></Route>
            </Route> 
        </Routes>
    )   
} 

export default ProtectedRoutes;