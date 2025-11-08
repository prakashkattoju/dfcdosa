import { useRef, useEffect } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { decodeToken } from 'react-jwt';
import { logOut } from '../store/authSlice';
import { Modal } from "bootstrap";

const AdminProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const cart = useSelector((state) => state.cart.cart);
    const token = useSelector((state) => state.auth.token);
    const decodedToken = decodeToken(token);
    const user_id = decodedToken?.user_id;

    const modalRef = useRef();

    const openModal = () => {
        const modal = new Modal(modalRef.current);
        modal.show();
    };

    const closeModal = () => {
        document.activeElement?.blur();
        const modal = Modal.getInstance(modalRef.current);
        modal?.hide();
    };

    useEffect(() => {
        user_id && dispatch(setUserDetails({
            fullname: "Ravi Kumar",
            mobile: 1212121212
        }));
    }, [user_id]);

    const logoutAccount = () => {
        dispatch(logOut()); // Dispatch the logout action to clear user state
        dispatch(setUserDetails({
            fullname: null,
            mobile: null
        }))
        navigate("/dashboard", { replace: true }); // Redirect the user to the login page after logging out
        window.location.reload(true);
    };

    const user = useSelector((state) => state.user);

    const { fullname, mobile } = user;

    if (!isLoggedIn) {
        return <Navigate to="/dashboard" />;
    }

    const menuNavigation = (page) => {
        switch (page) {
            case "categories":
                navigate('/dashboard/categories')
                break;
            case "products":
                navigate('/dashboard/products')
                break;
            case "orders":
                navigate('/dashboard/orders')
                break;
            default:
                navigate('/dashboard')
                break;
        }
        closeModal()
    }

    return (
        <>
            <div className={`site ${isLoggedIn && 'inner dashboard'}`}>
                <header className="site-header">
                    <div className="site-branding">
                        <Link to="/dashboard"><img src="Logo.png" alt="Dosa Filling Centre" /></Link>
                    </div>
                    <div className="login-user">Hello, {fullname} <span onClick={openModal}><i className="fa-solid fa-bars"></i></span></div>
                </header>
                <main className="site-main">
                    <article className="page">
                        <div className="entry-content">
                            {children}
                        </div>
                    </article>
                </main>
            </div>
            <div
                className="dfc-modal modal fade"
                id="menuModal"
                tabIndex="-1"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeModal}
                                aria-label="Close"
                            ></button>
                            <h4 className="modal-title">Settings</h4>

                        </div>
                        <div className="modal-body">
                            <div className="list">
                                <div className="item-category" onClick={() => menuNavigation('categories')}><span><span>Add Category</span><i className="fa-solid fa-chevron-right"></i></span></div>
                                <div className="item-category" onClick={() => menuNavigation('products')}><span><span>Add Product</span><i className="fa-solid fa-chevron-right"></i></span></div>
                                <div className="item-category" onClick={() => menuNavigation('orders')}><span><span>Orders</span><i className="fa-solid fa-chevron-right"></i></span></div>
                                <div className="item-category" onClick={logoutAccount}><span><span>Exit</span><i className="fa-solid fa-chevron-right"></i></span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminProtectedRoute;
