import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AdminServices } from "../../../Services/AdminServices";
import UserRequestCard from "./UserRequestCard";
import "./UserRequest.css";
import { ApiServices } from "../../../Services/ApiServices";
import MultipleSelectCheckmarks from "./FIlterExample";
import { FilterCheckBoxes } from "../../LoggedInPitches/Filters";
import CachedIcon from "@mui/icons-material/Cached";
export default function UserRequests() {
  const [roles, setRoles] = useState([]);
  const [emails, setEmails] = useState([]);
  useEffect(() => {
    ApiServices.getAllRoles().then((res) => {
      const roles = [];
      res.data?.map((r) => {
        roles.push(r.role);
      });
      setRoles(roles);
    });
  }, []);
  const [filters, setFilters] = useState({
    role: [],
    verification: ["pending"],
    email: [],
  });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const getAllUsers = async () => {
    await AdminServices.getRequestedUsersBasedOnFilters().then((res) => {
      setData(res.data);
      const emails = [];
      res.data?.map((r) => {
        emails.push(r.email);
      });
      setEmails(emails);
    });
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  useEffect(() => {
    if (data.length > 0) {
      filterUsers();
    }
  }, [data]);

  const filterUsers = () => {
    let filteredData = [...data];
    if (Object.keys(filters).length > 0) {
      Object.keys(filters).map((ob) => {
        if (filters[ob].length > 0) {
          filteredData = filteredData.filter((f) =>
            filters[ob].includes(f[ob])
          );
        }
      });
    }
    setFilteredData(filteredData);
  };
  const [isSpinning, setSpinning] = useState(false);
  const handleReloadClick = () => {
    setSpinning(true);
    setFilters({
      role: [],
      verification: ["pending"],
      email: [],
    });
  };

  useEffect(() => {
    filterUsers();
  }, [filters]);
  return (
    <>
      <div className="usersWrapper">
        <div style={{ height: "83vh" }} className="filterContainer">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="filterHeader">Filter By:</div>
            <div title="Reset filters">
              <CachedIcon
                style={{ cursor: "pointer" }}
                className={isSpinning ? "spin" : ""}
                onClick={handleReloadClick}
              />
            </div>
          </div>
          <div className="tagFilter">
            <div className="filter-header">
              <b>Verification</b>
            </div>

            <FilterCheckBoxes
              rawData={["pending", "approved", "rejected"]}
              dataKey="verification"
              filters={filters}
              setFilters={setFilters}
            />
          </div>
          <hr />
          <div className="tagFilter">
            <div className="filter-header">
              <b>Role</b>
            </div>

            <FilterCheckBoxes
              setFilters={setFilters}
              filters={filters}
              rawData={roles}
              dataKey="role"
            />
          </div>
          <hr />
          <div className="tagFilter">
            <div className="filter-header">
              <b>Email</b>
            </div>

            <FilterCheckBoxes
              setFilters={setFilters}
              filters={filters}
              showSearch={true}
              rawData={emails}
              dataKey="email"
            />
          </div>
        </div>

        <div className="filteredUsers">
          {filteredData?.length > 0 ? (
            filteredData?.map((d) => <UserRequestCard d={d} />)
          ) : (
            <div className="pitch-container">
              <img className="no-requests" src="/no-requests.png" />
              <div style={{ marginLeft: "30px" }}>No Requests Found !</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
