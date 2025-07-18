import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './privateRoute';
import CreateProduct from "../Pages/CreateProduct";
import Main from "../Pages/Main";
import CreateCategory from "../Pages/CreateCategory";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Pageadmin from "../Pages/Admin";
import History from "../Pages/History";
import Profile from "../Pages/Profile";


function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />}></Route>
                <Route path="/profile" element={<PrivateRoute allowedRoles={['comprador', 'vendedor', 'gerente', 'admin']}><Profile /></PrivateRoute>}></Route>
                <Route path="/create-product" element={<PrivateRoute allowedRoles={['gerente', 'vendedor', 'admin']}><CreateProduct /></PrivateRoute>} />
                <Route path="/create-category" element={<PrivateRoute allowedRoles={['gerente', 'admin']}><CreateCategory /></PrivateRoute>} />
                <Route path='/login' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/admin' element={<PrivateRoute allowedRoles={['admin']}><Pageadmin /></PrivateRoute>} />
                <Route path='/history' element={<History />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;