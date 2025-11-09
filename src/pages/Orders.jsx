import React, { useState } from 'react'

export default function Orders() {

  const [orderDetails, setOrderDetails] = useState(false)

  return (
    <>
      {!orderDetails ? <div>
        <div className="search-form">
          <form action="">
            <div className="form-group">
              <input className="form-control" type="search" name="search" placeholder="Search by mobile..." autoComplete="off" />
            </div>
          </form>
        </div>
        <ul className="nav nav-pills mb-3 justify-content-center" id="orders-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="orders-pending-tab" data-bs-toggle="pill" data-bs-target="#orders-pending" type="button" role="tab" aria-controls="orders-pending" aria-selected="true">Pending</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="orders-completed-tab" data-bs-toggle="pill" data-bs-target="#orders-completed" type="button" role="tab" aria-controls="orders-completed" aria-selected="false">Completed</button>
          </li>
        </ul>
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
                  <tr>
                    <th scope="row"><div className="tokennum" onClick={() => setOrderDetails(true)}>2</div></th>
                    <td>Ravi</td>
                    <td>121212121</td>
                  </tr>
                  <tr>
                    <th scope="row"><div className="tokennum" onClick={() => setOrderDetails(true)}>3</div></th>
                    <td>Ravi</td>
                    <td>121212121</td>
                  </tr>
                  <tr>
                    <th scope="row"><div className="tokennum" onClick={() => setOrderDetails(true)}>4</div></th>
                    <td>Ravi</td>
                    <td>121212121</td>
                  </tr>
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
                  <tr>
                    <th scope="row"><div className="tokennum" onClick={() => setOrderDetails(true)}>1</div></th>
                    <td>Ravi</td>
                    <td>121212121</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> :
        <div>
          <div id="orderDetails" className="tbl-cart show-cart show">
            <div className="token-num"><div>Token No</div><span className="num">3</span></div>
            <div className="cart-item">
              <div className="cart-trow">
                <div>
                  <div className="pname">Ravi</div>
                </div>
                <div className="pdetails"><i className="fa-solid fa-mobile-screen"></i> 121212121</div>
              </div>
              <div className="cart-brow">
                <div className="pname"><span className="pid">1</span> PLAIN DOSA</div>
                <div className='d-flex gap-3'>
                  <div className="input-group">2</div>
                  <div>&times;</div>
                  <div className='pprice'>30.00</div>
                </div>
                <div className="pprice">60.00</div>
              </div>
              <div className="cart-brow">
                <div className="pname"><span className="pid">2</span> ONION DOSA</div>
                <div className='d-flex gap-3'>
                  <div className="input-group">2</div>
                  <div>&times;</div>
                  <div className='pprice'>40.00</div>
                </div>
                <div className="pprice">80.00</div>
              </div>
            </div>
          </div>
          <div className="cart-summary">
            <div className="noitems">No. Items: 4</div>
            <div className="ftotal">Rs. 140.00</div>
          </div>
          <div className="addmore">
            <div><p>Change order status, if Completed</p><button type="button" className="btn toggle">Complete</button></div>
            <p className='mt-3' onClick={() => setOrderDetails(false)}>Back to Orders</p>
          </div>
        </div>}
    </>
  )
}