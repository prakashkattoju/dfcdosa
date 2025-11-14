import { useEffect, useState, useCallback } from 'react'
import { GetProducts, GetCategories } from '../services/Productsservices';
import priceDisplay from '../util/priceDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementQuantity, decrementQuantity } from '../store/cartSlice';
import { useNavigate } from "react-router-dom";

export default function Home() {

    const cart = useSelector((state) => state.cart.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [queryString, setQueryString] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubCategory, setActiveSubCategory] = useState(null);

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

    //console.log("categories", categories)

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

        const categoryObj = categories.find((item) => item.category_id == category_id);
        setSubCategories(categoryObj.sub_cats)

        const filteredData = products.filter((item) => {
            return item.category_id === category_id;
        });
        filteredData.length > 0 ? setSearchResults(filteredData) : setNotFound(true)
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
        setActiveSubCategory(null)
    }

    const getCategoryTitle = (activeCategory) => {
        const category = categories.find(el => el.category_id == activeCategory);
        return category.title;
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

    return (
        <>
            <div className="menu-items">
                <div className="search-form">
                    <div className="form-group">
                        <input className="form-control" type="text" value={queryString} onChange={(e) => setSearchResultsFunc(e.target.value)} placeholder="Search here..." autoComplete="off" disabled={loading} />
                        {((searchResults.length > 0 || notFound) && queryString !== "") && <span className='clear-search' onClick={clearSearch}><i className="fa-solid fa-xmark"></i></span>}
                    </div>
                </div>
                {loading ? <div className="list"><p className='text-center'>Loading...</p></div> : <>
                    {activeCategory !== null && <div className="list sticky"><div className="item-category active" onClick={clearCategorySearch}><span><span>{getCategoryTitle(activeCategory)}</span><span className='clear-search'><i className="fa-solid fa-xmark"></i></span></span>
                    </div>
                        {subCategories.length > 0 && <div className="item-list">
                            <div className='sub-category-list'>
                                {subCategories.map((item, index) => item.status === "1" && <div onClick={() => setSubCategoryResultsFunc(item.sub_cat_id)} key={index} className={`item-category sub-category ${item.sub_cat_id === activeSubCategory && 'active'}`}>{item.title}</div>)}
                            </div>
                        </div>}
                    </div>}
                    <div className="list">{searchResults.length > 0 ? <div className="item-list">{
                        searchResults.map((item, index) => <div key={index} className="item">
                            <div className='item-inner'>
                                <div className="img"><img width="100" height="100" src="/dosa.webp" alt={item.title} /></div>
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
                        </div>)
                    }</div> : categories.length > 0 ? categories.map((item, index) => item.status === "1" && <div key={index} className="item-category" onClick={() => setCategoryResultsFunc(item.category_id)}><span><span>{item.title}</span><i className="fa-solid fa-chevron-right"></i></span>
                    </div>) : <p className='text-center'>No Dosa Categories</p>
                    }
                    </div></>}
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