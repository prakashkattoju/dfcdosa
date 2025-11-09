import { useRef, useEffect, useState } from 'react'
import priceDisplay from '../util/priceDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { incrementQuantity, decrementQuantity, clearCart } from '../store/cartSlice';
import { verifyCartItems } from '../store/cartThunks';
import { useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";

export default function Cart() {

    const cart = useSelector((state) => state.cart.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [removedItems, setRemovedItems] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleVerify = async () => {
            setLoading(true)
            const { availableItems, removedItems } = await dispatch(verifyCartItems()).unwrap();
            if (removedItems.length > 0) {
                setRemovedItems(removedItems)
                
            }
            setLoading(false)
        }
        handleVerify()
    }, []);

    const modalRef = useRef();

    const openModal = () => {
        const modal = new Modal(modalRef.current);
        modal.show();
    };

    const closeModal = () => {
        document.activeElement?.blur();
        const modal = Modal.getInstance(modalRef.current);
        modal.hide();
        dispatch(clearCart());
        navigate("/", { replace: true })
    };

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

    return (
        loading ? <div className="list"><p className='text-center'>Loading...</p></div> : <>
            {removedItems.length > 0 && <div className="cart-summary-review removed">
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
            </div>}
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
                            <button className="btn" onClick={openModal}>Submit</button>
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
                className="dfc-modal modal fade"
                id="cartModal"
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
                            <h4 className="modal-title">Order Details</h4>

                        </div>
                        <div className="modal-body">
                            <h4 className="mb-3 text-center">Please show Token No. at bill counter.<br />Thank you.</h4>
                            <div className="tbl-cart">
                                <div>
                                    <div>
                                        <div className="token-num"><div>Token No</div><span className="num">10</span></div>

                                        {cart.map((item, index) => <div key={index} className="cart-item">
                                            <div className="cart-trow">
                                                <div className="pname alt">{item.title}</div>
                                            </div>
                                            <div className="cart-brow">
                                                <div className='pcode'>{`# ${item.product_id}`}</div>
                                                <div className="input-group alt">
                                                    <div>{getQuantity(parseInt(item.product_id))}</div>
                                                    <div>&times;</div>
                                                    <div>{priceDisplay(parseInt(item.unit_price)).replace("₹", "")}</div>
                                                    <div>=</div>
                                                    <div>{getCartItemsAmount(item).replace("₹", "")}</div>
                                                </div>
                                            </div>
                                        </div>)}
                                    </div>
                                    <div className="cart-summary"><div className="noitems">No. Items: {getCartQuantity()}</div><div className="ftotal">{getCartAmount()}</div></div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={closeModal}>
                                Close
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}