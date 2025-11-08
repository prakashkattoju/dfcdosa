import { useEffect, useState, useCallback } from 'react'
import { GetProducts, GetCategories, ChangeProductStatus } from '../services/Productsservices';
import priceDisplay from '../util/priceDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import ConfirmModal from '../components/ConfirmModal';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [queryString, setQueryString] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [showConfirm, setShowConfirm] = useState({
    id: null,
    title: null,
    show: false
  });

  const fetchproducts = useCallback(async () => {
    try {
      const productsdata = await GetProducts();
      setProducts(productsdata);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }, []);

  const fetchcategories = useCallback(async () => {
    setLoading(true)
    try {
      const categoriesdata = await GetCategories();
      setCategories(categoriesdata);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchproducts();
    fetchcategories();
  }, [fetchproducts, fetchcategories]);

  const updateProduct = (product_id, newData) => {
    setSearchResults(prevItems =>
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
    if (text === '') {
      if (activeCategory === null) {
        setSearchResults([])
        setNotFound(false)
      } else {
        const filteredData = products.filter((item) => {
          return item.category_id === activeCategory;
        });
        filteredData.length > 0 ? setSearchResults(filteredData) : setNotFound(true)
      }
    } else {
      if (activeCategory === null) {
        const filteredData = products.filter((item) => {
          return item.title.toLowerCase().includes(text.toLowerCase());
        });
        filteredData.length > 0 ? setSearchResults(filteredData) : setNotFound(true)
      } else {
        const filteredData = searchResults.filter((item) => {
          return item.title.toLowerCase().includes(text.toLowerCase());
        });
        filteredData.length > 0 ? setSearchResults(filteredData) : setNotFound(true)
      }
    }
    setQueryString(text)
  }

  const setCategoryResultsFunc = (category_id) => {
    const filteredData = products.filter((item) => {
      return item.category_id === category_id;
    });
    filteredData.length > 0 ? setSearchResults(filteredData) : setNotFound(true)
    filteredData.length > 0 && setActiveCategory(category_id)
  }

  const clearSearch = () => {
    if (activeCategory === null) {
      setSearchResults([])
      setNotFound(false)
    }
    setQueryString('')
  }

  const clearCategorySearch = () => {
    if (queryString === "") {
      setSearchResults([])
      setNotFound(false)
    }
    setActiveCategory(null)
  }

  //console.log("searchResults", searchResults)

  const getCategoryTitle = (activeCategory) => {
    const category = categories.find(el => el.category_id == activeCategory);
    return category.title;
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

  const handleConfirmDelete = (id) => {
    document.activeElement?.blur();
    setShowConfirm({
      id: null,
      title: null,
      show: false
    });
  };

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
      <div className="search-form">
        <div className="form-group">
          <input className="form-control" type="text" value={queryString} onChange={(e) => setSearchResultsFunc(e.target.value)} placeholder="Search here..." autoComplete="off" disabled={loading} />
          {((searchResults.length > 0 || notFound) && queryString !== "") && <span className='clear-search' onClick={clearSearch}><i className="fa-solid fa-xmark"></i></span>}
        </div>
      </div>
      {loading ? <div className="list"><p className='text-center'>Loading...</p></div> : <>
        {activeCategory !== null && <div className="list sticky"><div className="item-category active">
          <span><span>{getCategoryTitle(activeCategory)}</span><span className='clear-search' onClick={clearCategorySearch}><i className="fa-solid fa-xmark"></i></span></span>
        </div></div>}
        <div className="list">
          {searchResults.length > 0 ? <div className="item-list">{
            searchResults.map((item, index) => <div key={index} className="item">
              <div className='item-inner'>
                {/* <div className="img"><img width="100" height="100" src="/rava-dosa-recipe-1-100x100.jpg" className="attachment-100x100 size-100x100" alt="" /></div> */}
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
                        <button className="edit"><i className="fa-solid fa-pen-to-square"></i></button>
                        <button className="edit" onClick={() => handleDeleteClick(item.product_id, item.title)}><i className="fa-solid fa-trash"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>)
          }</div> : categories.length > 0 ? categories.map((item, index) => <div key={index} className="item-category" onClick={() => setCategoryResultsFunc(item.category_id)}><span><span>{item.title}</span><i className="fa-solid fa-chevron-right"></i></span>
          </div>) : <p className='text-center'>No Dosa Categories</p>
          }
        </div></>}
      <ConfirmModal
        show={showConfirm.show}
        title="Delete Confirmation"
        message={`Are you sure you want to delete "${showConfirm.title}"?`}
        onConfirm={() => handleConfirmDelete(showConfirm.id)}
        onCancel={handleCancel}
      />
    </div>
  )
}
