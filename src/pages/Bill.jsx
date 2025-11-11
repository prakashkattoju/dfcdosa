import { useState } from 'react'
import priceDisplay from '../util/priceDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { useNavigate } from "react-router-dom";
import { TbDashboardFilled } from 'react-icons/tb';

export default function Bill() {
    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart.cart);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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

    const onClose = () => {
        dispatch(clearCart());
        navigate('/')
    }

    return (
        <div className='bill-details'>
            <div className='d-flex mb-4'><h4 className='bill-ins'>Please show order details to bill counter</h4><button type="button" className="btn-close ms-5" onClick={onClose}></button></div>
            <table>
                <thead>
                    <tr><th className='pb-0' colSpan={2}>Date</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{new Date().toLocaleDateString('en-IN')}</th></tr>
                    <tr><th className='pb-0' colSpan={2}>Token No</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>1924</th></tr>
                    <tr><th colSpan={5} className='sep pb-0'></th></tr>
                    <tr><th className='pid'>#</th><th className='pname'>Items</th><th>Qty</th><th>I.Rs.</th><th>Rs.</th></tr>
                </thead>
                <tbody>
                    {cart.map((item, index) => <tr key={index}><td className='pid'>{item.product_id}</td><td className='pname'>{item.title}</td><td>{getQuantity(parseInt(item.product_id))}</td><td>{priceDisplay(parseInt(item.unit_price)).replace("₹", "")}</td><td>{getCartItemsAmount(item).replace("₹", "")}</td></tr>)}
                    <tr><td className='sep' colSpan={5}></td></tr>
                    <tr><td colSpan={2}>Items Total</td><td>{getCartQuantity()}</td><td colSpan={2}></td></tr>
                    <tr><td colSpan={2}>Amount</td><td colSpan={2}></td><td>{getCartAmount().replace("₹", "")}</td></tr>
                    <tr><td className='sep' colSpan={5}></td></tr>
                    <tr><td colSpan={2}>Total Amount</td><td colSpan={2}></td><td>{getCartAmount().replace("₹", "")}</td></tr>
                    <tr><td className='sep' colSpan={5}></td></tr>
                    <tr><td colSpan={5}><h4 className='pt-4 text-center'>*** THANK YOU - VISIT AGAIN ***</h4></td></tr>
                </tbody>
            </table>
        </div>
    )
}