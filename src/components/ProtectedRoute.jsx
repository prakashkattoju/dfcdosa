import { useState, useCallback, useEffect } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { decodeToken } from 'react-jwt';
import { logOut } from '../store/authSlice';
import { GetUserByID } from '../services/Userservices';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cart = useSelector((state) => state.cart.cart);
  const token = useSelector((state) => state.auth.token);
  const decodedToken = decodeToken(token);
  const user_id = decodedToken?.user_id;
  const user_role = decodedToken?.user_role;

  const fetchuser = useCallback(async () => {
    try {
      const userdata = await GetUserByID(user_id);
      dispatch(setUserDetails({
        fullname: user_role === "admin" ? "Ravi Kumar" : userdata?.uname,
        mobile: user_role === "admin" ? "9491771333" : userdata?.mobile
      }))
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, [user_id]);

  useEffect(() => {
    user_id && fetchuser();
  }, [fetchuser, user_id]);

  const logoutAccount = () => {
    dispatch(logOut()); // Dispatch the logout action to clear user state
    dispatch(setUserDetails({
      fullname: null,
      mobile: null
    }))
    navigate("/", { replace: true }); // Redirect the user to the login page after logging out
    window.location.reload(true);
  };

  const user = useSelector((state) => state.user);

  const menuNavigation = (page) => {
    switch (page) {
      case "categories":
        navigate('/categories')
        break;
      case "products":
        navigate('/products')
        break;
      case "orders":
        navigate('/orders')
        break;
      default:
        navigate('/')
        break;
    }
  }

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user_role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`site ${isLoggedIn && user_role === "admin" ? 'inner dashboard' : 'inner'} ${cart.length > 0 && 'cart'}`}>
      <header className="site-header">
        <div className="site-branding">
          <Link to="/"><img src="Logo.png" alt="Dosa Filling Centre" /></Link>
        </div>

        <div className="login-user">Hello, {user.fullname}

          {user_role === "user" && <span onClick={logoutAccount}>Exit <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" /></svg></span>}

          {user_role === "admin" && <div className='d-flex gap-2'>

            <span onClick={() => navigate('/')}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" /></svg></span>

            <span onClick={() => menuNavigation('products')}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg></span>

            <span onClick={() => menuNavigation('orders')}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m787-145 28-28-75-75v-112h-40v128l87 87Zm-587 25q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Z" /></svg></span>

            <span onClick={logoutAccount}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" /></svg></span>
          </div>}
        </div>

      </header>
      <main className="site-main">
        <article className="page">
          <div className="entry-content">
            {children}
          </div>
        </article>
      </main>
    </div>
  );
};

export default ProtectedRoute;
