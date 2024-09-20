import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SubTable from "./components/SubTable";
import TableContext from "./context/tableContext";

const App = () => {
  const [mainTableData, setMainTableData] = useState([]);
  const [subTableData, setSubTableData] = useState([]);
  const [year, setYear] = useState(2024);

  useEffect(() => {
    fetchMainTableData();
    fetchSubTableData();
  }, []);

  const fetchMainTableData = (field, sort) => {
    axios
      .get(`http://localhost:3002/?field=${field}&sort=${sort}`)
      .then((res) => {
        const data = res.data;
        const formatedData = data.map((item) => ({
          year: item._id,
          totalJobs: item.total_jobs,
          avgSalary: item.avg_salary,
        }));
        setMainTableData(formatedData);
      })
      .catch((err) => console.log(err));
  };

  const fetchSubTableData = (curYear) => {
    axios
      .get(`http://localhost:3002/subtable?year=${curYear}`)
      .then((res) => {
        const data = res.data;
        const formatedData = data.map((item) => ({
          jobTitle: item._id,
          totalJobs: item.jobs,
        }));
        setSubTableData(formatedData);
      })
      .catch((err) => console.log(err));
  };

  const sortSubTableData = (property, sort) => {
    axios
      .get(`http://localhost:3002/subtable?field=${property}&sort=${sort}&year=${year}`)
      .then((res) => {
        const data = res.data;
        const formatedData = data.map((item) => ({
          jobTitle: item._id,
          totalJobs: item.jobs,
        }));
        setSubTableData(formatedData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <TableContext.Provider
      value={{
        mainTableData,
        subTableData,
        year,
        setYear: setYear,
        fetchSubTableData: fetchSubTableData,
        fetchMainTableData: fetchMainTableData,
        sortSubTableData: sortSubTableData
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subtable" element={<SubTable />} />
      </Routes>
    </TableContext.Provider>
  );
};

export default App;
