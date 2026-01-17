import { Routes, Route } from 'react-router-dom';
import Home from '../src/pages/main_pages/Home';
import ProtectedRoute from '../src/pages/component/global_components/ProtectedRoute';

function ProtectedRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute/>}>
                <Route path="/home" element={<Home/>}></Route>
            </Route> 
        </Routes>
    )   
} 

export default ProtectedRoutes;