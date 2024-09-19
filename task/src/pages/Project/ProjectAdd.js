import React, { useState, useEffect } from "react";
// import '../App.css';
import { Formik, useFormik, ErrorMessage, FormikProvider, Field } from "formik";
import Navbar from "../components/navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Axios from "axios";

export default function Project() {
  let [action, setAction] = useState("Add");
  let [updateProjectId, setUpdateProjectId] = useState();
  const [projectData, setProjectData] = useState([]);
  let navigate = useNavigate();
  const emptyValues = {
    name: "",
    description: "",
  };
  const [initialValues, setInitialValues] = useState(emptyValues);

  const getProjectList = () => {
    let userData = JSON.parse(localStorage["userData"]);

    Axios.get(process.env.REACT_APP_API_BASE_URL + "/projects/project-list", {
      headers: {
        auth_token: userData.session_token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        // alert(JSON.stringify(response.data))
        let data = response.data.map((obj) => {
          if (obj.name == null) obj.name = "";
          if (obj.description == null) obj.description = "";
          return obj;
        });

        setProjectData(data);
        // setProjectData(response.data)
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const Search = (name) => {
    let userData = JSON.parse(localStorage["userData"]);
    Axios.get(
      process.env.REACT_APP_API_BASE_URL +
        "/projects/project-search?name=" +
        name,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => {
        // alert(JSON.stringify(response.data))
        let data = response.data.map((obj) => {
          if (obj.name == null) obj.name = "";
          if (obj.description == null) obj.description = "";
          return obj;
        });

        setProjectData(data);
        // setProjectData(response.data)
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const DeleteData = (id) => {
    let userData = JSON.parse(localStorage["userData"]);
    if (window.confirm("Do you want to delete this entry!") == true) {
      Axios.delete(
        process.env.REACT_APP_API_BASE_URL +
          "/projects/delete-project?projectId=" +
          id,
        {
          headers: {
            auth_token: userData.session_token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
        .then((response) => {
          alert("Entry has been deleted sucessfully");
          let filteredData = projectData.filter((obj) => obj.id != id);
          setProjectData([...filteredData]);
        })
        .catch((error) => {
          console.log("error->", error);
        });
    }
  };

  const AddProject = (values) => {
    for (const key in values) {
      values[key] = values[key].trim();
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
    // let obj={};
    // for (const key in values) {
    //   obj[key] = values[key].trim();
    //   console.log("temp",obj);
    //   if (action == "Update") {
    //     if (obj[key] == "") {
    //       obj[key] = "NULL";
    //     }
    //   } else {
    //     if (obj[key] == "") {
    //       delete obj[key]
    //     }
    //   }
    // }

    if (updateProjectId) {
      values.id = updateProjectId;
    }

    // alert(JSON.stringify(values))
    let userData = JSON.parse(localStorage["userData"]);
    Axios.post(
      process.env.REACT_APP_API_BASE_URL + "/projects/add-project",
      values,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response, resetForm) => {
        alert(`project ${action == "Add" ? "added" : "updated"} successfully`);
        localStorage["userData"] = JSON.stringify(response.data);
        if (action == "Update") {
          setUpdateProjectId(undefined);
          setAction("Add");
        }
        getProjectList();
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const UpdateData = (id) => {
    console.log(id);
    setAction("Update");
    getProjectData(id);
    setUpdateProjectId(id);
  };
  const Cancel = () => {
    if (action == "Update") {
      console.log("create");
      setAction("Add");
      setUpdateProjectId();
      setInitialValues(emptyValues);
    }
  };

  const getProjectData = (id) => {
    let userData = JSON.parse(localStorage["userData"]);
    Axios.get(
      process.env.REACT_APP_API_BASE_URL +
        "/projects/get-project?projectId=" +
        id,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => {
        // alert("Project added")
        console.log(response.data);
        let data = {
          name: response.data[0].name == null ? "" : response.data[0].name,
          description:
            response.data[0].description == null
              ? ""
              : response.data[0].description,
        };
        setInitialValues(data);
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const validate = (values) => {
    const errors = {};

    if (String(values.name).length == 0) {
      errors.name = "Name is required";
    }
    return errors;
  };

  useEffect(() => {
    console.log(localStorage["userData"]);
    if (
      typeof localStorage["userData"] !== "undefined" &&
      Object.keys(localStorage["userData"]).length > 0
    ) {
      getProjectList();
    } else {
      navigate("/");
    }
    // getProjectList();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validate: validate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values, { setValues, setSubmitting }) => {
      setSubmitting(false);
      console.log(values);
      AddProject(values);
      getProjectList();
      setValues(emptyValues);
      setInitialValues(emptyValues);
    },
  });

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="row project">
        <div className="col-12">
          <h3>{action} Project</h3>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Project name</label>
                  <Field
                    className="w-100 form-control"
                    name="name"
                    disabled={initialValues.name ? "disabled" : ""}
                  />
                  <ErrorMessage
                    name="name"
                    className="text-red"
                    component="div"
                  />
                </div>
                <div className="col-6">
                  <label>Project Description</label>
                  <Field className="w-100 form-control" name="description" />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <button className="button lightBg" type="submit">
                    {action} Project
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
      <div className="row mb-3 project">
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
      <div className="row project">
        <div className="col-lg-12 col-12">
          {/* {action === 'Add' ? */}
          <table className="table">
            <tbody>
              <tr className="text-center">
                <th>Sr.No.</th>
                <th>Project Name</th>
                <th>Project Description</th>
                <th>Action</th>
              </tr>
              {projectData.map((val, key) => {
                return (
                  <tr key={key}>
                    {/* <td>{val.id}</td> */}
                    <td>{key + 1}</td>
                    <td>{val.name}</td>
                    <td>{val.description}</td>
                    <td>
                      <img
                        src="/images/edit.png"
                        onClick={() => UpdateData(val.id)}
                      />
                      <img
                        src="/images/bin.png"
                        onClick={() => DeleteData(val.id)}
                      />
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
