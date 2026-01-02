import { useRef, useEffect, useState, useCallback } from 'react'
import { GetProducts, GetCategories } from '../services/Productsservices';
import priceDisplay from '../util/priceDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { logOut } from '../store/authSlice';
import { addToCart, incrementQuantity, decrementQuantity } from '../store/cartSlice';
import { useLocation, useNavigate, Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import ConfirmModal from '../components/ConfirmModal';

export default function Home() {

    const cart = useSelector((state) => state.cart.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [categoryResults, setCategoryResults] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [queryString, setQueryString] = useState(location.state ? location.state.queryString : '');
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubCategory, setActiveSubCategory] = useState(null);

    const headerRef = useRef(null);
    const searchInputRef = useRef(null);
    const [height, setHeaderHeight] = useState(0);

    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const updateHeight = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);

        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    const fetchproducts = useCallback(async () => {
        try {
            const productsdata = await GetProducts();
            const statusData = productsdata.filter((item) => {
                return item.status == 1;
            });
            setProducts(statusData);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    }, []);

    const fetchcategories = useCallback(async () => {
        setLoading(true)
        try {

            const productsdata = await GetProducts();
            const products = productsdata.filter((item) => item.status == 1);
            const categoriesdata = await GetCategories();
            const statusData = categoriesdata.filter((item) => item.status == 1);
            setCategories(statusData);

            const category_id = statusData[0].category_id

            const categoryObj = statusData.find((item) => item?.category_id === category_id);
            setSubCategories(categoryObj.sub_cats)

            const filteredData = products.filter((item) => item.category_id === category_id);

            filteredData.length > 0 ? setCategoryResults(filteredData) : setNotFound(true)
            filteredData.length > 0 && setActiveCategory(category_id)

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

    //console.log("searchResults", searchResults)

    const backBtn = () => {
        navigate('/')
    }

    const setSearchResultsFunc = (text) => {
        if (text !== '') {
            const filteredData = products.filter((item) => {
                return item.title.toLowerCase().includes(text.toLowerCase());
            });
            filteredData.length > 0 ? setSearchResults(filteredData) : setNotFound(true)
        } else {
            setSearchResults(categoryResults)
        }
        setQueryString(text)
    }

    /* useEffect(() => {
        // Only focus if there's an existing search term
        if (queryString !== "" && searchInputRef.current) {
            searchInputRef.current?.focus();
        }
        setSearchResultsFunc(queryString)
    }, [location.pathname]); */

    const setCategoryResultsFunc = (category_id) => {

        setQueryString('')
        setSearchResults([])

        const categoryObj = categories.find((item) => item?.category_id === category_id);
        setSubCategories(categoryObj.sub_cats)

        const filteredData = products.filter((item) => {
            return item.category_id === category_id;
        });
        filteredData.length > 0 ? setCategoryResults(filteredData) : setNotFound(true)
        filteredData.length > 0 && setActiveCategory(category_id)
    }

    const setSubCategoryResultsFunc = (sub_cat_id) => {

        const filteredData = products.filter((item) => {
            return item.sub_cat_id === sub_cat_id;
        });
        filteredData.length > 0 ? setSearchResults(filteredData) : setNotFound(true)
        filteredData.length > 0 && setActiveSubCategory(sub_cat_id)
    }

    const clearSearch = () => {
        setSearchResults(categoryResults)
        setQueryString('')
    }

    const checkForAdd = (product_id) => {
        const found = cart.some(el => el.product_id === product_id);
        return found;
    }
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

    const addOptToCart = (opt) => {
        dispatch(addToCart(opt));
    }
    const decrement = (product_id) => {
        dispatch(decrementQuantity(product_id));
    }
    const increment = (product_id) => {
        dispatch(incrementQuantity(product_id));
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

    const handleCancel = () => {
        document.activeElement?.blur();
        setShowConfirm(false);
    };

    const resultItems = searchResults.length > 0 ? searchResults : categoryResults.length > 0 ? categoryResults : products

    return (
        <>
            <header ref={headerRef} className="site-header">
                <div className='search-area d-flex gap-2 align-items-center justify-content-between'>
                    {/* <button className='icon-btn' onClick={backBtn}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" /></svg>
                    </button> */}
                    <div className="search-form">
                        <div className="form-group">
                            <input ref={searchInputRef} className="form-control" type="text" value={queryString} onChange={(e) => setSearchResultsFunc(e.target.value)} placeholder="Search here..." autoComplete="off" disabled={loading} />
                            {((searchResults.length > 0 || notFound) && queryString !== "") ? <span className='search-icon' onClick={clearSearch}><i className="fa-solid fa-xmark"></i></span> : <span className='search-icon'><i className="fa-solid fa-search"></i></span>}
                        </div>
                    </div>
                    <button className='icon-btn' onClick={() => navigate('/account')}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-480q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM192-192v-96q0-23 12.5-43.5T239-366q55-32 116.29-49 61.29-17 124.5-17t124.71 17Q666-398 721-366q22 13 34.5 34t12.5 44v96H192Zm72-72h432v-24q0-5.18-3.03-9.41-3.02-4.24-7.97-6.59-46-28-98-42t-107-14q-55 0-107 14t-98 42q-5 4-8 7.72-3 3.73-3 8.28v24Zm216.21-288Q510-552 531-573.21t21-51Q552-654 530.79-675t-51-21Q450-696 429-674.79t-21 51Q408-594 429.21-573t51 21Zm-.21-72Zm0 360Z" /></svg></button>

                    <button className='icon-btn' onClick={() => setShowConfirm(true)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" /></svg></button>
                </div>
                {categories.length > 0 ? <div className="scroll-categories">
                    {categories.map((item, index) => item.status === "1" && <div key={index} className={`category ${activeCategory === item.category_id ? "active" : ""}`} onClick={() => setCategoryResultsFunc(item.category_id)}><img className='img' width="100" height="100" src="/dosa.webp" alt={item.title} /><span className='text'>{item.title}</span>
                    </div>)
                    }
                </div> : <div className="scroll-categories">{Array.from({ length: 5 }).map((_, i) => (
                    <div className="category" key={i}>
                        <div className="skeleton img"></div>
                        <div className="skeleton text"></div>
                    </div>
                ))}</div>}
            </header>
            <>
                {loading ? <div className="list"><div className='loading'>Loading...</div></div> : <>
                    {/* activeCategory !== null && <div className="list sub-categories">
                        {subCategories.length > 0 && subCategories.map((item, index) => item.status === "1" && <div onClick={() => setSubCategoryResultsFunc(item.sub_cat_id)} key={index} className={`sub-category ${item.sub_cat_id === activeSubCategory && 'active'}`}>{item.title}</div>)}
                    </div> */}
                    <div style={{ height: `calc(100dvh - ${cart.length > 0 ? (height + 64) : height}px)` }} className="list scroll">{resultItems.length > 0 ?
                        <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }} className="item-list">{
                            resultItems.map((item, index) => <div key={index} className="item">
                                <div className='item-inner'>
                                    {/* <div className="img"><img width="100" height="100" src="/dosa.webp" alt={item.title} /></div> */}
                                    <div className="meta">
                                        <h2>{item.title}</h2>
                                        <div className="meta-inner">
                                            <div className="meta-info">
                                                <div className="price">{priceDisplay(parseInt(item.unit_price))}</div>
                                                <span className="itemid"># {item.product_id}</span>
                                            </div>
                                            <div className="cart-action">
                                                {checkForAdd(parseInt(item.product_id)) ?
                                                    (<div className="opt">
                                                        <button className="minus" onClick={() => decrement(parseInt(item.product_id))}><i className="fa-solid fa-minus"></i></button>
                                                        <div className="qty">{getQuantity(parseInt(item.product_id))}</div>
                                                        <button className="plus" onClick={() => increment(parseInt(item.product_id))}><i className="fa-solid fa-plus"></i></button>
                                                    </div>) :
                                                    <button className="btnAddAction init" onClick={() => addOptToCart({
                                                        'product_id': parseInt(item.product_id),
                                                        'title': item.title,
                                                        'unit_price': parseInt(item.unit_price),
                                                    })}>Add <i className="fa-solid fa-plus"></i></button>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                        </PerfectScrollbar> : <p className='text-center'>No Dosa Items</p>}
                    </div></>}
            </>
            {cart.length > 0 && <div className="cart-summary-badge">
                <div className="cart-bottom-bar"><strong className="total-count">{getCartQuantity()}</strong> | <strong className="total-cart">{getCartAmount()}</strong></div>
                <div className="continue">
                    <button className="btn toggle" onClick={() => navigate("/cart", { replace: true })}>Continue</button>
                </div>
            </div>}

            <ConfirmModal
                show={showConfirm}
                title="Exit!"
                message={`Are you sure you want to exit?`}
                onConfirm={() => logoutAccount()}
                onConfirmLabel="Yes"
                onCancel={handleCancel}
            />
        </>
    )
}