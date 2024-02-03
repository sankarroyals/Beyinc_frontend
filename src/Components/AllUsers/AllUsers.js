import React, { useEffect, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import "../LivePitches/LivePitches.css";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { Country, State } from "country-state-city";
import CachedIcon from "@mui/icons-material/Cached";
import SingleUserDetails from "./SingleUserDetails";
import "./users.css";
import {
  allLanguages,
  allskills,
  fetchRating,
  idealUserRole,
} from "../../Utils";
import AddReviewStars from "../LivePitches/AddReviewStars";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Checkbox,
  FormControlLabel,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
const AllUsers = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const totalRoles = useSelector((state) => state.auth.totalRoles);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [data, setData] = useState([]);
  const [tag, settag] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { email } = useSelector((state) => state.auth.loginDetails);
  const [filledStars, setFilledStars] = useState(0);
  const [filters, setFilters] = useState({
    role: [],
    languagesKnown: [],
    skills: [],
    email: [],
    state: [],
    country: [],
    userColleges: [],
    verification: false,
    userName: [],
    review: 0,
  });
  useEffect(() => {
    setFilters((prev) => ({ ...prev, review: filledStars }));
  }, [filledStars]);
  // const [universities, setUniversities] = useState([])
  // useEffect(() => {
  //     axios.get('http://universities.hipolabs.com/search').then(res => {
  //         setUniversities(res.data)
  //     })
  // }, [])
  useEffect(() => {
    ApiServices.getAllUsers({ type: "" }).then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      filterUsers();
    }
  }, [data, filters]);

  const filterUsers = () => {
    let filteredData = [...data];
    // console.log(filters);
    if (Object.keys(filters).length > 0) {
      Object.keys(filters).map((ob) => {
        if (filters[ob].length > 0 || ob == "verification" || ob == "review") {
          if (
            ob !== "tags" &&
            ob !== "verification" &&
            ob !== "email" &&
            ob !== "userName" &&
            ob !== "industry2" &&
            ob !== "userColleges" &&
            ob !== "country" &&
            ob !== "state" &&
            ob !== "skills" &&
            ob !== "languagesKnown" &&
            ob !== "review" &&
            ob !== "role"
          ) {
            filteredData = filteredData.filter((f) =>
              filters[ob].includes(f[ob])
            );
          } else if (
            ob === "tags" ||
            ob == "skills" ||
            ob == "languagesKnown"
          ) {
            filteredData = filteredData.filter((item) => {
              const itemdata = item[ob].map((t) => t.toLowerCase()) || [];
              return filters[ob].some((tag) =>
                itemdata.includes(tag.toLowerCase())
              );
            });
          } else if (ob == "userColleges") {
            filteredData = filteredData.filter((item) => {
              const itemdata =
                item["educationDetails"]?.map((t) => t.college) || [];
              return filters[ob].some((tag) => itemdata.includes(tag));
            });
          } else if (ob == "verification") {
            if (filters[ob]) {
              filteredData = filteredData.filter((item) => {
                return item.verification == "approved";
              });
            }
          } else if (
            ob == "userName" ||
            ob == "industry2" ||
            ob == "country" ||
            ob == "state" ||
            ob == "email" ||
            ob == "role"
          ) {
            filteredData = filteredData.filter((f) => {
              return filters[ob].some((fs) => fs === f[ob]);
            });
          } else if (ob == "review") {
            if (filters[ob] !== 0) {
              filteredData = filteredData.filter((f) => {
                return fetchRating(f) <= filters[ob];
              });
            }
          }
        }
      });
    }
    filteredData.sort((a, b) => {
      return fetchRating(b) - fetchRating(a);
    });
    setFilteredData(filteredData);
  };

  const [isSpinning, setSpinning] = useState(false);
  const handleReloadClick = () => {
    setSpinning(true);
    setFilters({
      role: [],
      email: [],
      state: [],
      country: [],
      skills: [],
      languagesKnown: [],
      userColleges: [],
      verification: false,
      userName: [],
      review: 0,
    });
    setFilledStars(0);
  };

  return (
    <>
      <Dialog fullWidth={"sm"} open={open} onClose={handleClose}>
        <DialogTitle
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <>Filter</>{" "}
          <CachedIcon
            style={{ cursor: "pointer" }}
            className={isSpinning ? "spin" : ""}
            onClick={() => {
              handleReloadClick();
            }}
          />
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              bgcolor: "background.paper",
              height: 400,
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              sx={{
                width: 200,
                borderRight: 1,
                borderColor: "divider",
              }}
            >
              <Tab
                sx={{
                  width: "100%",
                  ":hover": { backgroundColor: "#f0f0f0" },
                }}
                label="Role"
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  width: "100%",
                  ":hover": { backgroundColor: "#f0f0f0" },
                }}
                label="Emails"
                {...a11yProps(1)}
              />
              <Tab
                sx={{
                  width: "100%",
                  ":hover": { backgroundColor: "#f0f0f0" },
                }}
                label="Name"
                {...a11yProps(2)}
              />
              <Tab
                sx={{
                  width: "100%",
                  ":hover": { backgroundColor: "#f0f0f0" },
                }}
                label="Country"
                {...a11yProps(3)}
              />
              <Tab
                sx={{
                  width: "100%",
                  ":hover": { backgroundColor: "#f0f0f0" },
                }}
                label="Skills"
                {...a11yProps(4)}
              />
              <Tab
                sx={{
                  width: "100%",
                  ":hover": { backgroundColor: "#f0f0f0" },
                }}
                label="Language"
                {...a11yProps(5)}
              />
              <Tab
                sx={{
                  width: "100%",
                  ":hover": { backgroundColor: "#f0f0f0" },
                }}
                label="Others"
                {...a11yProps(6)}
              />
            </Tabs>
            <TabPanel
              style={{
                width: "100%",
              }}
              value={value}
              index={0}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {totalRoles.map((h) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={h.role}
                        checked={filters.role.includes(h.role)}
                        onChange={() => {
                          setFilters((prev) => ({
                            ...prev,
                            role: prev.role.includes(h.role)
                              ? prev.role.filter((v) => v !== h.role)
                              : [...filters.role, h.role],
                          }));
                        }}
                      />
                    }
                    label={h.role}
                  />
                ))}
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {data.map((h) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={h.email}
                        checked={filters.email.includes(h.email)}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            email: prev.email.includes(h.email)
                              ? prev.email.filter((v) => v !== h.email)
                              : [...filters.email, h.email],
                          }))
                        }
                      />
                    }
                    label={h.email}
                  />
                ))}
              </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {data.map((h) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={h.userName}
                        checked={filters.userName.includes(h.userName)}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            userName: prev.userName.includes(h.userName)
                              ? prev.userName.filter((v) => v !== h.userName)
                              : [...filters.userName, h.userName],
                          }))
                        }
                      />
                    }
                    label={h.userName}
                  />
                ))}
              </div>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {Country?.getAllCountries().map((h) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={`${h.name}-${h.isoCode}`}
                        checked={filters.userName.includes(
                          `${h.name}-${h.isoCode}`
                        )}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            userName: prev.userName.includes(
                              `${h.name}-${h.isoCode}`
                            )
                              ? prev.userName.filter(
                                  (v) => v !== `${h.name}-${h.isoCode}`
                                )
                              : [...filters.userName, `${h.name}-${h.isoCode}`],
                          }))
                        }
                      />
                    }
                    label={h.name}
                  />
                ))}
              </div>
            </TabPanel>
            <TabPanel value={value} index={4}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {allskills.map((h) => {
                  return (
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={h}
                          checked={filters.skills.includes(h)}
                          onChange={() =>
                            setFilters(() => ({
                              ...filters,
                              skills: filters.skills.includes(h)
                                ? filters.skills.filter((v) => v !== h)
                                : [...filters.skills, h],
                            }))
                          }
                        />
                      }
                      label={h}
                    />
                  );
                })}
              </div>
            </TabPanel>
            <TabPanel value={value} index={5}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {allLanguages.map((h) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={h}
                        checked={filters.languagesKnown.includes(h)}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            languagesKnown: prev.languagesKnown.includes(h)
                              ? prev.languagesKnown.filter((v) => v !== h)
                              : [...filters.languagesKnown, h],
                          }))
                        }
                      />
                    }
                    label={h}
                  />
                ))}
              </div>
            </TabPanel>
            <TabPanel value={value} index={6}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div>Rating:</div>
                  <div className="inputTag" style={{ marginLeft: 20 }}>
                    <AddReviewStars
                      filledStars={filledStars}
                      setFilledStars={setFilledStars}
                    />
                  </div>
                </div>

                <div className="verificationFilter">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <> Verified: </>
                    <input
                      type="checkbox"
                      style={{ width: "20px", marginLeft: 20 }}
                      checked={filters.verification}
                      onChange={() => {
                        setFilters((prev) => ({
                          ...prev,
                          verification: !filters.verification,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <div className="usersContainer">
        <div className="user-nav-bar">
          <button className="nav-bar-buttons" onClick={handleClickOpen}>
            <i style={{ marginRight: 3 }} class="fa fa-filter" /> Filter
          </button>
          <button className="nav-bar-buttons">
            <i class="fa fa-sort-amount-desc"></i>
            Sort by
          </button>
        </div>
        <div className="usersWrapper">
          <div className="userscontainer">
            {filteredData.length > 0 ? (
              filteredData?.map((d) => <SingleUserDetails d={d} />)
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                No Users Available
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllUsers;
