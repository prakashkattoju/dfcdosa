import React, { useEffect, useState, useCallback, useRef } from 'react'
import { CreateProduct, GetCategories } from '../services/Productsservices';
import { useSelector } from 'react-redux';
import { decodeToken } from 'react-jwt';
import { useNavigate, useLocation } from "react-router-dom";
import AlertModal from '../components/AlertModal';
import { Dropdown } from 'primereact/dropdown';
import config from '../config';
import { FaSpinner } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [editProduct, setEditProduct] = useState(location.state ? true : false);
  const [product, setProduct] = useState(location.state ? location.state?.product : {});

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
    product_id: '',
    category_id: '',
    product_code: '',
    title: '',
    unit_price: '',
    image: '',
    description: '',
    status: ''
  }
  // Formik initialization
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Product title is required"),
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
        const data = await CreateProduct(formData);
        if (data.status) {
          setShowAlert({
            title: 'Success!',
            message: data.message,
            show: true
          })
          if (editProduct) {
            setEditProduct(false)
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

  useEffect(() => {
    if (editProduct && product) {
      const { product_id, category_id, product_code, title, unit_price, image, description, status } = product;
      formik.setValues({
        product_id: product_id,
        category_id: category_id,
        product_code: product_code,
        title: title,
        unit_price: unit_price,
        image: image,
        description: description,
        status: status
      })
    } else {
      formik.setValues(initialValues)
    }
  }, [product, editProduct])

  return (<>
    <div className="list my-3">
      <div className="item-list">
        <div className='item d-flex justify-content-between align-items-center'>
          <h3 className='mb-0'>{editProduct ? 'Edit Product' : 'Create Product'}</h3>
        </div>
      </div>
    </div>
    <div className='products'>
      <form className="list" onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Enter product title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-control"
          />
          {formik.touched.title && formik.errors.title ? (<div className="input-error">{formik.errors.title}</div>) : null}
        </div>
        <div className="form-group">
          <div className='row'>
            <div className="col-10">
              <Dropdown
                name="category_id"
                value={formik.values.category_id}
                options={categories}
                onChange={formik.handleChange}
                filter
                filterBy="title"
                filterMatchMode="startsWith"
                optionLabel="title"
                optionValue="category_id"
                placeholder="Select Category"
              />
              {formik.touched.category_id && formik.errors.category_id ? (<div className="input-error">{formik.errors.category_id}</div>) : null}
            </div>
            <div className="col-2">
              <button type='button' className='btn' onClick={() => navigate('/categories')}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg></button>
            </div>
          </div>
        </div>
        <div className="form-group d-flex gap-3">
          <div className="form-group">
            <Dropdown
              name="status"
              value={formik.values.status}
              options={avaoptions}
              onChange={formik.handleChange}
              optionLabel="label"
              optionValue="value"
              placeholder="Select Availability"
            />
            {formik.touched.status && formik.errors.status ? (<div className="input-error">{formik.errors.status}</div>) : null}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="unit_price"
              placeholder="Enter price"
              value={formik.values.unit_price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control"
            />
            {formik.touched.unit_price && formik.errors.unit_price ? (<div className="input-error">{formik.errors.unit_price}</div>) : null}
          </div>
        </div>
        <div className="form-group d-flex gap-3">
          <div className="form-group">
            <input
              type="text"
              name="product_code"
              placeholder="Enter product code"
              value={formik.values.product_code || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <Dropdown
              name="image"
              value={formik.values.image || ''}
              options={avaoptions}
              onChange={formik.handleChange}
              optionLabel="label"
              optionValue="value"
              placeholder="Select Image"
            />
          </div>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="description"
            placeholder="Enter product description"
            value={formik.values.description || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <div className='row'>
            <div className='col-6'><button type="submit" className="btn">{loading && <FaSpinner className="animate-spin" />} Submit </button></div>
            <div className='col-6'><button type="button" className="btn" onClick={() => navigate('/')}> Cancel </button></div>
          </div>
          {errorMsg && <div className="input-error text-center mt-2">{errorMsg}</div>}
        </div>
      </form>
    </div>
  </>
  )
}