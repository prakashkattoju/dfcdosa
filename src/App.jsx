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
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Bill from "./pages/Bill";
import OrderDetails from "./pages/OrderDetails";

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
      <Route path="/" element={isLoggedIn ? user_role === "admin" ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <ProtectedRoute><Home /></ProtectedRoute> : <Login />} />

      <Route path="/admin" element={isLoggedIn ? user_role === "admin" ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <ProtectedRoute><Home /></ProtectedRoute> : <AdminLogin />} />

      <Route path="/order-details" element={<ProtectedRoute allowedRoles={["admin"]}><OrderDetails /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute allowedRoles={["admin"]}><Categories /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute allowedRoles={["admin"]}><Products /></ProtectedRoute>} />
      
      <Route path="/cart" element={<ProtectedRoute allowedRoles={["user"]}><Cart /></ProtectedRoute>} />
      <Route path="/bill" element={<ProtectedRoute allowedRoles={["user"]}><Bill /> </ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;