import { useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from "./pages/Home";
import { setCredentials } from './store/authSlice';
import { useDispatch } from 'react-redux';
import { getToken } from './util/Cookies'
import { checkAndRemoveExpiredToken } from "./util/authUtils";
import ProtectedRoute from './components/ProtectedRoute';
import Cart from "./pages/Cart";

function App() {
  const dispatch = useDispatch();
  const token = getToken();
  const isLoggedIn = token && checkAndRemoveExpiredToken(token);

  useEffect(() => {
    if (isLoggedIn) {
      //console.log("Already Logged In ", token);
      dispatch(setCredentials({ token }));
    }
  }, [dispatch, isLoggedIn]);

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <ProtectedRoute><Home /></ProtectedRoute> : <Login />} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;