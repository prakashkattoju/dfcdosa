import { useEffect, useState } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import priceDisplay from '../util/priceDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { incrementQuantity, decrementQuantity } from '../store/cartSlice';
import { setUserDetails } from '../store/userSlice';
//import { verifyCartItems } from '../store/cartThunks';
import { useNavigate } from "react-router-dom";
import { decodeToken } from 'react-jwt';
import { CreateBill } from '../services/Billservices';
import { UpdateUserName } from '../services/Userservices';

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
            } finally {
                setLoading(false)
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

    const handleCancel = () => {
        document.activeElement?.blur();
        setShowPromptModal(false);
    };

    const handleConfirmSubmit = async () => {
        const cartdata = {
            total_quantity: getCartQuantity(),
            total_price: cart.reduce((total, item) => total + item.unit_price * item.quantity, 0),
            items: cart
        };
        try {
            setLoading(true)
            const data = await CreateBill(cartdata);
            if (data.status) {
                handleCancel();
                navigate('/bill', { state: { token_num: data.token_num } })
            }
        } catch (error) {
            console.error("Error", error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        loading ? <div className="list"><p className='text-center'>Loading...</p></div> : <>
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
                    <div className="cart-summary-review">
                        <div className="tbl-cart show-cart">
                            <div>
                                {cart.map((item, index) => <div key={index} className="cart-item">
                                    <div className="cart-trow">
                                        <div className="pname">{item.title}</div>
                                    </div>
                                    <div className="cart-brow">
                                        <div className="input-group">
                                            <div className="pprice">{priceDisplay(parseInt(item.unit_price)).replace("₹", "")}</div>
                                            <div className="opt">
                                                <button className="minus-item" onClick={() => decrement(item.product_id)}><i className="fa-solid fa-minus"></i></button>
                                                <div className="qty">{getQuantity(parseInt(item.product_id))}</div>
                                                <button className="plus-item" onClick={() => increment(item.product_id)}><i className="fa-solid fa-plus"></i></button>
                                            </div>
                                            <div>{getCartItemsAmount(item).replace("₹", "")}</div>
                                        </div>
                                    </div>
                                </div>)}
                            </div>
                            {/* <div className="cart-summary">
                            <div className="noitems">No. Items: {getCartQuantity()}</div>
                            <div className="ftotal">{getCartAmount()}</div> 
                        </div> */}
                            <div className="addmore"><p>If you want add more items.</p><button type="button" className="btn toggle" onClick={() => navigate("/", { replace: true })}>Add More</button></div>
                        </div>
                    </div>
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
        </>
    )
}