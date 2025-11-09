import { useState, useCallback, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { decodeToken } from 'react-jwt';
import { logOut } from '../store/authSlice';
import { GetUserByID } from '../services/Userservices';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cart = useSelector((state) => state.cart.cart);
  const token = useSelector((state) => state.auth.token);
  const decodedToken = decodeToken(token);
  const user_id = decodedToken?.user_id;
  const user_role = decodedToken?.user_role;

  const [isConfirmOpen, setConfirmOpen] = useState(false)
  const [open, setOpen] = useState(false);

  const fetchuser = useCallback(async () => {
    try {
      const userdata = await GetUserByID(user_id);
      dispatch(setUserDetails({
        fullname: userdata?.uname,
        mobile: userdata?.mobile
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

  const { fullname, mobile } = user;

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className={`site ${isLoggedIn && 'inner'} ${cart.length > 0 && 'cart'}`}>
      <header className="site-header">
        <div className="site-branding">
          <a href="/"><img src="Logo.png" alt="Dosa Filling Centre" /></a>
        </div>
        <div className="login-user">Hello, {fullname} <span onClick={logoutAccount}>Exit <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg></span></div>
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
