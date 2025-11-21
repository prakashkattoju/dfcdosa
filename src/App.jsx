import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const navigate = useNavigate();
  const token = getToken();
  const isLoggedIn = token && checkAndRemoveExpiredToken(token);
  const user_role = fetchUserRole(token)

  const checkToken = () => {
    if (isLoggedIn) {
      dispatch(setCredentials({ token }));
    }
  };

  useEffect(() => {
    checkToken()
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? user_role === "user" ? <ProtectedRoute allowedRoles={["user"]}><Home /></ProtectedRoute> : <ProtectedRoute allowedRoles={["admin"]}><Dashboard /></ProtectedRoute> : <Login />} />

      <Route path="/admin" element={isLoggedIn ? user_role === "user" ? <ProtectedRoute allowedRoles={["user"]}><Home /></ProtectedRoute> : <ProtectedRoute allowedRoles={["admin"]}><Dashboard /></ProtectedRoute> : <AdminLogin />} />

      <Route path="/orders" element={<ProtectedRoute allowedRoles={["admin"]}><Dashboard /></ProtectedRoute>} />
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