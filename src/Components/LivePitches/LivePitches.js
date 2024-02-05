import React, { useEffect, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import CloseIcon from "@mui/icons-material/Close";
import "../Conversation/Users/searchBox.css";
import "./LivePitches.css";
import CachedIcon from "@mui/icons-material/Cached";

import SinglePitchetails from "./SinglePitchDetails";
import { useSelector } from "react-redux";
import axios from "axios";
import { CheckBox } from "@mui/icons-material";
import { domain_subdomain, fetchRating, itPositions } from "../../Utils";
import { Country, State } from "country-state-city";
import AddReviewStars from "./AddReviewStars";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import useWindowDimensions from "../Common/WindowSize";
import { FilterPanel } from "../AllUsers/FilterPanel";

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
  "Position",
  "Domain",
  "Tech",
  "Colleges",
  "Country",
  "State",
  "Tags",
  "Others",
];
const LivePitches = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filledStars, setFilledStars] = useState(0);

  const [filters, setFilters] = useState({
    state: [],
    country: [],
    userColleges: [],
    hiringPositions: [],
    tags: [],
    intrested: false,
    industry1: [],
    industry2: [],
    review: 0,
  });
  useEffect(() => {
    setFilters((prev) => ({ ...prev, review: filledStars }));
  }, [filledStars]);
  const { email } = useSelector((state) => state.auth.loginDetails);
  const [universities, setUniversities] = useState([]);
  // useEffect(() => {
  //     axios.get('http://universities.hipolabs.com/search').then(res => {
  //         setUniversities(res.data)
  //     })
  // }, [])

  const [tag, settag] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    ApiServices.livePitches()
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occured",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      filterUsers();
    }
  }, [data, filters]);

  const filterUsers = () => {
    let filteredData = [...data];
    console.log(filters);
    if (Object.keys(filters).length > 0) {
      Object.keys(filters).map((ob) => {
        if (filters[ob].length > 0 || ob == "intrested" || ob == "review") {
          if (
            ob !== "tags" &&
            ob !== "intrested" &&
            ob !== "hiringPositions" &&
            ob !== "industry1" &&
            ob !== "industry2" &&
            ob !== "userColleges" &&
            ob !== "country" &&
            ob !== "state" &&
            ob !== "review"
          ) {
            filteredData = filteredData.filter((f) =>
              filters[ob].includes(f[ob])
            );
          } else if (
            ob === "tags" ||
            ob == "hiringPositions" ||
            ob == "userColleges"
          ) {
            filteredData = filteredData.filter((item) => {
              const itemdata = item[ob].map((t) => t.toLowerCase()) || [];
              return filters[ob].some((tag) =>
                itemdata.includes(tag.toLowerCase())
              );
            });
          } else if (ob == "intrested") {
            if (filters[ob]) {
              filteredData = filteredData.filter((item) => {
                const intrest = item.intrest || [];
                return intrest?.filter((f) => f.email == email).length > 0
                  ? true
                  : false;
              });
            }
          } else if (ob == "industry1" || ob == "industry2") {
            filteredData = filteredData.filter((f) => {
              return filters[ob].some((fs) => fs === f[ob]);
            });
          } else if (ob == "country" || ob == "state") {
            filteredData = filteredData.filter((f) => {
              return filters[ob].some((fs) => fs === f["userInfo"][ob]);
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
      state: [],
      country: [],
      userColleges: [],
      hiringPositions: [],
      tags: [],
      intrested: false,
      industry1: [],
      industry2: [],
      review: 0,
    });
    setFilledStars(0);
  };
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [value, setValue] = useState(0);
  const { height, width } = useWindowDimensions();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
                rawData={itPositions}
                dataKey={"hiringPositions"}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <FilterPanel
                rawData={Object.keys(domain_subdomain)}
                dataKey={"industry1"}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <FilterPanel
                rawData={data}
                dataKey={"industry2"}
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
                rawData={universities}
                dataKey={"userColleges"}
                isFlat={true}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <FilterPanel
                rawData={State?.getAllStates()}
                isCountry={true}
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

        {/* Position */}
        <div className="tagFilter">
          <div>People required:</div>
          {filters.hiringPositions?.length > 0 && (
            <div className="listedTeam">
              {filters.hiringPositions.map((t, i) => (
                <div className="singleMember">
                  <div>{t}</div>
                  <div
                    onClick={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        hiringPositions: [
                          ...filters.hiringPositions.filter((f, j) => i !== j),
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
                if (!filters.hiringPositions.includes(e.target.value)) {
                  setFilters((prev) => ({
                    ...filters,
                    hiringPositions: [
                      ...filters.hiringPositions,
                      e.target.value,
                    ],
                  }));
                }
              }}
            >
              <option value="">Select</option>
              {itPositions.map((h) => (
                <option value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Domain */}
        <div className="tagFilter">
          <div>Domain:</div>
          {filters.industry1?.length > 0 && (
            <div className="listedTeam">
              {filters.industry1.map((t, i) => (
                <div className="singleMember">
                  <div>{t}</div>
                  <div
                    onClick={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        industry1: [
                          ...filters.industry1.filter((f, j) => i !== j),
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
                if (!filters.industry1.includes(e.target.value)) {
                  setFilters((prev) => ({
                    ...filters,
                    industry1: [...filters.industry1, e.target.value],
                  }));
                }
              }}
            >
              <option value="">Select</option>
              {Object.keys(domain_subdomain).map((d) => (
                <option value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tech */}
        <div className="tagFilter">
          <div>Tech:</div>
          {filters.industry2?.length > 0 && (
            <div className="listedTeam">
              {filters.industry2.map((t, i) => (
                <div className="singleMember">
                  <div>{t}</div>
                  <div
                    onClick={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        industry2: [
                          ...filters.industry2.filter((f, j) => i !== j),
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
                if (!filters.industry2.includes(e.target.value)) {
                  setFilters((prev) => ({
                    ...filters,
                    industry2: [...filters.industry2, e.target.value],
                  }));
                }
              }}
            >
              <option value="">Select</option>
              {filters.industry1?.map((d) =>
                domain_subdomain[d]?.map((d) => <option value={d}>{d}</option>)
              )}
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
                        country: [...filters.country.filter((f, j) => i !== j)],
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

        {/* state */}
        {/* <div className='tagFilter'>
                        <div>State:</div>
                        {filters.state?.length > 0 && (
                            <div className="listedTeam">
                                {filters.state.map((t, i) => (
                                    <div className="singleMember">

                                        <div>{t}</div>
                                        <div
                                            onClick={(e) => {
                                                setFilters(
                                                    prev => ({ ...prev, state: [...filters.state.filter((f, j) => i !== j)] })
                                                );
                                            }}
                                        >
                                            <CloseIcon className="deleteMember" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className='inputTag'>
                            <select
                                name="hiringPositions"
                                // value={form?.hiringPositions}
                                onChange={(e) => {
                                    if (!filters.state.includes(e.target.value)) {
                                        setFilters(prev => ({ ...filters, state: [...filters.state, e.target.value] }))
                                    }
                                }}
                            >
                                <option value="">Select</option>
                                {State?.getAllStates().map(h => (
                                    <option value={`${h.name}-${h.isoCode}`}>{h.name}</option>
                                ))}

                            </select>

                        </div>
                    </div> */}

        {/* Tags */}
        <div className="tagFilter">
          <div>Tags</div>
          {filters.tags?.length > 0 && (
            <div className="listedTeam">
              {filters.tags.map((t, i) => (
                <div className="singleMember">
                  <div>{t}</div>
                  <div
                    onClick={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        tags: [...filters.tags.filter((f, j) => i !== j)],
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
            <div>
              <input
                type="text"
                value={tag}
                onChange={(e) => settag(e.target.value)}
              />
            </div>
            <div
              onClick={() => {
                if (tag !== "" && !filters.tags.includes(tag)) {
                  setFilters((prev) => ({
                    ...prev,
                    tags: [...filters.tags, tag],
                  }));
                  settag("");
                }
              }}
            >
              <i className="fas fa-plus"></i>
            </div>
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

        {/* Intrested */}
        <div className="intrestedFilter">
          <input
            type="checkbox"
            style={{ width: "20px" }}
            checked={filters.intrested}
            onChange={() => {
              setFilters((prev) => ({
                ...prev,
                intrested: !filters.intrested,
              }));
            }}
          />
          Interested
        </div>
      </div>
      <div className="livePitchesContainer">
        <div className="livePitchesWrapper">
          <div className="user-nav-bar" style={{ margin: 0 }}>
            <button className="nav-bar-buttons" onClick={handleClickOpen}>
              <i style={{ marginRight: 3 }} class="fa fa-filter" /> Filter
            </button>
            <button className="nav-bar-buttons">
              <i class="fa fa-sort-amount-desc"></i>
              Sort by
            </button>
          </div>
          <div className="pitchcontainer">
            {filteredData.length > 0 ? (
              filteredData?.map((d) => <SinglePitchetails d={d} />)
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                No Pitches Available
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LivePitches;
