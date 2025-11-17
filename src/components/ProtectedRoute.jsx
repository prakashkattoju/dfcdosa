import { useState, useCallback, useEffect, useRef } from 'react';
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
  const [showMenu, setShowMenu] = useState(false)

  const [loading, setLoading] = useState(false);

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

  const backBtn = () => {
    navigate('/')
  }

  const closeMenu = () => {
    const menu = document.getElementById("mobileMenu");
    if (menu && menu.classList.contains("show")) {
      setShowMenu(false)
      menu.classList.remove("show");
    }
  };

  // Close menu when navigating to a new route
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const user = useSelector((state) => state.user);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user_role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`site ${isLoggedIn && user_role === "admin" ? 'inner dashboard' : 'inner'} ${cart.length > 0 && 'cart'}`}>

      {((user_role === "user" && location.pathname !== "/bill") || (user_role === "admin" && location.pathname !== "/order-details")) && <header className="site-header">
        <div className='site-header-top'>
          {user_role === "user" ? <div role="button" className='navbar navbar-expand-lg d-flex gap-2 justify-content-start' onClick={backBtn}>{location.pathname === "/" ? <div><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" /></svg></div> : <><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg>Back</>}</div> : <div role="button" onClick={() => setShowMenu(!showMenu)}  ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">{!showMenu ? <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /> : <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>}</svg></div>}

          <div className="site-branding">
            <Link to="/"><img src="Logo.png" alt="Dosa Filling Centre" /></Link>
          </div>

          <div className='navi d-flex gap-2 justify-content-end align-items-center'>
            {user_role === "admin" && <>
              <span className='d-flex gap-2 justify-content-end align-items-center'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-480q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM192-192v-96q0-23 12.5-43.5T239-366q55-32 116.29-49 61.29-17 124.5-17t124.71 17Q666-398 721-366q22 13 34.5 34t12.5 44v96H192Zm72-72h432v-24q0-5.18-3.03-9.41-3.02-4.24-7.97-6.59-46-28-98-42t-107-14q-55 0-107 14t-98 42q-5 4-8 7.72-3 3.73-3 8.28v24Zm216.21-288Q510-552 531-573.21t21-51Q552-654 530.79-675t-51-21Q450-696 429-674.79t-21 51Q408-594 429.21-573t51 21Zm-.21-72Zm0 360Z" /></svg> {user.fullname}</span><span>|</span></>}
            <span onClick={logoutAccount} className='d-flex gap-2 justify-content-end align-items-center'>Exit<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" /></svg></span>

          </div>
        </div>
        {user_role === "user" && <div className="login-user">
          <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-480q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM192-192v-96q0-23 12.5-43.5T239-366q55-32 116.29-49 61.29-17 124.5-17t124.71 17Q666-398 721-366q22 13 34.5 34t12.5 44v96H192Zm72-72h432v-24q0-5.18-3.03-9.41-3.02-4.24-7.97-6.59-46-28-98-42t-107-14q-55 0-107 14t-98 42q-5 4-8 7.72-3 3.73-3 8.28v24Zm216.21-288Q510-552 531-573.21t21-51Q552-654 530.79-675t-51-21Q450-696 429-674.79t-21 51Q408-594 429.21-573t51 21Zm-.21-72Zm0 360Z" /></svg> {user.fullname ? user.fullname : 'User'}</span>
          <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v124q18 7 29 22t11 34v80q0 19-11 34t-29 22v404q0 33-23.5 56.5T680-40H280Zm0-80h400v-720H280v720Zm0 0v-720 720Zm200-600q17 0 28.5-11.5T520-760q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760q0 17 11.5 28.5T480-720Z" /></svg> {user.mobile}</span>
        </div>}
        {(user_role === "admin" && location.pathname !== '/order-details') && <ul id="mobileMenu" className={`navbar-nav ms-auto ${showMenu && 'show'}`}>
          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/' && 'active'}`} to="/">Orders</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/products' && 'active'}`} to="/products">Products</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/categories' && 'active'}`} to="/categories">Categories</Link>
          </li>
        </ul>}
      </header>}

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
