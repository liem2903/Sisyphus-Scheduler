import { Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home';
import Setting from '../src/pages/Setting';
import Loading from '../src/pages/Loading';

function ProtectedRoutes() {
    return (
        <Routes>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/settings" element={<Setting/>}></Route>
            <Route path="/loading" element={<Loading/>}> </Route>
        </Routes>
    )   
} 

export default ProtectedRoutes;