import React from "react";

const tableContext = React.createContext({
  mainTableData: [],
  subTableData: [],
  year: 2024,
  setYear: () => {},
  fetchSubTableData: () => {},
  fetchMainTableData: () => {},
  sortSubTableData:() => {}
});

export default tableContext;
