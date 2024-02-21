import { useEffect, useState } from "react";
import { AdminServices } from "../../../Services/AdminServices";
import "../UserRequests/UserRequest.css";
import { ApiServices } from "../../../Services/ApiServices";
import MultipleSelectCheckmarks from "../UserRequests/FIlterExample";
import PitchCard from "./PitchCard";
import { FilterCheckBoxes } from "../../LoggedInPitches/Filters";
import CachedIcon from "@mui/icons-material/Cached";
import useWindowDimensions from "../../Common/WindowSize";
import FilterDialog from "../../Filters/FilterDialog";
import { setToast } from "../../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../../Toast/ToastColors";
import { useDispatch, useSelector } from "react-redux";

export default function AllPitches() {
  const [roles, setRoles] = useState([]);
  const [emails, setEmails] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    ApiServices.getAllRoles().then((res) => {
      const roles = [];
      res.data?.map((r) => {
        roles.push(r.role);
      }).catch((err) => {
        console.log(err);
        if (err.message == "Network Error") {
          dispatch(
            setToast({
              message: "Check your network connection",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        }
      });
      setRoles(roles);
    });
  }, []);
  const [filters, setFilters] = useState({
    role: [],
    status: ["pending"],
    email: [],
  });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const getAllPitches = async () => {
    await AdminServices.getAllPitches().then((res) => {
      setData(res.data);
      const emails = [];
      res.data?.map((r) => {
        emails.push(r.email);
      });
      setEmails(emails);
    });
  };
  useEffect(() => {
    getAllPitches();
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
      status: ["pending"],
      email: [],
    });
  };

  useEffect(() => {
    filterUsers();
  }, [filters]);

  const { height, width } = useWindowDimensions();
  return (
    <>
      <FilterDialog
        filters={filters}
        handleReloadClick={handleReloadClick}
        isSpinning={isSpinning}
        setFilters={setFilters}
        tabs={[
          {
            name: "Status",
            dataKey: "status",
            data: ["pending", "approved", "rejected"],
          },

          {
            name: "Roles",
            dataKey: "role",
            data: roles,
          },
          {
            name: "Email",
            dataKey: "email",
            data: emails,
          },
        ]}
      />
      <div className="usersWrapper">
        {width > 770 && (
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
                <b>Status</b>
              </div>

              <FilterCheckBoxes
                rawData={["pending", "approved", "rejected"]}
                dataKey="status"
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
        )}

        <div className="filteredUsers">
          {filteredData?.length > 0 ? (
            filteredData?.map((d) => <PitchCard d={d} />)
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
