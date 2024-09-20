import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";

import { useNavigate } from "react-router-dom";
import tableContext from "../context/tableContext";

const MainTable = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("_id");
  const [selected, setSelected] = React.useState([]);
  const [dense, setDense] = React.useState(false);

  const navigate = useNavigate();

  const headCells = [
    {
      id: "_id",
      numeric: false,
      disablePadding: true,
      label: "Year",
    },
    {
      id: "total_jobs",
      numeric: true,
      disablePadding: false,
      label: "Number of total jobs for that year",
    },
    {
      id: "avg_salary",
      numeric: true,
      disablePadding: false,
      label: "Average salary in USD",
    },
  ];

  function EnhancedTableHead(props) {
    const {
      order,
      orderBy,
      onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              sortDirection={orderBy === headCell.id ? order : false}
              className=""
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  function EnhancedTableToolbar(props) {
    const { numSelected } = props;
    return (
      <Toolbar
        sx={[
          {
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          },
          numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          },
        ]}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Task 1
          </Typography>
        )}
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  return (
    <tableContext.Consumer>
      {(value) => {
        const {
          mainTableData,
          fetchSubTableData,
          fetchMainTableData,
          setYear,
        } = value;

        const handleClickMethod = (year) => {
          const curYear = year
          fetchSubTableData(curYear)
          setYear(year)
          navigate("/subtable")
        };

        const handleRequestSort = (event, property) => {
          setOrderBy(property);
          setOrder(order === "asc" ? "desc" : "asc");
          fetchMainTableData(property, order === "asc" ? -1 : 1);
        };

        return (
          <div className="w-[100%] flex justify-center items-center">
            <Box sx={{ width: "90%" }} >
              <Paper sx={{ width: "100%", mb: 2 }} >
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer className="rounded-lg">
                  <Table
                    sx={{ minWidth: 500 }}
                    aria-labelledby="tableTitle"
                    size={dense ? "small" : "medium"}
                    
                  >
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={mainTableData.length}
                    />
                    <TableBody >
                      {mainTableData.map((row, index) => {
                        const isItemSelected = selected.includes(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            key={row.year}
                            hover
                            onClick={() => handleClickMethod(row.year)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            selected={isItemSelected}
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell align="center">{row.year}</TableCell>
                            <TableCell align="center">
                              {row.totalJobs}
                            </TableCell>
                            <TableCell align="center">
                              {row.avgSalary.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              <FormControlLabel
                control={
                  <Switch checked={dense} onChange={handleChangeDense} />
                }
                label="Dense padding"
                className="text-white px-5 md:px-0"
              />
            </Box>
          </div>
        );
      }}
    </tableContext.Consumer>
  );
};

export default MainTable;
