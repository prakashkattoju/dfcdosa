import React, { useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import priceDisplay from '../util/priceDisplay';
import { format } from 'date-fns'

export default function OrderDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(location.state ? location.state : [])

    async function connectAndPrint() {
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: "BT" }], // Change to match your printer name
                optionalServices: ["0000ffe0-0000-1000-8000-00805f9b34fb"], // common for ESC/POS BLE printers
            });

            const server = await device.gatt.connect();

            const service = await server.getPrimaryService(
                "0000ffe0-0000-1000-8000-00805f9b34fb"
            );
            const characteristic = await service.getCharacteristic(
                "0000ffe1-0000-1000-8000-00805f9b34fb"
            );

            const encoder = new TextEncoder();
            const data = encoder.encode("Hello from React Web Bluetooth!\n\n");

            const CHUNK_SIZE = 180;
            for (let i = 0; i < data.length; i += CHUNK_SIZE) {
                const chunk = data.slice(i, i + CHUNK_SIZE);
                await characteristic.writeValue(chunk);
            }

            alert("Print command sent successfully!");
        } catch (error) {
            console.error("Print failed:", error);
            alert("Failed to print: " + error.message);
        }
    }

    return (
        <>
            <div id="orderDetails" className="bill-details">
                <table>
                    <thead>
                        <tr className='token'><th className='pb-0' colSpan={2}>Token No</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{orderDetails.token_num}</th></tr>
                        <tr><th colSpan={5} className='sep pb-0'></th></tr>
                        <tr><th className='pb-0' colSpan={2}>Date</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{format(new Date(orderDetails.dcreated_on), 'dd-MM-yyyy')}</th></tr>
                        <tr><th colSpan={5} className='sep pb-0'></th></tr>
                        <tr><th className='pb-0' colSpan={2}>Name</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{orderDetails.uname}</th></tr>
                        <tr><th className='pb-0' colSpan={2}>Mobile Number</th><th className='pb-0'>:</th><th className='pb-0' colSpan={2}>{orderDetails.mobile}</th></tr>
                        <tr><th colSpan={5} className='sep pb-0'></th></tr>
                        <tr><th className='pid'>#</th><th className='pname'>Items</th><th>Qty</th><th>I.Rs.</th><th>Rs.</th></tr>
                    </thead>
                    <tbody>
                        {orderDetails.items?.map((item, index) => <tr key={index}><td className='pid'>{item.product_id}</td><td className='pname'>{item.title}</td><td>{item.quantity}</td><td>{item.unit_price}</td><td>{item.quantity * item.unit_price}</td></tr>)}
                        <tr><td className='sep' colSpan={5}></td></tr>
                        <tr><td colSpan={2}>Items Total</td><td>{orderDetails.total_quantity}</td><td colSpan={2}></td></tr>
                        <tr><td colSpan={2}>Amount</td><td colSpan={2}></td><td>{orderDetails.total_price}</td></tr>
                        <tr><td className='sep' colSpan={5}></td></tr>
                        <tr><td colSpan={2}>Total Amount</td><td className='text-end' colSpan={3}>{priceDisplay(orderDetails.total_price)}</td></tr>
                    </tbody>
                </table>
            </div>
            {orderDetails.status == 0 && <div className="cart-summary mb-3">
                <div className="noitems">Change order status, if Completed</div>
                <button type='button' className="ftotal"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="currentColor"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg></button>
            </div>}
            <div className="cart-summary">
                <div className="noitems">Print the order details</div>
                <button onClick={connectAndPrint} className="ftotal"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="currentColor"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z" /></svg></button>
            </div>
            {/* <div className="addmore">
                <p className='mt-3' onClick={() => navigate('/')}>Back to Orders</p>
            </div> */}
        </>
    )
}