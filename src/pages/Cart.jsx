import { useEffect, useState } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import priceDisplay from '../util/priceDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../store/cartSlice';
import { setUserDetails } from '../store/userSlice';
import { logOut } from '../store/authSlice';
//import { verifyCartItems } from '../store/cartThunks';
import { useNavigate, Link } from "react-router-dom";
import { decodeToken } from 'react-jwt';
import { CreateBill } from '../services/Billservices';
import { UpdateUserName } from '../services/Userservices';
import ConfirmModal from '../components/ConfirmModal';

import { FaSpinner } from "react-icons/fa";

export default function Cart() {
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart.cart);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //const [removedItems, setRemovedItems] = useState([])
    const decodedToken = decodeToken(token);
    const user_id = decodedToken?.user_id;
    const [loading, setLoading] = useState(false);
    const [showPromptModal, setShowPromptModal] = useState(false)

    const [showConfirm, setShowConfirm] = useState(false);

    const backBtn = () => {
        navigate('/')
    }

    // Formik initialization
    const formik = useFormik({
        initialValues: {
            uname: ""
        },
        validationSchema: Yup.object({
            uname: Yup.string()
                .required("Name is required")
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true)
                const data = await UpdateUserName(values.uname, user_id);
                if (data.status) {
                    dispatch(setUserDetails({
                        ...user,
                        fullname: values.uname,
                    }))
                    handleConfirmSubmit()
                }
            } catch (error) {
                console.error("Error", error)
            }
        },
    });

    const getQuantity = (product_id) => {
        const qty = cart.find((el) => el.product_id === product_id);
        return qty.quantity;
    }

    const getCartQuantity = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartAmount = () => {
        return priceDisplay(cart.reduce((total, item) => total + item.unit_price * item.quantity, 0));
    }

    const getCartItemsAmount = (item) => {
        return priceDisplay(item.unit_price * item.quantity);
    }
    const decrement = (product_id) => {
        dispatch(decrementQuantity(product_id));
    }
    const increment = (product_id) => {
        dispatch(incrementQuantity(product_id));
    }
    const remove = (product_id) => {
        dispatch(removeFromCart(product_id));
    }

    const handleCancel = () => {
        document.activeElement?.blur();
        setShowPromptModal(false);
    };

    const handleConfirmSubmit = async () => {
        setLoading(true)
        const cartdata = {
            total_quantity: getCartQuantity(),
            total_price: cart.reduce((total, item) => total + item.unit_price * item.quantity, 0),
            items: cart
        };
        try {
            const data = await CreateBill(cartdata);
            if (data.status) {
                //handleCancel();
                navigate('/bill', { state: { token_num: data.token_num } })
            }
        } catch (error) {
            console.error("Error", error.message)
        }
    }

    const setSearchResultsFunc = (text) => {
        if (text !== '') {
            navigate('/', { state: { queryString: text } })
        }
    }

    const logoutAccount = () => {
        dispatch(logOut()); // Dispatch the logout action to clear user state
        dispatch(setUserDetails({
            fullname: null,
            mobile: null
        }))
        navigate("/", { replace: true }); // Redirect the user to the login page after logging out
        window.location.reload(true);
    };

    const handleExitCancel = () => {
        document.activeElement?.blur();
        setShowConfirm(false);
    };

    return (<>
        <header className="site-header">
            <div className='search-area d-flex gap-2 align-items-center justify-content-between'>
                <button className='icon-btn' onClick={backBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg>
                </button>
                <div className="search-form">
                    <div className="form-group">
                        <input className="form-control" type="text" value="" onChange={(e) => setSearchResultsFunc(e.target.value)} placeholder="Search here..." autoComplete="off" disabled={loading} />
                        <span className='search-icon'><i className="fa-solid fa-search"></i></span>
                    </div>
                </div>
                <button className='icon-btn' onClick={() => navigate('/account')}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-480q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM192-192v-96q0-23 12.5-43.5T239-366q55-32 116.29-49 61.29-17 124.5-17t124.71 17Q666-398 721-366q22 13 34.5 34t12.5 44v96H192Zm72-72h432v-24q0-5.18-3.03-9.41-3.02-4.24-7.97-6.59-46-28-98-42t-107-14q-55 0-107 14t-98 42q-5 4-8 7.72-3 3.73-3 8.28v24Zm216.21-288Q510-552 531-573.21t21-51Q552-654 530.79-675t-51-21Q450-696 429-674.79t-21 51Q408-594 429.21-573t51 21Zm-.21-72Zm0 360Z" /></svg></button>

                <button className='icon-btn' onClick={() => setShowConfirm(true)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" /></svg></button>
            </div>
        </header>
        <div>
            {/* {removedItems.length > 0 && <div className="cart-summary-review removed">
                <h3>Sorry, the below item(s) are not available</h3>
                <div className="tbl-cart show-cart">
                    <div>
                        {removedItems.map((item, index) => <div key={index} className="cart-item">
                            <div className="cart-trow">
                                <div className="pname">{item.title}</div>
                                <div>{priceDisplay(parseInt(item.unit_price))}</div>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>} */}
            {cart.length > 0 ?
                <>
                    <div className="list scroll">
                        <div className="item-list">
                            {cart.map((item, index) => <div key={index} className="item">
                                <div className='item-inner'>
                                    <button className='remove-item' onClick={() => remove(item.product_id)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="red"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg></button>
                                    <div className="meta">
                                        <h2>{item.title}</h2>
                                        <div className="meta-inner">
                                            <div className="meta-info">
                                                <div className="price">{priceDisplay(parseInt(item.unit_price)).replace("₹", "")}</div>
                                                <span className="itemid"># {item.product_id}</span>
                                            </div>
                                            <div className="cart-action">
                                                <div className="opt">
                                                    <button className="minus-item" onClick={() => decrement(item.product_id)}><i className="fa-solid fa-minus"></i></button>
                                                    <div className="qty">{getQuantity(parseInt(item.product_id))}</div>
                                                    <button className="plus-item" onClick={() => increment(item.product_id)}><i className="fa-solid fa-plus"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                            <div className="item">
                                <div className='item-inner'>
                                    <div className="meta">
                                        <div className="meta-inner">
                                            <div className="meta-info">
                                                <div className="price">No. Items</div>
                                            </div>
                                            <div className="meta-info">
                                                <div className="price text-end">{getCartQuantity()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className='item-inner'>
                                    <div className="meta">
                                        <div className="meta-inner">
                                            <div className="meta-info">
                                                <div className="price">Total</div>
                                            </div>
                                            <div className="meta-info">
                                                <div className="price text-end">{getCartAmount()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="addmore"><p>If you want add more items.</p><button type="button" className="btn toggle" onClick={() => navigate("/", { replace: true })}>Add More</button></div>
                    <div className="cart-summary-badge">
                        <div className="cart-bottom-bar"><strong className="total-count">{getCartQuantity()}</strong> | <strong className="total-cart">{getCartAmount()}</strong></div>
                        <div className="continue">
                            <button className="btn" onClick={() => setShowPromptModal(true)}>Submit</button>
                        </div>
                    </div>
                </> :
                <div className="cart-summary-review">
                    <div className="tbl-cart show-cart">
                        <div className="addmore"><p>Your cart is empty.</p><button type="button" className="btn toggle" onClick={() => navigate("/", { replace: true })}>Add Items</button></div>
                    </div>
                </div>
            }
            <div
                className={`dfc-modal modal fade ${showPromptModal ? "show d-flex" : ""}`}
                id="PromptModal"
                tabIndex="-1"
            >
                <div className="modal-dialog">
                    {user.fullname === "" ? <form className="modal-content" onSubmit={formik.handleSubmit}>
                        <div className="modal-header">
                            <h4 className="modal-title">Enter Name & Confirm Order</h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <input
                                    name="uname"
                                    placeholder="Your name"
                                    value={formik.values.uname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="form-control"
                                />
                                {formik.touched.uname && formik.errors.uname ? (
                                    <div className="input-error">{formik.errors.uname}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button type="submit" className="btn"> {loading && <FaSpinner className="animate-spin" />} Submit </button>
                        </div>
                    </form> :
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Confirm Order</h4>
                            </div>
                            <div className="modal-body">
                                <p>{`Are you sure you want to place your order?`}</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleCancel}>
                                    No
                                </button>
                                <button className="btn" onClick={handleConfirmSubmit}>
                                    {loading && <FaSpinner className="animate-spin" />} Yes
                                </button>
                            </div>
                        </div>}
                </div>
            </div>
            <ConfirmModal
                show={showConfirm}
                title="Exit!"
                message={`Are you sure you want to exit?`}
                onConfirm={() => logoutAccount()}
                onConfirmLabel="Yes"
                onCancel={handleExitCancel}
            />
        </div>
    </>
    )
}