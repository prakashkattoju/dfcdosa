import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik";
import * as Yup from "yup";
import { verifyAdmin } from "../services/Authservices";
import { setCredentials } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { FaSpinner } from "react-icons/fa";

export default function AdminLogin() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      uname: "",
      password: ""
    },
    validationSchema: Yup.object({
      uname: Yup.string()
        .required("User Name is required"),
      password: Yup.string()
        .required("Password is required")
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const data = await verifyAdmin(values.uname, values.password);
        if (data.status) {
          dispatch(setCredentials(data));
          navigate("/dashboard", { replace: true });
          window.location.reload(true);
        }
      } catch (error) {
        console.error("Error", error)
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
            <a href="/"><img src="Logo.png" alt="Dosa Filling Centre" /></a>
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
                    placeholder="Enter your username"
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
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="form-control"
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="input-error">{formik.errors.password}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <button type="submit" className="btn">{loading && <FaSpinner className="animate-spin" />} Submit </button>
                </div>
              </form>
            </div>
          </article>
        </main>
      </div>
    </div>
  )
}