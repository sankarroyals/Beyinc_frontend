import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box } from "@mui/material";

const ConnectionsData = [
  { id: 0, value: 10, label: "Mentors" },
  { id: 1, value: 15, label: "Entrepreneur" },
  { id: 2, value: 20, label: "Investors" },
];

const PitchesData = [
  { id: 0, value: 5, label: "Accepted" },
  { id: 1, value: 25, label: "Pending" },
  { id: 2, value: 15, label: "Rejected" },
];

const connectionColors = ["#4e54c7", "#ff6824", "#1799ac"];
const pitchesColors = ["green", "orange", "red"];

export default function PieActiveArc() {
  return (
    <div>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <Box sx={{ width: 1, maxWidth: 600, marginRight: "20px" }}>
          <label>Connections</label>
          <PieChart
            colors={connectionColors}
            series={[
              {
                data: ConnectionsData,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            height={200}
          />
        </Box>
        <Box sx={{ width: 1, maxWidth: 600 }}>
          <label>Pitches</label>
          <PieChart
            colors={pitchesColors}
            series={[
              {
                data: PitchesData,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            height={200}
          />
        </Box>
      </Box>
    </div>
  );
}
