import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";

export default function Account() {
    const dispatch = useDispatch()
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);

    const onClose = () => {
        navigate(-1);
    }

    return (
        <div className='bill-details'>
            <button type="button" className="btn-close" onClick={onClose}></button>
            <h2 className='text-start'>Hello, {user.fullname ? user.fullname : 'User'}</h2>
            <h4 className='text-start'><span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v124q18 7 29 22t11 34v80q0 19-11 34t-29 22v404q0 33-23.5 56.5T680-40H280Zm0-80h400v-720H280v720Zm0 0v-720 720Zm200-600q17 0 28.5-11.5T520-760q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760q0 17 11.5 28.5T480-720Z" /></svg> {user.mobile}</span></h4>
            <hr />
            <h3 className='text-start'>Your Orders</h3>

        </div>
    )
}