import React, { useState, useEffect, forwardRef } from "react";
// import '../App.css';
import { Formik, useFormik, ErrorMessage, FormikProvider, Field } from "formik";
import Navbar from "../components/navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import md5 from "md5";
import ReverseMd5 from "reverse-md5";
import DataTable from "react-data-table-component";

export default function User() {
  let [action, setAction] = useState("Add");
  let [updateUserId, setUpdateUserId] = useState();
  let navigate = useNavigate();
  const params = useParams();
  let [userNames, setUsernames] = useState([]);
  let [userData, setUserData] = useState([]);
  var rev = ReverseMd5({
    lettersUpper: true,
    lettersLower: true,
    numbers: true,
    special: true,
    whitespace: false,
    maxLen: 12,
  });
  const emptyValues = {
    name: "",
    username: "",
    designation: "",
    department: "",
    password: "",
  };
  let [initialValues, setInitialValues] = useState(emptyValues);

  const getUserList = () => {
    let userData = JSON.parse(localStorage["userData"]);

    Axios.get(process.env.REACT_APP_API_BASE_URL + "/users/user-list", {
      headers: {
        auth_token: userData.session_token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        // localStorage['userData'] = JSON.stringify(response.data);
        let data = response.data.map((obj) => {
          if (obj.name == null) obj.name = "";
          if (obj.username == null) obj.username = "";
          if (obj.designation == null || obj.designation == "NULL")
            obj.designation = "";
          if (obj.department == null) obj.department = "";
          if (obj.password == null || obj.password == "NULL") obj.password = "";
          return obj;
        });


        setUserData(data);
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  // const Usernames = () => {
  //   let userData = JSON.parse(localStorage["userData"]);

  //   Axios.get(process.env.REACT_APP_API_BASE_URL + "/users/usernames", {
  //     headers: {
  //       auth_token: userData.session_token,
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //   })
  //     .then((response) => {
  //       // console.log(response.data);
  //       setUsernames(response.data);
  //     })
  //     .catch((error) => {
  //       console.log("error->", error);
  //     });
  //   };

  const AddUser = (values) => {
    // if (action == "Update") {
    //   for (let [key, val] of Object.entries(values)) {
    //     if (String(val).trim() === "") {
    //       values[key] = "NULL";
    //     }
    //   }
    // } else {
    //   for (let [key, val] of Object.entries(values)) {
    //     if (String(val).trim() === "") {
    //       delete values[key];
    //     }
    //   }
    // }
    let userdata = JSON.parse(localStorage["userData"]);
    // console.log(values.password);
    // values.password = md5(values.password);
    // let p = rev(values.password);
    // console.log(p.str);

    for (const key in values) {
      values[key] = values[key].trim();
      // console.log("temp", values);
      if (action == "Update") {
        if (values[key] == "") {
          values[key] = "NULL";
        }
      } else {
        if (values[key] == "") {
          delete values[key];
        }
      }
    }
    if (updateUserId) {
      values.id = updateUserId;
    }
    // alert(JSON.stringify(values));
    Axios.post(process.env.REACT_APP_API_BASE_URL + "/users/add-user", values, {
      headers: {
        auth_token: userdata.session_token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        console.log("AddUser->", response);
        // alert(`user ${action == "Add" ? "added" : "updated"} successfully`);
        if (action == "Add") {
          if (typeof "response" == "string") {
            alert(`username alredy exist try another`);
          } else {
            alert(`user added successfully`);
          }
        }
        if (action == "Update") {
          // typeof for if it is string

          if (response.data === 0) {
            alert(`username alredy exist try another`);
          } else {
            setUpdateUserId(undefined);
            alert(`user updated successfully`);
            setAction("Add");
          }
          // alert(`user ${action == "Add" ? "added" : "updated"} successfully`);
        }
        getUserList();
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const UpdateData = (id) => {
    setAction("Update");
    setUpdateUserId(id);
    getUserData(id);
  };
  const Cancel = () => {
    if (action == "Update") {
      console.log("create");
      setAction("Add");
      setUpdateUserId();
      setInitialValues(emptyValues);
    }
  };

  const Search = (name) => {
    let userData = JSON.parse(localStorage["userData"]);
    Axios.get(
      process.env.REACT_APP_API_BASE_URL + "/users/user-search?name=" + name,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => {
        let data = response.data.map((obj) => {
          if (obj.name == null) obj.name = "";
          if (obj.designation == null) obj.designation = "";
          if (obj.department == null) obj.department = "";
          if (obj.username == null) obj.username = "";
          if (obj.password == null) obj.password = "";
          return obj;
        });

        setUserData(data);
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const DeleteData = (id) => {
    let userData = JSON.parse(localStorage["userData"]);
    if (window.confirm("Do you want to delete this entry!") == true) {
      Axios.delete(
        process.env.REACT_APP_API_BASE_URL + "/users/delete-user?userId=" + id,
        {
          headers: {
            auth_token: userData.session_token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
        .then((response) => {
          alert("Do you want to delete this user entry!");
          let filteredData = userData.filter((obj) => obj.id != id);
          setUserData([...filteredData]);
        })
        .catch((error) => {
          console.log("error->", error);
        });
    }
  };

  const getUserData = (id) => {
    let userData = JSON.parse(localStorage["userData"]);
    Axios.get(
      process.env.REACT_APP_API_BASE_URL + "/users/get-user?userId=" + id,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => {
        console.log("edit", response.data);
        // console.log("db", response.data[0].password);
        let data = {
          name: response.data[0].name == null ? "" : response.data[0].name,
          designation:
            response.data[0].designation == null
              ? ""
              : response.data[0].designation,
          department:
            response.data[0].department == null
              ? ""
              : response.data[0].department,
          username:
            response.data[0].username == null ? "" : response.data[0].username,
          password:
            response.data[0].password == null ? "" : response.data[0].password,
        };
        // let p = rev(data.password);
        // data.password = p.str;
        // console.log(p.str);

        
        let obj_data = {}

        for (const key of Object.keys(emptyValues)) {
          obj_data[key] = data[key]
        }
        console.log("obj_data->",obj_data);


        setInitialValues(obj_data);
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const validate = (values) => {
    const errors = {};
    // alert(JSON.stringify(values))
    if (String(values.name).length == 0) {
      errors.name = "Name is required";
    }
    if (!values.username) {
      errors.username = "Username is required";
    }

    if (action == "Add") {
      if (!values.password) {
        errors.password = "password is required";
      }
    }
    // if (action="Add" && !values.password) {
    //   errors.password = "password is required";
    // }

    return errors;
  };

  useEffect(() => {
    // localStorage["userData"] = JSON.stringify(response.data);
    console.log(localStorage["userData"]);
    if (
      typeof localStorage["userData"] !== "undefined" &&
      Object.keys(localStorage["userData"]).length > 0
    ) {
      getUserList();
    } else {
      navigate("/");
    }
    // getUserList();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validate: validate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values, { setValues, setSubmitting }) => {
      console.log(values);
      setSubmitting(false);
      AddUser(values);
      getUserList();
      setValues(emptyValues);
      setInitialValues(emptyValues);
    },

    // onSubmit: async (values, { resetForm, handleSubmit,setSubmitting, setValues }) => {
    //     setSubmitting(false)
    //     await AddUser(values);
    //     // alert(action)
    //     setValues({
    //         name: "",
    //         designation: "",
    //         department: "",
    //     })
    //     getUserList();
    // }
  });

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="row user">
        <div className="col-12">
          <h3>{action} User</h3>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Name</label>
                  <Field
                    name="name"
                    className="w-100 form-control"
                    // disabled={id ? true : false}
                    disabled={initialValues.name ? "disabled" : ""}
                  />
                  <ErrorMessage
                    name="name"
                    className="text-red"
                    component="div"
                  />
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>Designation</label>
                    <Field className="w-100 form-control" name="designation" />
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Department</label>
                  <Field className="w-100 form-control" name="department" />
                </div>
                <div className="col-6">
                  <label>Username</label>
                  <Field className="w-100 form-control" name="username" />
                  <ErrorMessage
                    name="username"
                    className="text-red"
                    component="div"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Password</label>
                  <Field
                    className="w-100 form-control"
                    name="password"
                    type="password"
                  />
                  <ErrorMessage
                    name="password"
                    className="text-red"
                    component="div"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <button className="button lightBg" type="submit">
                    {action} User
                  </button>
                  {action == "Update" ? (
                    <button
                      className="button lightBg"
                      type="button"
                      style={{ marginRight: "20px" }}
                      onClick={Cancel}
                    >
                      Cancel
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </form>
          </FormikProvider>
        </div>
      </div>
      <div className="row mb-3 user">
        <div className="col-12">
          <input
            className="search"
            name="search"
            type="text"
            placeholder="Search"
            onChange={(e) => {
              Search(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="row user">
        <div className="col-lg-12 col-12">
          {/* {action === 'Add' ? */}
          <table className="table">
            <tbody>
              <tr className="text-center">
                <th>Sr.No.</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
              {userData.map((val, key) => {
                return (
                  <tr key={key}>
                    {/* <td>{val.id}</td> */}
                    <td>{key + 1}</td>
                    <td>{val.name}</td>
                    <td>{val.designation}</td>
                    <td>{val.department}</td>
                    <td>
                      {/* <button */}
                      <div>
                        <img
                          src="/images/edit.png"
                          onClick={() => UpdateData(val.id)}
                        />
                        <img
                          src="/images/bin.png"
                          onClick={() => DeleteData(val.id)}
                        />
                      </div>

                      {/* <button
                        className="button"
                        onClick={() => {
                          UpdateData(val.id);
                        }}
                      >
                        Edit
                      </button>
                      <span>
                        <button
                          className="button"
                          onClick={() => DeleteData(val.id)}
                        >
                          Delete
                        </button>
                      </span> */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* : "" } */}
        </div>
      </div>
    </div>
  );
}
