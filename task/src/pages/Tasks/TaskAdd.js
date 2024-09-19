import React, { useState, useEffect, forwardRef } from "react";
// import '../App.css';
import { Formik, useFormik, ErrorMessage, FormikProvider, Field } from "formik";
import Navbar from "../components/navbar";
import Axios from "axios";
import {
  Table,
  Button,
  Input,
  DatePicker,
  Dropdown,
  AutoComplete,
} from "rsuite";
import Popup from "reactjs-popup";
// import 'reactjs-popup/dist/index.css';
import { useNavigate, Link } from "react-router-dom";
import moment from "moment";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import DataTable from "react-data-table-component";

export default function Task() {
  let [action, setAction] = useState("Create");
  let navigate = useNavigate();
  let [updateMilestoneId, setUpdateMilestoneId] = useState();
  const [loading, setLoading] = useState(false);
  const [Ownervalue, setOwnervalue] = useState();
  const [Projectvalue, setProjectvalue] = useState([]);
  const [Statusvalue, setStatusvalue] = useState([]);
  const [AssigntoValue, setAssigntoValue] = useState();
  const [milestoneHistory, setMilestoneHistory] = useState([]);
  const [milestoneData, setMilestoneData] = useState([]);
  const [ownerList, setOwnerList] = useState([]);
  const [assignList, setassignList] = useState([]);
  const [projectList, setProjectList] = useState([]);

  const emptyValues = {
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    assign_to: "",
    user_id: "",
    project_id: "",
    status: "",
    group_id: "",
  };

  let [realData, setRealData] = useState(emptyValues);

  const AddMilestone = (values) => {
    for (const key in values) {
      if (action == "Edit") {
        if (String(values[key]).trim() === "") {
          values[key] = "NULL";
        }
      } else {
        if (String(values[key]).trim() === "") {
          //values[key] = values[key];
          delete values[key];
        }
      }
    }

    if (updateMilestoneId) {
      console.log("update", updateMilestoneId);
      // alert(JSON.stringify(updateMilestoneId));
      values.id = updateMilestoneId;
    }

    for (const key in values) {
      console.log(key, "=>", values[key]);
    }
    // alert(JSON.stringify(values));
    let userData = JSON.parse(localStorage["userData"]);
    Axios.post(process.env.REACT_APP_API_BASE_URL + "/tasks/add-task", values, {
      headers: {
        auth_token: userData.session_token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        console.log("milestone added", response.data);
        alert(
          `Milestone ${action == "Create" ? "added" : "updated"} successfully`
        );
        if (action == "Edit") {
          console.log(response.data);
          setAction("Create");
        }
        getMilestoneList();
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const DeleteData = (id) => {
    let userData = JSON.parse(localStorage["userData"]);
    if (window.confirm("Do you want to delete this entry!") == true) {
      Axios.delete(
        process.env.REACT_APP_API_BASE_URL + "/tasks/delete-task?taskId=" + id,
        {
          headers: {
            auth_token: userData.session_token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
        .then((response) => {
          alert("Entry has been deleted sucessfully");
          let filteredData = milestoneData.filter((obj) => obj.id != id);
          setMilestoneData([...filteredData]);
        })
        .catch((error) => {
          console.log("error->", error);
        });
    }
  };

  const Edit = (id) => {
    setAction("Edit");
    setUpdateMilestoneId(id);
    getMilestoneData(id);
  };
  const Cancel = () => {
    if (action == "Edit") {
      console.log("create");
      setAction("Create");
      setUpdateMilestoneId();
      setRealData(emptyValues);
      console.log("aftercreate");
    }
  };

  const getMilestoneData = (id) => {
    let userData = JSON.parse(localStorage["userData"]);
    Axios.get(
      process.env.REACT_APP_API_BASE_URL + "/tasks/get-task?taskId=" + id,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => {
        console.log(response);
        // alert("Project added")
        // setProjectvalue(response.data[0].project_id);
        let data = {
          id: response.data[0].id == null ? "" : response.data[0].id,
          name: response.data[0].name == null ? "" : response.data[0].name,
          description:
            response.data[0].description == null
              ? ""
              : response.data[0].description,
          start_date:
            response.data[0].start_date == null
              ? ""
              : moment(response.data[0].start_date).format("yyyy-MM-DD"),
          end_date:
            response.data[0].end_date == null
              ? ""
              : moment(response.data[0].end_date).format("yyyy-MM-DD"),
          assign_to:
            response.data[0].assign_to == null
              ? ""
              : response.data[0].assign_to,
          assigned_name:
            response.data[0].assigned_name == null
              ? ""
              : response.data[0].assigned_name,
          owner_id:
            response.data[0].owner_id == null ? "" : response.data[0].owner_id,
          owner_name:
            response.data[0].owner_name == null
              ? ""
              : response.data[0].owner_name,
          project_id:
            response.data[0].project_id == null
              ? ""
              : response.data[0].project_id,
          project_name:
            response.data[0].project_name == null
              ? ""
              : response.data[0].project_name,
          group_id:
            response.data[0].group_id == null ? "" : response.data[0].group_id,
          group_name:
            response.data[0].group_name == null
              ? ""
              : response.data[0].group_name,
          status:
            response.data[0].status == null ? "" : response.data[0].status,
          status_name:
            response.data[0].status_name == null
              ? ""
              : response.data[0].status_name,
        };
        setRealData(data);

        console.log(data);
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const getMilestoneList = (values) => {
    let userData = JSON.parse(localStorage["userData"]);
    Axios.get(process.env.REACT_APP_API_BASE_URL + "/tasks/task-list", values, {
      headers: {
        auth_token: userData.session_token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        let data = response.data.map((obj) => {
          if (obj.name == null) obj.name = "";
          if (obj.description == null) obj.description = "";
          // if (obj.start_date == null) obj.start_date = '';
          if (obj.start_date)
            obj.start_date = moment(obj.start_date).format("yyyy-MM-DD");
          else if (obj.start_date == null) {
            obj.start_date = "";
          }
          if (obj.end_date)
            obj.end_date = moment(obj.end_date).format("yyyy-MM-DD");
          else if (obj.end_date == null) {
            obj.end_date = "";
          }
          if (obj.user_id == null) obj.user_id = "";
          if (obj.project_id == null) obj.project_id = "";
          if (obj.assign_to == null) obj.assign_to = "";
          if (obj.status == null) obj.status = "";
          return obj;
        });
        setMilestoneData(data);
        // setMilestoneHistory(data);
        console.log("data->", data);
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const Search = (name) => {
    let userData = JSON.parse(localStorage["userData"]);
    Axios.get(
      process.env.REACT_APP_API_BASE_URL + "/tasks/task-search?name=" + name,
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
          if (obj.description == null) obj.description = "";
          // if (obj.start_date == null) obj.start_date = '';
          if (obj.start_date)
            obj.start_date = moment(obj.start_date).format("yyyy-MM-DD");
          else if (obj.start_date == null) {
            obj.start_date = "";
          }
          if (obj.end_date)
            obj.end_date = moment(obj.end_date).format("yyyy-MM-DD");
          else if (obj.end_date == null) {
            obj.end_date = "";
          }
          if (obj.user_id == null) obj.user_id = "";
          if (obj.project_id == null) obj.project_id = "";
          if (obj.assign_to == null) obj.assign_to = "";
          return obj;
        });
        setMilestoneData(data);
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  const conditionalRowStyles = [
    {
      when: (row) =>
        row.end_date && row.end_date < moment(Date()).format("YYYY-MM-DD"),
      style: {
        // backgroundColor: 'green',
        color: "red",
      },
    },
  ];

  const columns = [
    {
      name: "Sr. No",
      selector: (row, index) => index + 1,
      width: "5%",
    },
    {
      name: "Task Name",
      selector: (row) => row.name,
      width: "15%",
      cell: (row) => {
        return (
          <div className="table2">
            <Popup
              trigger={
                <Link
                  style={{
                    color:
                      row.end_date &&
                      row.end_date < moment(Date()).format("YYYY-MM-DD")
                        ? "red"
                        : "",
                  }}
                  // to={`/complex/details/${row.id}`}
                >
                  {row.name}
                  {/* {row.parent} */}
                </Link>
              }
              position="right center"
            >
              <div className="table-responsive2 custom_table_responsive">
                <DataTable
                  className="react_table2"
                  columns={columns2}
                  data={row.parentList}
                  progressPending={loading}
                />
              </div>
            </Popup>
          </div>
        );
      },
      sortField: "name",
    },
    {
      name: "Task Description",
      selector: (row) => row.description,
      width: "15%",
    },
    {
      name: "Start Date",
      selector: (row) => row.start_date,
      width: "10%",
      cell: (row) => {
        return <>{CheckDate(row.start_date)}</>;
      },
    },
    {
      name: "End Date",
      selector: (row) => row.end_date,
      width: "10%",
      cell: (row) => {
        let current = moment(Date()).format("YYYY-MM-DD");
        // console.log(current);
        // console.log(row.end_date);
        if (row.end_date < current) {
          return (
            <>
              <div style={{ color: "red" }}>{CheckDate(row.end_date)}</div>
            </>
          );
        } else {
          return (
            <>
              <div>{CheckDate(row.end_date)}</div>
            </>
          );
        }
      },
    },
    {
      name: "Assigned",
      selector: (row) => row.assigned_name,
      width: "10%",
    },
    {
      name: "Owner",
      width: "10%",
      selector: (row) => row.owner_id_name,
    },
    {
      name: "Project",
      width: "10%",
      selector: (row) => row.project_name,
    },
    {
      name: "Status",
      width: "8%",
      selector: (row) => row.status_name,
    },
    {
      name: "Action",
      width: "6%",
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

  const columns2 = [
    {
      name: "No",
      selector: (row, index) => index + 1,
      width: "8%",
    },
    {
      name: "Task Name",
      selector: (row) => row.name,
      width: "15%",
      style: {
        padding: "0px",
      },
      sortField: "name",
    },
    {
      name: "Task Description",
      selector: (row) => row.description,
      width: "18%",
    },
    {
      name: "Start Date",
      selector: (row) => row.start_date,
      width: "13%",
      cell: (row) => {
        return <>{CheckDate(row.start_date)}</>;
      },
    },
    {
      name: "End Date",
      selector: (row) => row.end_date,
      width: "13%",
      cell: (row) => {
        // return <>{CheckDate(row.end_date)}</>;
        let current = moment(Date()).format("YYYY-MM-DD");
        if (row.end_date < current) {
          return (
            <>
              <div style={{ color: "red" }}>{CheckDate(row.end_date)}</div>
            </>
          );
        } else {
          return (
            <>
              <div>{CheckDate(row.end_date)}</div>
            </>
          );
        }
      },
    },
    {
      name: "Assigned",
      selector: (row) => row.assigned_name,
      width: "10%",
    },
    {
      name: "Owner",
      width: "10%",
      selector: (row) => row.owner_id_name,
    },
    {
      name: "Project",
      width: "13%",
      selector: (row) => row.project_name,
    },
  ];

  const getOwnerData = async (name) => {
    let userData = JSON.parse(localStorage["userData"]);
    let response = await Axios.get(
      process.env.REACT_APP_API_BASE_URL +
        "/users/user-dropdown-list?name=" +
        name,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    setOwnerList(response.data);
    return response.data;
  };

  const getGroupData = async (name) => {
    let userData = JSON.parse(localStorage["userData"]);
    let response = await Axios.get(
      process.env.REACT_APP_API_BASE_URL +
        "/groups/group-dropdown-list?name=" +
        name,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // setOwnerList(response.data);
    return response.data;
  };

  const getAssigntoData = async (name) => {
    let userData = JSON.parse(localStorage["userData"]);
    let response = await Axios.get(
      process.env.REACT_APP_API_BASE_URL +
        "/users/user-dropdown-list?name=" +
        name,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    setassignList(response.data);
    return response.data;
  };

  const AssigntohandleChange = (value) => {
    console.log(value);
    var _tempData = realData;
    _tempData.assign_to = value.id;
    _tempData.assigned_name = value.label;
    setRealData(_tempData);
    formik.setFieldValue("assign_to", value["value"]);
    setAssigntoValue(value);
    //console.log("123",value);
  };

  const AssigntoloadOptions = (inputValue) => {
    return getAssigntoData(inputValue).then((res) => {
      return res
        .filter((r) => r.name.toLowerCase().includes(inputValue.toLowerCase()))
        .map((t) => ({ value: t.id, label: t.name }));
    });
  };
  const ProjecthandleChange = (value) => {
    console.log(value);
    var _tempData = realData;
    _tempData.project_id = value.id;
    _tempData.project_name = value.label;
    setRealData(_tempData);
    formik.setFieldValue("project_id", value["value"]);
    setProjectvalue(value);
    console.log("123", value);
  };

  const ProjectloadOptions = (inputValue) => {
    // console.log(inputValue);
    return getProjectData(inputValue).then((res) => {
      return res
        .filter((r) => r.name.toLowerCase().includes(inputValue.toLowerCase()))
        .map((t) => ({ value: t.id, label: t.name }));
    });
  };

  const StatushandleChange = (value) => {
    console.log(value);
    var _tempData = realData;
    _tempData.status = value.id;
    _tempData.status_name = value.label;
    setRealData(_tempData);
    formik.setFieldValue("status", value["value"]);
    setStatusvalue(value);
    console.log("123", value);
  };

  const StatusloadOptions = (inputValue) => {
    // console.log(inputValue);
    return getstatusData(inputValue).then((res) => {
      return res
        .filter((r) => r.name.toLowerCase().includes(inputValue.toLowerCase()))
        .map((t) => ({ value: t.id, label: t.name }));
    });
  };

  const OwnerhandleChange = (value) => {
    console.log(value);
    var _tempData = realData;
    _tempData.owner_id = value.id;
    _tempData.owner_name = value.label;
    setRealData(_tempData);
    formik.setFieldValue("user_id", value["value"]);
    setOwnervalue(value);
    console.log("123", value);
  };

  const OwnerloadOptions = (inputValue) => {
    return getOwnerData(inputValue).then((res) => {
      return res
        .filter((r) => r.name.toLowerCase().includes(inputValue.toLowerCase()))
        .map((t) => ({ value: t.id, label: t.name }));
    });
  };

  const GrouphandleChange = (value) => {
    console.log(value);
    var _tempData = realData;
    _tempData.group_id = value.id;
    _tempData.group_name = value.label;
    setRealData(_tempData);
    formik.setFieldValue("group_id", value["value"]);
    setOwnervalue(value);
    console.log("123", value);
  };

  const GrouploadOptions = (inputValue) => {
    return getGroupData(inputValue).then((res) => {
      return res
        .filter((r) => r.name.toLowerCase().includes(inputValue.toLowerCase()))
        .map((t) => ({ value: t.id, label: t.name }));
    });
  };

  const getProjectData = async (name, callback) => {
    let userData = JSON.parse(localStorage["userData"]);
    let response = await Axios.get(
      process.env.REACT_APP_API_BASE_URL +
        "/projects/project-dropdown-list?name=" +
        name,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    setProjectList(response.data);
    // callback(response.data)
    return response.data;
  };

  const getstatusData = async (name, callback) => {
    let userData = JSON.parse(localStorage["userData"]);
    let response = await Axios.get(
      process.env.REACT_APP_API_BASE_URL + "/status/status-list?name=" + name,
      {
        headers: {
          auth_token: userData.session_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
    // callback(response.data)
  };

  const DatePickerr = (props) => {
    let name = props.field.name;
    let values = props.form.values;

    let date_value = "";
    if (values && values[name]) {
      date_value = values[name] == "" ? "" : new Date(values[name]);
      // console.log("---------");
      // console.log(values);
      // console.log("dates", values[name]);
    }

    return (
      <>
        {date_value == "" ? (
          <DatePicker
            format="dd-MM-yyyy"
            placeholder="dd-mm-yyyy"
            oneTap={true}
            className="w-100"
            onChange={(e) => {
              if (e) values[name] = moment(e).format("yyyy-MM-DD");
              else values[name] = "";
            }}
          />
        ) : (
          <DatePicker
            format="dd-MM-yyyy"
            placeholder="dd-mm-yyyy"
            oneTap={true}
            className="w-100"
            defaultValue={date_value}
            onChange={(e) => {
              console.log(e);
              if (e) values[name] = moment(e).format("yyyy-MM-DD");
              else values[name] = "";
            }}
          />
        )}
      </>
    );
  };

  const CheckDate = (val) => {
    if (val) {
      let date = moment(val).format("DD/MM/YYYY");
      if (date == "Invalid date") {
        return "";
      } else {
        return date;
      }
    } else return "";
  };

  const validate = (values) => {
    const errors = {};

    if (String(values.name).trim().length == 0) {
      errors.name = "Name is required";
    }

    if (!values.project_id) {
      errors.project_id = "Project Name is required";
    }

    if (!values.start_date) {
      errors.start_date = "Date is required";
    }

    if (values.end_date && values.end_date < values.start_date) {
      errors.end_date = "Date is Must be Greater than Start Date";
    }

    if (!values.group_id) {
      errors.group_id = "Group Name is required";
    }

    return errors;
  };

  useEffect(() => {
    console.log(localStorage["userData"]);
    if (
      typeof localStorage["userData"] !== "undefined" &&
      Object.keys(localStorage["userData"]).length > 0
    ) {
      getMilestoneList();
    } else {
      navigate("/");
    }

    // getMilestoneHistory();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: realData,
    validate: validate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values, { setValues, setSubmitting }) => {
      setSubmitting(false);
      console.log("vallll", values);
      AddMilestone(values);
      getMilestoneList();
      setValues(emptyValues);
      setRealData(emptyValues);
    },
  });

  return (
    <div className="milestone container-fluid">
      <Navbar />
      <div className="row">
        <div className="createTask col-12">
          <h3>{action} Task</h3>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Task name :</label>
                  <Field className="w-100 form-control" name="name" />
                  <ErrorMessage
                    name="name"
                    className="text-red"
                    component="div"
                  />
                </div>
                <div className="col-6">
                  <label>Task Description :</label>
                  <Field className="w-100 form-control" name="description" />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Start Date :</label>
                  <Field
                    className="w-100"
                    name="start_date"
                    component={DatePickerr}
                  />
                  <ErrorMessage
                    name="start_date"
                    className="text-red"
                    component="div"
                  />
                </div>
                <div className="col-6">
                  <label>End Date :</label>
                  <Field
                    className="w-100"
                    name="end_date"
                    component={DatePickerr}
                  />
                  <ErrorMessage
                    name="end_date"
                    className="text-red"
                    component="div"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Assign To :</label>
                  <AsyncSelect
                    cacheOptions
                    onChange={AssigntohandleChange}
                    value={{
                      label: realData.assigned_name,
                      value: realData.assign_to,
                    }}
                    menuPlacement="top"
                    loadOptions={AssigntoloadOptions}
                    defaultOptions
                  />
                </div>
                <div className="col-6">
                  <label>Owner :</label>
                  <AsyncSelect
                    cacheOptions
                    onChange={OwnerhandleChange}
                    value={{
                      label: realData.owner_name,
                      value: realData.owner_id,
                    }}
                    menuPlacement="top"
                    loadOptions={OwnerloadOptions}
                    defaultOptions
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Project :</label>
                  <AsyncSelect
                    cacheOptions
                    onChange={ProjecthandleChange}
                    value={{
                      label: realData.project_name,
                      value: realData.project_id,
                    }}
                    loadOptions={ProjectloadOptions}
                    // loadOptions={getProjectData}
                    // value={Projectvalue}
                    // backspaceRemovesValue={true}
                    // getOptionLabel={(op) => {
                    //   return op.name;
                    // }}
                    // getOptionValue={(op) => {
                    //   return op.id;
                    // }}
                    // isClearable={true}
                    menuPlacement="top"
                    defaultOptions
                  />
                  <ErrorMessage
                    name="project_id"
                    className="text-red"
                    component="div"
                  />
                </div>
                <div className="col-6">
                  <label>Status :</label>
                  <AsyncSelect
                    cacheOptions
                    onChange={StatushandleChange}
                    value={{
                      label: realData.status_name,
                      value: realData.status,
                    }}
                    loadOptions={StatusloadOptions}
                    menuPlacement="top"
                    defaultOptions
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Group :</label>
                  <AsyncSelect
                    cacheOptions
                    onChange={GrouphandleChange}
                    value={{
                      label: realData.group_name,
                      value: realData.group_id,
                    }}
                    loadOptions={GrouploadOptions}
                    menuPlacement="top"
                    defaultOptions
                  />
                  <ErrorMessage
                    name="group_id"
                    className="text-red"
                    component="div"
                  />
                </div>
                <div className="col-6"></div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <button className="button lightBg" type="submit">
                    {/* {action == 'Update' ? <button className="button lightBg" type = "button" style={{"marginRight":"20px"}} onClick={publishComplex}>Publish Complex</button>:""}
                <button className="button lightBg" type='submit'>{action} Complex</button> */}{" "}
                    {action} Task
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
        </div>
      </div>
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
              //   customStyles={customStyles}
              //   title="Users"
              // expandableRows
              // expandableRowsComponent={buildingDetails}
              // // expandableRowsComponentProps={{"building": data }}
              // onSort={handleSort}
              columns={columns}
              data={milestoneData}
              progressPending={loading}
              conditionalRowStyles={conditionalRowStyles}
              // pagination
              // paginationServer
              // paginationTotalRows={totalRows}
              // onChangeRowsPerPage={handlePerRowsChange}
              // onChangePage={handlePageChange}
            />
          </div>
          {/* <table>
                        <tbody>
                            <tr className="text-center">
                                <th>Sr.No.</th>
                                <th>Milestone Name</th>
                                <th>Milestone Description</th>
                                <th>start date</th>
                                <th>end date</th>
                                <th>Assign To</th>
                                <th>Owner</th>
                                <th>Project</th>
                                <th>Action</th>
                            </tr>
                            {milestoneData && milestoneData.map((val, key) => {
                                let owner_obj = ownerList.find(obj => obj.id == val.user_id)
                                let assign_obj = assignList.find(obj => obj.id == val.assign_to)
                                let project_obj = projectList.find(obj => obj.id == val.project_id)
                                // let edit_obj = milestoneData.find(obj => obj.id == val.id)
                                // console.log("upppp",edit_obj);

                                return (
                                    <tr key={key} >
                                       
                                        <td>{key + 1}</td>
                                        <td>{val.name}</td>
                                      
                                        <td>{val.description}</td>
                                        <td>{CheckDate(val.start_date)}</td>
                                        <td>{CheckDate(val.end_date)}</td>
                                        <td>{assign_obj == null ? '' : assign_obj.name}</td>
                                        <td>{owner_obj == null ? '' : owner_obj.name}</td>
                                        <td >{project_obj == null ? '' : project_obj.name}</td>
                                        <td><button className="button" onClick={() => Edit(val.id)}>Edit</button>
                                            <span><button className="button" onClick={() => DeleteData(val.id)}>Delete</button></span></td>
                                    </tr >

                                )
                            })}
                        </tbody >
                    </table > */}
        </div>
      </div>
    </div>
  );
}
