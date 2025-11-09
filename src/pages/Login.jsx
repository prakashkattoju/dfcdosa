import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import { useFormik } from "formik";
import * as Yup from "yup";
import { verifyUser } from "../services/Authservices";
import { setCredentials } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { FaSpinner } from "react-icons/fa";

export default function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      uname: "",
      mobile: ""
    },
    validationSchema: Yup.object({
      uname: Yup.string()
        .required("Name is required"),
      mobile: Yup.string()
        .required("Mobile number is required")
        .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Mobile number'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const data = await verifyUser(values.uname, values.mobile);
        if (data.status) {
          dispatch(setCredentials(data));
          navigate("/", { replace: true });
          window.location.reload(true);
        }
      } catch (error) {
        setErrorMsg(error.message)
      } finally {
        setLoading(false)
      }
    },
  });

  return (
    <div className="bg-[#a4e4ff]">
      <div className="site login">
        <header className="site-header">
          <div className="site-branding">
            <Link to="/"><img src="Logo.png" alt="Dosa Filling Centre" /></Link>
          </div>
        </header>
        <main className="site-main">
          <article className="page">
            <div className="entry-content">
              <form className="list" onSubmit={formik.handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="uname"
                    placeholder="Enter your name"
                    value={formik.values.uname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="form-control"
                  />
                  {formik.touched.uname && formik.errors.uname ? (
                    <div className="input-error">{formik.errors.uname}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter your mobile number"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="form-control"
                  />
                  {formik.touched.mobile && formik.errors.mobile ? (
                    <div className="input-error">{formik.errors.mobile}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <button type="submit" className="btn">{loading && <FaSpinner className="animate-spin" />} Submit </button>
                  {errorMsg && <div className="input-error text-center mt-2">{errorMsg}</div>}
                </div>
              </form>
            </div>
          </article>
        </main>
      </div>
    </div>
  )
}