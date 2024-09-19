import React, { useState, useEffect, forwardRef } from "react";
// import '../App.css';
import { Formik, useFormik, ErrorMessage, FormikProvider, Field } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import md5 from "md5";

export default function LoginPage() {
  let [initialValues, setInitialValues] = useState({});
  const emptyValues = {
    username: "",
    password: "",
  };

  let navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Username is required";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  useEffect(() => {
    if (
      typeof localStorage["userData"] !== "undefined" &&
      Object.keys(localStorage["userData"]).length > 0
    ) {
      navigate("/user");
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validate: validate,
    onSubmit: (values, { setValues, setSubmitting }) => {
      console.log(values);
      values.password = md5(values.password);

      Axios({
        method: "post",
        url: process.env.REACT_APP_API_BASE_URL + "/users/login",
        data: values,
      })
        .then(function (response) {
          console.log("inside session then");
          console.log(response);
          // dispatcher(updateUserData(response.data));
          localStorage["userData"] = JSON.stringify(response.data);
          navigate("/user");
        })
        .catch((error) => {
          console.log("outside session catch");
          alert(error.response.data.message);
        });
      setValues(emptyValues);
      setInitialValues(emptyValues);
    },
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="loginbox">
            <FormikProvider value={formik}>
              <form onSubmit={formik.handleSubmit}>
                <h1>Login Page</h1>
                <div className="form-group lgp-username mt-3">
                  <label>Username</label>
                  <Field
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="form-control"
                  ></Field>
                  <ErrorMessage
                    name="username"
                    className="text-red lgp-text-red"
                    component="div"
                  />
                </div>
                <div className="form-group lgp-password mt-3">
                  <label>Password</label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control"
                  ></Field>
                  <ErrorMessage
                    name="password"
                    className="text-red lgp-text-red"
                    component="div"
                  />
                </div>
                <div className="form-group mt-3">
                  <button type="submit"> Login</button>
                </div>
              </form>
            </FormikProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
