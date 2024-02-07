import React, { useEffect, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import "../LivePitches/LivePitches.css";
import { useSelector } from "react-redux";
import { Country } from "country-state-city";
import CachedIcon from "@mui/icons-material/Cached";
import SingleUserDetails from "./SingleUserDetails";
import "./users.css";
import { allLanguages, allskills, fetchRating } from "../../Utils";
import AddReviewStars from "../LivePitches/AddReviewStars";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import {
  Checkbox,
  FormControlLabel,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { FilterPanel } from "./FilterPanel";
import useWindowDimensions from "../Common/WindowSize";
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

const tabs = [
  "Role",
  "Emails",
  "Name",
  "Country",
  "Skills",
  "Language",
  "Other",
];
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
  const [search, setSearch] = useState("");
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
  const { height, width } = useWindowDimensions();
  return (
    <>
      <Dialog
        fullScreen={width <= 400}
        maxWidth={"md"}
        fullWidth={true}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <>Filter</>
          <CachedIcon
            style={{ cursor: "pointer" }}
            className={isSpinning ? "spin" : ""}
            onClick={() => {
              handleReloadClick();
            }}
          />
        </DialogTitle>
        <DialogContent style={{ padding: 0 }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexGrow: 1,
              bgcolor: "background.paper",
              height: width <= 400 ? "100%" : 400,
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              className="tabs-vertical"
              sx={{
                borderRight: 1,
                borderColor: "divider",
              }}
            >
              {tabs.map((v, i) => (
                <Tab
                  className="filter-tab-style"
                  label={<div className="filter-tab-text">{v}</div>}
                  {...a11yProps(i)}
                />
              ))}
            </Tabs>
            <TabPanel value={value} index={0}>
              <FilterPanel
                rawData={totalRoles}
                dataKey={"role"}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <FilterPanel
                rawData={data}
                dataKey={"email"}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <FilterPanel
                rawData={data}
                dataKey={"userName"}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <FilterPanel
                rawData={Country?.getAllCountries()}
                isCountry={true}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <FilterPanel
                rawData={allskills}
                dataKey={"skills"}
                isFlat={true}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <FilterPanel
                rawData={allLanguages}
                dataKey={"languagesKnown"}
                isFlat={true}
                filters={filters}
                setFilters={setFilters}
              />
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
                    marginBottom: 20,
                  }}
                >
                  <div className="filter-rating-label">Rating:</div>
                  <div className="inputTag" style={{ marginLeft: 20 }}>
                    <AddReviewStars
                      filledStars={filledStars}
                      setFilledStars={setFilledStars}
                    />
                  </div>
                </div>

                <div className="verificationFilter">
                  <div
                    className="filter-options-label"
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
          <div>
            <h3>Connect with Users</h3>
          </div>
          {width < 770 ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <button className="nav-bar-buttons" onClick={handleClickOpen}>
                <i style={{ marginRight: 3 }} class="fa fa-filter" /> Filter
              </button>
              {/* <button className="nav-bar-buttons">
              <i class="fa fa-sort-amount-desc"></i>
              Sort by
            </button> */}
              <input
                type="text"
                style={{ marginTop: "2px", marginLeft: "8px", width: "150px" }}
                className="nav-bar-buttons"
                value={search}
                placeholder="Search user"
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value !== "") {
                    setFilteredData(
                      filteredData.filter((f) => {
                        return f.userName.includes(e.target.value);
                      })
                    );
                  } else {
                    setFilteredData(data);
                  }
                }}
                label="Search.."
                variant="standard"
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="usersWrapper">
          {width > 770 ? (
            <div className="filterContainer">
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
                    onClick={() => {
                      handleReloadClick();
                    }}
                  />
                </div>
              </div>

              {/* Role */}
              <div className="tagFilter">
                <div>Role:</div>
                {filters.role?.length > 0 && (
                  <div className="listedTeam">
                    {filters.role.map((t, i) => (
                      <div className="singleMember">
                        <div>{t}</div>
                        <div
                          onClick={(e) => {
                            setFilters((prev) => ({
                              ...prev,
                              role: [...filters.role.filter((f, j) => i !== j)],
                            }));
                          }}
                        >
                          <CloseIcon className="deleteMember" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="inputTag">
                  <select
                    name="role"
                    // value={form?.email}
                    onChange={(e) => {
                      if (!filters.role.includes(e.target.value)) {
                        setFilters((prev) => ({
                          ...filters,
                          role: [...filters.role, e.target.value],
                        }));
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {totalRoles.map((h) => (
                      <option value={h.role}>{h.role}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* mail */}
              <div className="tagFilter">
                <div>Email:</div>
                {filters.email?.length > 0 && (
                  <div className="listedTeam">
                    {filters.email.map((t, i) => (
                      <div className="singleMember">
                        <div>{t}</div>
                        <div
                          onClick={(e) => {
                            setFilters((prev) => ({
                              ...prev,
                              email: [
                                ...filters.email.filter((f, j) => i !== j),
                              ],
                            }));
                          }}
                        >
                          <CloseIcon className="deleteMember" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="inputTag">
                  <select
                    name="email"
                    // value={form?.email}
                    onChange={(e) => {
                      if (!filters.email.includes(e.target.value)) {
                        setFilters((prev) => ({
                          ...filters,
                          email: [...filters.email, e.target.value],
                        }));
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {data.map((h) => (
                      <option value={h.email}>{h.email}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Domain */}
              <div className="tagFilter">
                <div>User Names:</div>
                {filters.userName?.length > 0 && (
                  <div className="listedTeam">
                    {filters.userName.map((t, i) => (
                      <div className="singleMember">
                        <div>{t}</div>
                        <div
                          onClick={(e) => {
                            setFilters((prev) => ({
                              ...prev,
                              userName: [
                                ...filters.userName.filter((f, j) => i !== j),
                              ],
                            }));
                          }}
                        >
                          <CloseIcon className="deleteMember" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="inputTag">
                  <select
                    name="hiringPositions"
                    // value={form?.hiringPositions}
                    onChange={(e) => {
                      if (!filters.userName.includes(e.target.value)) {
                        setFilters((prev) => ({
                          ...filters,
                          userName: [...filters.userName, e.target.value],
                        }));
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {data.map((h) => (
                      <option value={h.userName}>{h.userName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* country */}
              <div className="tagFilter">
                <div>Country:</div>
                {filters.country?.length > 0 && (
                  <div className="listedTeam">
                    {filters.country.map((t, i) => (
                      <div className="singleMember">
                        <div>{t}</div>
                        <div
                          onClick={(e) => {
                            setFilters((prev) => ({
                              ...prev,
                              country: [
                                ...filters.country.filter((f, j) => i !== j),
                              ],
                            }));
                          }}
                        >
                          <CloseIcon className="deleteMember" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="inputTag">
                  <select
                    name="hiringPositions"
                    // value={form?.hiringPositions}
                    onChange={(e) => {
                      if (!filters.country.includes(e.target.value)) {
                        setFilters((prev) => ({
                          ...filters,
                          country: [...filters.country, e.target.value],
                        }));
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {Country?.getAllCountries().map((h) => (
                      <option value={`${h.name}-${h.isoCode}`}>{h.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="tagFilter">
                <div>Skills:</div>
                {filters.skills?.length > 0 && (
                  <div className="listedTeam">
                    {filters.skills.map((t, i) => (
                      <div className="singleMember">
                        <div>{t}</div>
                        <div
                          onClick={(e) => {
                            setFilters((prev) => ({
                              ...prev,
                              skills: [
                                ...filters.skills.filter((f, j) => i !== j),
                              ],
                            }));
                          }}
                        >
                          <CloseIcon className="deleteMember" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="inputTag">
                  <select
                    name="hiringPositions"
                    // value={form?.hiringPositions}
                    onChange={(e) => {
                      if (!filters.skills.includes(e.target.value)) {
                        setFilters((prev) => ({
                          ...filters,
                          skills: [...filters.skills, e.target.value],
                        }));
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {allskills?.map((h) => (
                      <option value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* languagesKnown */}
              <div className="tagFilter">
                <div>Languages known:</div>
                {filters.languagesKnown?.length > 0 && (
                  <div className="listedTeam">
                    {filters.languagesKnown.map((t, i) => (
                      <div className="singleMember">
                        <div>{t}</div>
                        <div
                          onClick={(e) => {
                            setFilters((prev) => ({
                              ...prev,
                              languagesKnown: [
                                ...filters.languagesKnown.filter(
                                  (f, j) => i !== j
                                ),
                              ],
                            }));
                          }}
                        >
                          <CloseIcon className="deleteMember" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="inputTag">
                  <select
                    name="hiringPositions"
                    // value={form?.hiringPositions}
                    onChange={(e) => {
                      if (!filters.languagesKnown.includes(e.target.value)) {
                        setFilters((prev) => ({
                          ...filters,
                          languagesKnown: [
                            ...filters.languagesKnown,
                            e.target.value,
                          ],
                        }));
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {allLanguages?.map((h) => (
                      <option value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rating */}
              <div className="tagFilter">
                <div>Rating:</div>
                <div className="inputTag">
                  <AddReviewStars
                    filledStars={filledStars}
                    setFilledStars={setFilledStars}
                  />
                </div>
              </div>

              {/* verification */}
              <div className="verificationFilter">
                <input
                  type="checkbox"
                  style={{ width: "20px" }}
                  checked={filters.verification}
                  onChange={() => {
                    setFilters((prev) => ({
                      ...prev,
                      verification: !filters.verification,
                    }));
                  }}
                />
                Verified
              </div>
            </div>
          ) : (
            ""
          )}

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
