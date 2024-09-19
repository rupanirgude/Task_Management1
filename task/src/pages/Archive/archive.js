import React, { useState, useEffect, forwardRef } from "react";
import Navbar from "../components/navbar";
import Axios from "axios";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";

export default function Archive() {
    
  const [loading, setLoading] = useState(false);
  const [milestoneData, setMilestoneData] = useState([]);
  let navigate = useNavigate();

  const getMilestoneArchiveList = (values) => {
    let userData = JSON.parse(localStorage["userData"]);
    Axios.get(
      process.env.REACT_APP_API_BASE_URL + "/tasks/task-done-list",
      values,
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
        // setMilestoneHistory(data);
        console.log("data->", data);
      })
      .catch((error) => {
        console.log("error->", error);
      });
  };

  useEffect(() => {
    if (
      typeof localStorage["userData"] !== "undefined" &&
      Object.keys(localStorage["userData"]).length > 0
    ) {
      getMilestoneArchiveList();
    } else {
      navigate("/");
    }
    // getMilestoneArchiveList();
  }, []);

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

  const columns = [
    {
      name: "Sr. No",
      selector: (row, index) => index + 1,
      width: "7%",
    },
    {
      name: "Milestone Name",
      selector: (row) => row.name,
      width: "15%",
      sortField: "name",
    },
    {
      name: "Milestone Description",
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
        return <>{CheckDate(row.end_date)}</>;
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
        width: "10%",
        selector: (row) => row.status_name,
      },
  ];


  return (
    <div className="container-fluid">
      <Navbar />
      <div className="row">
        <div className="col-12">
          <div className="archive table-responsive custom_table_responsive">
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
              // pagination
              // paginationServer
              // paginationTotalRows={totalRows}
              // onChangeRowsPerPage={handlePerRowsChange}
              // onChangePage={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
