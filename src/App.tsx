import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/common/auth/LoginPage";
import OrderManagementPage from "./pages/admin/order/OrderManagementPage";
import UserManagementPage from "./pages/admin/user/UserManagementPage";
import ProductManagementPage from "./pages/admin/product/ProductManagementPage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import HomePage from "./pages/public/HomePage";
import CartPage from "./pages/public/cart/CartPage";
import ProductListPage from "./pages/public/product/ProductListPage";
import MyPage from "./pages/public/user/MyPage";
import SignInPage from "./pages/public/user/SignInPage";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/admin' element={<AdminHomePage/>}>
                <Route path='order' element={<OrderManagementPage/>}/>
                <Route path='product' element={<ProductManagementPage/>}/>
                <Route path='user' element={<UserManagementPage/>}/>
            </Route>
            <Route path='/customer' element={<HomePage/>}>
                <Route path='signin' element={<SignInPage/>}/>
                <Route path='cart' element={<CartPage/>}/>
                <Route path='product' element={<ProductListPage/>}/>
                <Route path='user' element={<MyPage/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
