import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
const SingleUserDetails = ({ d }) => {
  const { email } = useSelector((state) => state.auth.loginDetails);
  const [averagereview, setAverageReview] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    setAverageReview(0);
    if (d.review !== undefined && d.review.length > 0) {
      let avgR = 0;
      d.review?.map((rev) => {
        avgR += rev.review;
      });
      setAverageReview(avgR / d.review.length);
    }
  }, [d]);
  return (
    <Card
      sx={{
        maxWidth: 340,
        minWidth: 250,
        height: "300px",
        boxShadow:
          "2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: "24px",
          flexWrap: "wrap",
          gap: "5px",
        }}
      >
        <img
          className="userCardImage"
          src={
            d.image !== undefined && d.image.url !== ""
              ? d.image.url
              : "/profile.jpeg"
          }
          title={d.email}
        />
        <div>
          <div
            style={{ fontWeight: "600", marginTop: "40px", marginLeft: "10px", display: "flex", justifyContent: 'center', alignItems: 'center' }}
          >
            {d.role}
            {d.verification == "approved" && (
              <img
                src="/verify.png"
                alt=""
                style={{ width: "15px", height: "15px", marginLeft: "5px" }}
              />
            )}
          </div>
          <Typography
            gutterBottom
            component="div"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "12px",
            }}
          >
           <b> {d.userName}</b>
          </Typography>
          <div style={{ display: "flex", gap: "10px", justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              title="total comments"
            >
              <i class="far fa-comment"></i>
              <span style={{ marginLeft: "3px" }}>{d.comments?.length}</span>
            </div>
            <div
              style={{ fontSize: "12px", marginLeft: "5px" }}
              title="total stars"
            >
              <i className="fas fa-star" ></i>
              <span style={{ marginLeft: "3px" }}>{averagereview}</span>
            </div>
          </div>
        </div>
      </div>
      <CardContent>
        <div style={{ display: "flex", gap: "5px" }}>
          <div>
            <label className="indiPitchHiringPositions">College:</label>
          </div>
          <div className="indiPitchHiringPositions">
            {d.educationDetails[0]?.college}
          </div>
        </div>

        <div style={{ display: "flex", gap: "5px" }}>
          <div>
            <label className="indiPitchHiringPositions">Degree:</label>
          </div>
          <div className="indiPitchHiringPositions">
            {d.educationDetails[0]?.grade}
          </div>
        </div>

        <div style={{ display: "flex", gap: "5px" }}>
          <div>
            <label className="indiPitchHiringPositions">Skills:</label>
          </div>
          <div style={{ maxHeight: "45px", overflowY: "scroll" }}>
            {d.skills?.length > 0 && (
              <div className="" style={{ display: "flex", flexWrap: "wrap" }}>
                {d.skills?.map((t, i) => (
                  <div className="indiPitchHiringPositions">
                    <div>{t}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* <Typography gutterBottom variant="h5" component="div" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {d.userName}
                </Typography> */}
      </CardContent>
      {/* <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {d.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                </Typography>
            </CardContent> */}
      <CardActions>
        <Button
          id="view-request"
          size="small"
          onClick={() => {
            navigate(`/user/${d.email}`);
          }}
        >
          View Profile
        </Button>
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
};

export default SingleUserDetails;
