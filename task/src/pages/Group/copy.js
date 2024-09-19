import React, { useState, useEffect } from "react";
// import '../App.css';
import { Formik, useFormik, ErrorMessage, FormikProvider, Field } from "formik";
import Navbar from "../components/navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import Select from "react-select";
import DataTable from "react-data-table-component";

export default function Group() {
  let [action, setAction] = useState("Create");
  let [GroupData, setGroupData] = useState();
  const [Group, setGroup] = useState([]);
  let navigate = useNavigate();
  const emptyValues = {
    name: "",
    user_id: "",
  };
  const [UData, setUData] = useState([]);
  let [updateGroupId, setUpdateGroupId] = useState();
  const [initialValues, setInitialValues] = useState(emptyValues);
  const [realData, setRealData] = useState(emptyValues);

  const Change = (value) => {
    console.log(value);
    var _tempData = initialValues;
    _tempData.id = value.id;
    _tempData.name = value.label;
    setInitialValues(_tempData);
    var temp_value = [];
    value.forEach((element) => {
      temp_value.push(element["value"]);
    });

    console.log("temp_value->", temp_value);
    formik.setFieldValue("user_id", temp_value);

    // setOwnervalue(value);
    console.log("123", value);
  };
  const getData = async (name) => {
    let userData = JSON.parse(localStorage["userData"]);
    let response = await Axios.get(
      process.env.REACT_APP_API_BASE_URL +
        // "/users/user-dropdown-list?name="
        // name,
        "/users/user-list-group",
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // console.log("getData->",response.data);
    let Data = response.data.map((t) => ({ value: t.id, label: t.name }));

    console.log("option",Data);
    setUData(Data);
    // setRealData(response.data);
    return Data;
  };

  const deleteGroupUser = (id) => {
    let userData = JSON.parse(localStorage["userData"]);
    Axios.delete(
      process.env.REACT_APP_API_BASE_URL +
        "/groups/delete-groupUser?groupId=" +
        id,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => {

      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const DeleteData = (id) => {
    let userData = JSON.parse(localStorage["userData"]);
    if (window.confirm("Do you want to delete this entry!") == true) {
      deleteGroupUser(id);
      Axios.delete(
        process.env.REACT_APP_API_BASE_URL +
          "/groups/delete-group?groupId=" +
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
          getGroupData();
        })
        .catch((error) => {
          console.log("error->", error);
        });
    }
  };

  const getGroupUserData = (id) => {
    let userData = JSON.parse(localStorage["userData"]);
    Axios.get(
      process.env.REACT_APP_API_BASE_URL + "/groups/get-group?groupId=" + id,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => {
        console.log(response);
        console.log("get", response.data);
        let data = {
          id: response.data[0].id == null ? "" : response.data[0].id,
          name: response.data[0].name == null ? "" : response.data[0].name,
          user_id: (response.data[0].user_id = undefined
            ? ""
            : response.data[0].user_id),
        };
        // setRealData(data);
        Change(data.user_id);
        setInitialValues(data);

        console.log(data);
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const Search = (name) => {
    let userData = JSON.parse(localStorage["userData"]);
    Axios.get(
      process.env.REACT_APP_API_BASE_URL + "/groups/group-search?name=" + name,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => {
        setGroupData(response.data);
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const Edit = (id) => {
    console.log(id);
    setAction("Edit");
    setUpdateGroupId(id);
    getGroupUserData(id);
  };
  const Cancel = () => {
    if (action == "Edit") {
      console.log("create");
      setAction("Create");
      setUpdateGroupId();
      setInitialValues(emptyValues);
      console.log("aftercreate");
    }
  };

  const columns = [
    {
      name: "Sr. No",
      selector: (row, index) => index + 1,
      width: "25%",
    },
    {
      name: "Group Name",
      selector: (row) => row.name,
      width: "25%",
    },
    // {
    //   name: "Group Users",
    //   selector: (row) => row.user_name,
    //   width: "15%",
    // },
    {
      name: "Action",
      width: "25%",
      cell: (row) => {
        return (
          <>
            {/* <button className="button" onClick={() => Edit(row.id)}>
              Edit
            </button> */}
            <img src="/images/edit.png" onClick={() => Edit(row.id)} />
            <img src="/images/bin.png" onClick={() => DeleteData(row.id)} />
            {/* <button className="button" onClick={() => DeleteData(row.id)}>
              Delete
            </button> */}
          </>
        );
      },
    },
  ];

  const GroupUser = (values) => {
    console.log("v", values);
    let userData = JSON.parse(localStorage["userData"]);
    Axios.post(
      process.env.REACT_APP_API_BASE_URL + "/groups/group-user",
      values,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => {
        console.log("milestone added", response.data);
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };
  
  const AddGroup = (values) => {
    console.log("add",values);
    for (const key in values) {
      if (action == "Edit") {
        if (String(values[key]).trim() === "") {
          values[key] = "NULL";
        }
        if (String(values.user_id).trim() === "NULL") {
          values.user_id = "";
        }
      } else {
        if (String(values[key]).trim() === "") {
          values[key] = values[key];
          // delete values[key];
        }
      }
    }

    if (updateGroupId) {
      console.log("update", updateGroupId);
      // alert(JSON.stringify(updateMilestoneId));
      values.id = updateGroupId;
    }
    let userData = JSON.parse(localStorage["userData"]);
    Axios.post(
      process.env.REACT_APP_API_BASE_URL + "/groups/add-group",
      values,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((response) => {
      alert(
        `Milestone ${action == "Create" ? "added" : "updated"} successfully`
      );
      console.log(response.data);
      var value = {};
      value.group_id = response.data.id;
      value.user_id = values.user_id;
      for (const key in value.user_id) {
        console.log(key, "=>", value.user_id[key]);
        var data = {};
        data.group_id =response.data.id;
        console.log(response.data.id);
        data.user_id = value.user_id[key];
      if (action == "Edit") {
        deleteGroupUser(updateGroupId)
        data.group_id = updateGroupId;
        console.log(response.data);
        // setUpdateGroupId(undefined);
        setAction("Create");
      }
      GroupUser(data);
    }
    getGroupData()
  })
    
      // .then((response) => {
      //   let r = response.data;
      //   var value = {};
      //   value.group_id = r.id;
      //   value.user_id = values.user_id;
      //   for (const key in value.user_id) {
      //     console.log(key, "=>", value.user_id[key]);
      //     var data = {};
      //     data.group_id = r.id;
      //     data.user_id = value.user_id[key];
      //     GroupUser(data);
      //   }
      //   getGroupData()
      // })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const getGroupData = (values) => {
    let userData = JSON.parse(localStorage["userData"]);
    Axios.get(
      process.env.REACT_APP_API_BASE_URL + "/groups/group-list",
      values,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => {
        console.log(response.data);
        let data = response.data;
        // response.data.map((obj) => {
        //   if (obj.name == null) obj.name = "";
        //   if (obj.user_id == null) obj.user_id = "";
        //   if (obj.group_id == null) obj.group_id = "";
        //   if (obj.user_name == null) obj.user_name = "";
        //   return obj;
        // });
        setGroupData(data);
        // setMilestoneHistory(data);
        console.log("data->", data);
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const validate = (values) => {
    const errors = {};

    if (String(values.name).trim().length == 0) {
      errors.name = "Name is required";
    }

    if (!values.user_id) {
      errors.user_id = "Users is required in group";
    }

    return errors;
  };

  useEffect(() => {
    console.log(localStorage["userData"]);
    if (
      typeof localStorage["userData"] !== "undefined" &&
      Object.keys(localStorage["userData"]).length > 0
    ) {
      getGroupData();
      getData();
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
      console.log(values);
      setSubmitting(false);
      // setGroup(values);
      // AddGroup(values);
      // getGroupData();
      // setValues(emptyValues);
      // setInitialValues(emptyValues);
    },
  });

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="row project">
        <div className="col-12">
          <h3>{action} Group</h3>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Group name</label>
                  <Field
                    className="w-100 form-control"
                    name="name"
                    // disabled={initialValues.name ? "disabled" : ""}
                  />
                  <ErrorMessage
                    name="name"
                    className="text-red"
                    component="div"
                  />
                </div>
                <div className="col-6">
                  <label>Add Users</label>
                  <Select
                    closeMenuOnSelect={true}
                    // // components={makeAnimated()}
                    onChange={Change}
                    // defaultValue={[]}
                    // defaultValue=
                    // // {[UData[47], UData[57]]}
                    // {UData[{
                    //   label: UData.user_name,
                    //   value: UData.user_id,
                    // }]}
                    isMulti
                    options={UData}
                    // className="basic-multi-select"
                    // classNamePrefix="select"
                  />
                  {/* https://blog.continium-labs.com/many-to-many-relations-with-typeorm-and-nestjs/ */}
                  <ErrorMessage
                    name="user_id"
                    className="text-red"
                    component="div"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <button className="button lightBg" type="submit">
                    {action} Group
                  </button>
                  {action == "Edit" ? (
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
          <div className="row">
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
          <div className="row">
            <div className="col-lg-12 col-12">
              <div className="table-responsive custom_table_responsive">
                <DataTable
                  className="react_table"
                  columns={columns}
                  data={GroupData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
