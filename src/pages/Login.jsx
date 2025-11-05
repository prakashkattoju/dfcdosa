import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik";
import * as Yup from "yup";
import { verifyUser } from "../services/Authservices";
import { setCredentials } from "../store/authSlice";
import { useDispatch } from "react-redux";
import AlertModel from "../components/AlertModel";
import { FaSpinner } from "react-icons/fa";

export default function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [isAlertOpen, setAlertOpen] = useState({
    success: false,
    title: "",
    show: false,
    color: null
  });

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
        .required("Mobile Number is required")
        .matches(/^[0-9]{10}$/, 'Invalid Mobile (10 digits)'),
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
        setAlertOpen({
          success: false,
          title: error.message || "An error occurred.",
          show: true,
          color: 'text-[#ff473a]'
        })
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
                    type="text"
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
                </div>
              </form>
            </div>
          </article>
        </main>
      </div>
      <AlertModel
        icon={isAlertOpen.success ? 'success' : 'error'}
        color={isAlertOpen.color}
        isOpen={isAlertOpen.show}
        title={isAlertOpen.title}
        onCancel={() => setAlertOpen({
          title: "",
          show: false,
          color: null
        })}
      />
    </div>
  )
}