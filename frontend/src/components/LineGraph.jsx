import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import tableContext from "../context/tableContext";

const LineGraph = () => {
  return (
    <tableContext.Consumer>
      {(value) => {
        const { mainTableData } = value;
        return (
          <>
            <div className="max-md:hidden">
              <LineChart
                dataset={mainTableData}
                xAxis={[{ dataKey: "year" }]}
                series={[{ dataKey: "totalJobs" }]}
                height={400}
                width={500}
                grid={{ vertical: true, horizontal: true }}
              />
            </div>
            <div className="md:hidden">
              <LineChart
                dataset={mainTableData}
                xAxis={[{ dataKey: "year" }]}
                series={[{ dataKey: "totalJobs" }]}
                height={300}
                width={350}
                grid={{ vertical: true, horizontal: true }}
              />
            </div>
          </>
        );
      }}
    </tableContext.Consumer>
  );
};

export default LineGraph;
