import { useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import { setCredentials } from './store/authSlice';
import { useDispatch } from 'react-redux';
import { getToken } from './util/Cookies'
import { checkAndRemoveExpiredToken, fetchUserRole } from "./util/authUtils";
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Orders from "./pages/Orders";

function App() {
  const dispatch = useDispatch();
  const token = getToken();
  const isLoggedIn = token && checkAndRemoveExpiredToken(token);
  const user_role = fetchUserRole(token)

  useEffect(() => {
    if (isLoggedIn) {
      //console.log("Already Logged In ", token);
      dispatch(setCredentials({ token }));
    }
  }, [dispatch, isLoggedIn]);

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? user_role === "admin" ? <AdminProtectedRoute><Dashboard /> </AdminProtectedRoute> : <ProtectedRoute><Home /></ProtectedRoute> : <Login />} />
      <Route path="/dashboard" element={isLoggedIn ? user_role === "admin" ? <AdminProtectedRoute><Dashboard /> </AdminProtectedRoute> : <ProtectedRoute><Home /></ProtectedRoute> : <AdminLogin />} />
      <Route path="/dashboard/categories" element={<AdminProtectedRoute><Categories /></AdminProtectedRoute>} />
      <Route path="/dashboard/products" element={<AdminProtectedRoute><Products /></AdminProtectedRoute>} />
      <Route path="/dashboard/orders" element={<AdminProtectedRoute><Orders /></AdminProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;