import React, { useEffect, useState, useCallback, useRef } from 'react'
import { ChangeCategoryStatus, GetCategories } from '../services/Productsservices';
import { useSelector } from 'react-redux';
import { decodeToken } from 'react-jwt';
import { useNavigate } from "react-router-dom";
import ConfirmModal from '../components/ConfirmModal';
import AlertModal from '../components/AlertModal';
import { Dropdown } from 'primereact/dropdown';
import config from '../config';
import { FaSpinner } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import groceries from '../groceries'

export default function Groceries() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [queryString, setQueryString] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [createCategory, setCreateCategory] = useState(false);
    const [editCategory, setEditCategory] = useState(false);
    const [category, setCategory] = useState({});

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
        fetchcategories();
    }, [fetchcategories]);

    const updateCategory = (category_id, newData) => {
        setSearchResults(prevItems =>
            prevItems.map(item =>
                item.category_id === category_id ? { ...item, ...newData } : item
            )
        );
        setCategories(prevItems =>
            prevItems.map(item =>
                item.category_id === category_id ? { ...item, ...newData } : item
            )
        );
    };

    const handleChangeStatus = async (category_id, status) => {
        //console.log("status", status)
        try {
            const res = await ChangeCategoryStatus({
                category_id: category_id,
                status: status
            });
            if (res.status) {
                updateCategory(category_id, { status: !status })
            }
        } catch (error) {
            console.error("Failed to change status:", error);
        }
    }

    const setSearchResultsFunc = (text) => {
        if (text !== '') {
            const filteredData = categories.filter((item) => {
                return item.title.toLowerCase().includes(text.toLowerCase());
            });
            filteredData.length > 0 ? setSearchResults(filteredData) : setNotFound(true)
        } else {
            setSearchResults(categories)
        }
        setQueryString(text)
    }

    const clearSearch = () => {
        setSearchResults(categories)
        setNotFound(false)
        setQueryString('')
    }


    const toBoolean = (value) => {
        return value === "1" || value === 1 || value === true;
    };

    const avaoptions = [
        { label: "YES", value: "1" },
        { label: "NO", value: "0" },
    ];

    function objectToFormData(obj, form = new FormData(), namespace = '') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const formKey = namespace ? `${namespace}[${key}]` : key;
                const value = obj[key];

                if (value instanceof Date) {
                    form.append(formKey, value.toISOString());
                } else if (value instanceof File || value instanceof Blob) {
                    form.append(formKey, value);
                } else if (typeof value === 'object' && value !== null) {
                    objectToFormData(value, form, formKey); // recurse
                } else {
                    form.append(formKey, value ?? ''); // convert null to empty string
                }
            }
        }
        return form;
    }

    const initialValues = {
        category_id: '',
        category_code: '',
        title: '',
        image: '',
        description: '',
        status: ''
    }
    // Formik initialization
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            title: Yup.string()
                .required("Category title is required"),
            category_id: Yup.string()
                .required("Category is required"),
            status: Yup.string()
                .required("Availability is required"),
            unit_price: Yup.string()
                .required("Price is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            console.log("values", values)
            /* try {
              setLoading(true)
              const formData = objectToFormData(values);
              const data = await CreateCategory(formData);
              if (data.status) {
                setShowAlert({
                  title: 'Success!',
                  message: data.message,
                  show: true
                })
                if (editCategory) {
                  setEditCategory(false)
                }
                resetForm();
              }
            } catch (error) {
              setShowAlert({
                title: 'Error!',
                message: error.message,
                show: true
              })
            } finally {
              setLoading(false)
            } */
        },
    });

    const handleEditClick = (item) => {
        setEditCategory(true)
        setCategory(item)
    }

    const handleFormCancel = () => {
        setCreateCategory(false)
        setEditCategory(false)
        setCategory({})
    }

    useEffect(() => {
        if (editCategory && category) {
            const { category_id, category_code, title, image, description, status } = category;
            formik.setValues({
                category_id: category_id || '',
                category_code: category_code || '',
                title: title || '',
                image: image || '',
                description: description || '',
                status: status || ''
            })
        } else {
            formik.setValues(initialValues)
        }
    }, [category, editCategory])

    const handleDeleteClick = (category_id, title) => {
        setShowConfirm({
            id: category_id,
            title: title,
            show: true
        });
    };

    const handleConfirmDelete = async (category_id) => {
        document.activeElement?.blur();
        setShowConfirm({
            id: null,
            title: null,
            show: false
        });
        /* try {
          const data = await DeleteProductByID(category_id);
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
        } */
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
                    {groceries.length > 0 ? <div className="item-list">{
                        groceries.map((item, index) => <div key={index} className="item">
                            <h2 style={{width: '100%'}}>{item.main} <hr /></h2>
                            {item.sub.map((item, index) => {
                                return (<div key={index} className='mb-2'><div className="price">{item}</div><div className="cart-action"></div></div>)
                            })}
                        </div>)
                    }</div> : <p className='text-center'>No Groceries</p>
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