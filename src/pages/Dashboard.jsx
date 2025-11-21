import React, { useState, useEffect, useCallback } from 'react'
import { Calendar } from 'primereact/calendar';
import { format } from 'date-fns'
import { GetOrders } from '../services/Billservices';
import { useNavigate, useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([])
  const [searchActive, setSearchActive] = useState(false)
  const [activeStatus, setActiveStatus] = useState(0);
  const [activeDate, setActiveDate] = useState(location.state ? new Date(location.state) : new Date());
  const [activeToken, setActiveToken] = useState('')
  const [activeMobile, setActiveMobile] = useState('')

  useEffect(() => {
    const tabs = document.querySelectorAll('#orders-tab button[data-bs-toggle="pill"]');
    tabs.forEach((tab, index) => {
      tab.addEventListener("shown.bs.tab", () => {
        setActiveStatus(index);
      });
    });
    return () => {
      tabs.forEach((tab) =>
        tab.removeEventListener("shown.bs.tab", () => { })
      );
    };
  }, []);

  const handleSearch = () => {
    setSearchActive(true)
    fetchOrders(activeToken, activeMobile);
  }
  const handleSearchCancel = () => {
    setSearchActive(false)
    setActiveToken('')
    setActiveMobile('')
    fetchOrders(activeToken, activeMobile);
  }

  const fetchOrders = useCallback(async (activeToken = "", activeMobile = "") => {

    const searchData = {
      status: activeStatus,
      dcreated_on: format(new Date(activeDate), 'yyyy-MM-dd'),
      token_num: activeToken,
      mobile: activeMobile
    }
    try {
      setLoading(true)
      const res = await GetOrders(searchData);
      console.log("Orders", res)
      setOrders(res);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false)
    }
  }, [activeStatus, activeDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, activeStatus, activeDate]);

  return (
    <>
      <div className="search-form">
        <div className="form-group d-flex gap-2">
          <input className="form-control" type="number" value={activeToken} onChange={(e) => setActiveToken(e.target.value)} placeholder="Token..." autoComplete="off" />
          <input className="form-control" type="number" value={activeMobile} onChange={(e) => setActiveMobile(e.target.value)} placeholder="Mobile..." autoComplete="off" maxLength={10} />
          {!searchActive ? <button disabled={activeMobile === "" && activeToken === ""} onClick={() => handleSearch()} type='button' className='form-control btn'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg></button> : <button onClick={() => handleSearchCancel()} type='button' className='form-control btn'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg></button>}
        </div>
      </div>
      <div className='container my-2'>
        <div className='row justify-content-between align-items-center'>
          <div className="col-5 mb-0">
            <div className="form-group">
              <Calendar
                value={activeDate}
                onChange={(e) => setActiveDate(e.value)}
                className="active-date"
                inputClassName="form-control"
                panelClassName="active-date-panel"
                placeholder="Selecct Date"
                showIcon
                maxDate={new Date()}
                readOnlyInput={true}
                dateFormat="dd-M-yy"
              />
            </div>
          </div>
          <ul className="col-7 nav nav-pills justify-content-end" id="orders-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="orders-pending-tab" data-bs-toggle="pill" data-bs-target="#orders-pending" type="button" role="tab" aria-controls="orders-pending" aria-selected="true">Pending</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="orders-completed-tab" data-bs-toggle="pill" data-bs-target="#orders-completed" type="button" role="tab" aria-controls="orders-completed" aria-selected="false">Completed</button>
            </li>
          </ul>
        </div>
      </div>
      <div className="tab-content" id="orders-tabContent">
        <div className="tab-pane fade show active" id="orders-pending" role="tabpanel" aria-labelledby="orders-pending-tab">
          <div className="table-responsive">
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th scope="col">TKN</th>
                  <th scope="col">Name</th>
                  <th scope="col">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr>
                  <th colSpan={3} scope="row">Loading...</th>
                </tr> : orders?.length > 0 ? orders.map((item, index) => {
                  return item.status == 0 && <tr key={index} onClick={() => navigate('/order-details', { state: item })}>
                    <th scope="row"><div className="tokennum">{item.token_num}</div></th>
                    <td>{item.uname}</td>
                    <td>{item.mobile}</td>
                  </tr>
                }) : <tr><th colSpan={3} scope="row">No Pending Orders are avaliable</th></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tab-pane fade" id="orders-completed" role="tabpanel" aria-labelledby="orders-completed-tab">
          <div className="table-responsive">
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th scope="col">TKN</th>
                  <th scope="col">Name</th>
                  <th scope="col">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr>
                  <th colSpan={3} scope="row">Loading...</th>
                </tr> : orders?.length > 0 ? orders.map((item, index) => {
                  return item.status == 1 && <tr key={index} onClick={() => navigate('/order-details', { state: item })}>
                    <th scope="row"><div className="tokennum">{item.token_num}</div></th>
                    <td>{item.uname}</td>
                    <td>{item.mobile}</td>
                  </tr>
                }) : <tr><th colSpan={3} scope="row">No Completed Orders are avaliable</th></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}