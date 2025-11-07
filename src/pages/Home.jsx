import { useEffect, useState, useCallback } from 'react'
import { GetProducts } from '../services/Productsservices';
import priceDisplay from '../util/priceDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementQuantity, decrementQuantity, removeFromCart } from '../store/cartSlice';
import { decodeToken } from 'react-jwt';
import { useNavigate } from "react-router-dom";

export default function Home() {

    const cart = useSelector((state) => state.cart.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [queryString, setQueryString] = useState('');
    const [activeCategory, setActiveCategory] = useState('');

    const fetchproducts = useCallback(async () => {
        setLoading(true)
        try {
            const productsdata = await GetProducts();
            const rows = productsdata.split("\n").map((row) => row.split(","));
            const headers = rows[0];
            const records = rows.slice(1).map((r) =>
                Object.fromEntries(r.map((v, i) => [headers[i], v]))
            );
            const statusData = records.filter((item) => {
                return item.status === "YES";
            });
            setProducts(statusData);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        } finally {
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        fetchproducts();
    }, [fetchproducts]);

    //console.log("products", products)

    const categories = [...new Set(products.map(item => item.category))];

    const setSearchResultsFunc = (text) => {
        if (text === '') {
            if (activeCategory === "") {
                setSearchResults([])
                setNotFound(false)
            } else {
                const filteredData = products.filter((item) => {
                    return item.category.toLowerCase().includes(activeCategory.toLowerCase());
                });
                filteredData.length > 0 ? setSearchResults(filteredData) : setNotFound(true)
            }
        } else {
            if (activeCategory === "") {
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

    const setCategoryResultsFunc = (text) => {
        const filteredData = products.filter((item) => {
            return item.category.toLowerCase().includes(text.toLowerCase());
        });
        filteredData.length > 0 ? setSearchResults(filteredData) : setNotFound(true)
        filteredData.length > 0 && setActiveCategory(text)
    }

    const clearSearch = () => {
        if(activeCategory === ""){
            setSearchResults([])
            setNotFound(false)
        }
        setQueryString('')
    }

    const clearCategorySearch = () => {
        if(queryString === ""){
            setSearchResults([])
            setNotFound(false)
        }
        setActiveCategory('')
    }

    console.log("searchResults", searchResults)

    const checkForAdd = (product_code) => {
        const found = cart.some(el => el.product_code === product_code);
        return found;
    }
    const getQuantity = (product_code) => {
        const qty = cart.find((el) => el.product_code === product_code);
        return qty.quantity;
    }

    const getCartQuantity = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartAmount = () => {
        return priceDisplay(cart.reduce((total, item) => total + item.price * item.quantity, 0));
    }

    const addOptToCart = (opt) => {
        dispatch(addToCart(opt));
    }
    const decrement = (product_code) => {
        dispatch(decrementQuantity(product_code));
    }
    const increment = (product_code) => {
        dispatch(incrementQuantity(product_code));
    }

    return (
        <>
            <div className="menu-items">
                <div className="search-form">
                    <div className="form-group">
                        <input className="form-control" type="text" value={queryString} onChange={(e) => setSearchResultsFunc(e.target.value)} placeholder="Search here..." autoComplete="off" disabled={loading} />
                        {((searchResults.length > 0 || notFound) && queryString !== "") && <span className='clear-search' onClick={clearSearch}><i className="fa-solid fa-xmark"></i></span>}
                    </div>
                </div>
                {loading ? <div className="list"><p className='text-center'>Loading...</p></div> : <div className="list">
                    {activeCategory !== "" && <div className="item-category active">
                        <span><span>{activeCategory}</span><span className='clear-search' onClick={clearCategorySearch}><i className="fa-solid fa-xmark"></i></span></span>
                    </div>}
                    {searchResults.length > 0 ? <div className="item-list">{
                        searchResults.map((item, index) => <div key={index} className="item">
                            <div className='item-inner'>
                                <div className="img"><img width="100" height="100" src="/rava-dosa-recipe-1-100x100.jpg" className="attachment-100x100 size-100x100" alt="" /></div>
                                <div className="meta">
                                    <h2>{item.title}</h2>
                                    <div className="meta-inner">
                                        <div className="meta-info">
                                            <div className="price">{priceDisplay(parseInt(item.price))}</div>
                                            <span className="itemid"># {item.product_code}</span>
                                        </div>
                                        <div className="cart-action">
                                            {checkForAdd(parseInt(item.product_code)) ?
                                                (<div className="opt">
                                                    <button className="minus" onClick={() => decrement(parseInt(item.product_code))}><i className="fa-solid fa-minus"></i></button>
                                                    <div className="qty">{getQuantity(parseInt(item.product_code))}</div>
                                                    <button className="plus" onClick={() => increment(parseInt(item.product_code))}><i className="fa-solid fa-plus"></i></button>
                                                </div>) :
                                                <button className="btnAddAction init" onClick={() => addOptToCart({
                                                    'product_code': parseInt(item.product_code),
                                                    'title': item.title,
                                                    'price': parseInt(item.price),
                                                })}>Add <i className="fa-solid fa-plus"></i></button>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)
                    }</div> : categories.length > 0 ? categories.map((item, index) => <div key={index} className="item-category" onClick={() => setCategoryResultsFunc(item)}><span><span>{item}</span><i className="fa-solid fa-chevron-right"></i></span>
                    </div>) : <p className='text-center'>No Dosa Categories</p>
                    }
                </div>}
            </div>
            {cart.length > 0 && <div className="cart-summary-badge">
                <div className="cart-bottom-bar"><strong className="total-count">{getCartQuantity()}</strong> | <strong className="total-cart">{getCartAmount()}</strong></div>
                <div className="continue">
                    <button className="btn toggle" onClick={() => navigate("/cart", { replace: true })}>Continue</button>
                </div>
            </div>}
        </>
    )
}