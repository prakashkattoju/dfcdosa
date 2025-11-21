import { useEffect, useState, useCallback } from 'react'
import { GetProducts, GetCategories, ChangeProductStatus, DeleteProductByID } from '../services/Productsservices';
import priceDisplay from '../util/priceDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import ConfirmModal from '../components/ConfirmModal';
import AlertModal from '../components/AlertModal';

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [queryString, setQueryString] = useState('');
  const [showConfirm, setShowConfirm] = useState({
    id: null,
    title: null,
    show: false
  });

  const [showAlert, setShowAlert] = useState({
    title: null,
    message: null,
    show: false
  });

  const fetchproducts = useCallback(async () => {
    setLoading(true)
    try {
      const productsdata = await GetProducts();
      setProducts(productsdata);
      //console.log("productsdata", productsdata)
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchproducts();
  }, [fetchproducts]);

  const updateProduct = (product_id, newData) => {
    setSearchResults(prevItems =>
      prevItems.map(item =>
        item.product_id === product_id ? { ...item, ...newData } : item
      )
    );
    setProducts(prevItems =>
      prevItems.map(item =>
        item.product_id === product_id ? { ...item, ...newData } : item
      )
    );
  };

  const handleChangeStatus = async (product_id, status) => {
    //console.log("status", status)
    try {
      const res = await ChangeProductStatus({
        product_id: product_id,
        status: status
      });
      if (res.status) {
        updateProduct(product_id, { status: !status })
      }
    } catch (error) {
      console.error("Failed to change status:", error);
    }
  }

  const setSearchResultsFunc = (text) => {
    if (text !== '') {
      const filteredData = products.filter((item) => {
        return item.title.toLowerCase().includes(text.toLowerCase());
      });
      filteredData.length > 0 ? setSearchResults(filteredData) : setNotFound(true)
    } else {
      setSearchResults(products)
    }
    setQueryString(text)
  }

  const clearSearch = () => {
    setSearchResults(products)
    setNotFound(false)
    setQueryString('')
  }

  const toBoolean = (value) => {
    return value === "1" || value === 1 || value === true;
  };

  const handleDeleteClick = (product_id, title) => {
    setShowConfirm({
      id: product_id,
      title: title,
      show: true
    });
  };

  const handleConfirmDelete = async (product_id) => {
    try {
      const data = await DeleteProductByID(product_id);
      if (data.status) {
        document.activeElement?.blur();
        setShowConfirm({
          id: null,
          title: null,
          show: false
        });
        setShowAlert({
          title: 'Deleted!',
          message: data.message,
          show: true
        })
      }
    } catch (error) {
      console.error(error.message || "An error occurred.")
    } finally {
      document.activeElement?.blur();
      setShowConfirm({
        id: null,
        title: null,
        show: false
      });
    }
  }

  const handleCancel = () => {
    document.activeElement?.blur();
    setShowConfirm({
      id: null,
      title: null,
      show: false
    });
  };

  return (
    <div className="menu-items">
      <div className="search-form d-flex align-items-center gap-2">
        <div className="form-group">
          <input className="form-control" type="text" value={queryString} onChange={(e) => setSearchResultsFunc(e.target.value)} placeholder="Search here..." autoComplete="off" disabled={loading} />
          {((searchResults.length > 0 || notFound) && queryString !== "") && <span className='search-icon' onClick={clearSearch}><i className="fa-solid fa-xmark"></i></span>}
        </div>
      </div>
      {loading ? <div className="list"><p className='text-center'>Loading...</p></div> : <>
        <div className="list">
          {searchResults.length > 0 ? <div className="item-list">{
            searchResults.map((item, index) => <div key={index} className="item">
              <div className='item-inner'>
                <div className='itemid'>{item.product_id}</div>
                <div className="meta">
                  <h2>{item.title}</h2>
                  <div className="meta-inner">
                    <div className="meta-info">
                      <div className="price">{priceDisplay(parseInt(item.unit_price))}</div>
                      <span className="itemid"># {item.product_id}</span>
                    </div>
                    <div className="cart-action">
                      <div className="opt status">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={toBoolean(item.status)}
                            onChange={() => handleChangeStatus(item.product_id, toBoolean(item.status))}
                          />
                          <span className="slider"></span>
                          <span className="label-text">{toBoolean(item.status) ? "YES" : "NO"}</span>
                        </label>

                        {/* <button className="edit" onClick={() => navigate('/products', {state: {product: item}})}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg></button>

                        <button className="edit" onClick={() => handleDeleteClick(item.product_id, item.title)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>)
          }</div> : products.length > 0 ? <div className="item-list">{
            products.map((item, index) => <div key={index} className="item">
              <div className='item-inner'>
                <div className='itemid'>{item.product_id}</div>
                <div className="meta">
                  <h2>{item.title}</h2>
                  <div className="meta-inner">
                    <div className="meta-info">
                      <div className="price">{priceDisplay(parseInt(item.unit_price))}</div>
                      <span className="itemid"># {item.product_id}</span>
                    </div>
                    <div className="cart-action">
                      <div className="opt status">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={toBoolean(item.status)}
                            onChange={() => handleChangeStatus(item.product_id, toBoolean(item.status))}
                          />
                          <span className="slider"></span>
                          <span className="label-text">{toBoolean(item.status) ? "YES" : "NO"}</span>
                        </label>

                        {/* <button className="edit" onClick={() => navigate('/products', {state: {product: item}})}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg></button>

                        <button className="edit" onClick={() => handleDeleteClick(item.product_id, item.title)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>)
          }</div> : <p className='text-center'>No Dosa Categories</p>
          }
        </div></>}
      <ConfirmModal
        show={showConfirm.show}
        title="Delete Confirmation"
        message={`Are you sure you want to delete "${showConfirm.title}"?`}
        onConfirm={() => handleConfirmDelete(showConfirm.id)}
        onConfirmLabel="Delete"
        onCancel={handleCancel}
      />
      <AlertModal
        show={showAlert.show}
        title={showAlert.title}
        message={showAlert.message || `Product deleted successfully`}
        onClose={() => {
          setShowAlert({
            title: null,
            message: null,
            show: false
          })
          window.location.reload(true);
        }}
      />
    </div>
  )
}
