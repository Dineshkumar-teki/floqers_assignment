import React from "react";
import tableContext from "../context/tableContext";
import MainTable from "./MainTable";
import LineGraph from "./LineGraph";

const Home = () => {
  return (
    <tableContext.Consumer>
      {(value) => {
        const { mainTableData } = value;
        return (
          <div className="min-h-screen py-10 flex flex-col gap-10 justify-center items-center bg-slate-700">
              {mainTableData.length > 0 && <MainTable />}
            <div className="min-w-[90vw] bg-white rounded-md py-5 flex flex-col items-center">
              <h1 className="text-xl font-semibold">Line Chart</h1>
              <LineGraph />
            </div>
          </div>
        );
      }}
    </tableContext.Consumer>
  );
};

export default Home;
