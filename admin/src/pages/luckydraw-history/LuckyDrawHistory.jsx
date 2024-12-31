import React, { useState, useEffect } from "react";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
import { baseURL } from "../../constants/baseURL";
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@mui/material";
import {
  Page,
  Label,
  Scrollbar,
  Iconify,
  SearchNotFound,
} from "src/components";
import ListHead from "../../components/ListHead";
import ListToolbar from "../../components/ListToolbar";
import { useNavigate } from "react-router-dom";

const TABLE_HEAD = [
  { id: "username", label: "Username", alignRight: false },
  { id: "name", label: "Full Name", alignRight: false },
  { id: "phoneNumber", label: "Phone Number", alignRight: false },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_Discount) =>
        _Discount.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

// Define a function to convert data to CSV format
function convertToCSV(data) {
  const header = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(","));
  return [header, ...rows].join("\n");
}

export default function LuckyDraws() {
  const [luckydraws, setLuckyDraws] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("title");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/luckydraws`)
      .then((response) => response.json())
      .then((findLuckyDraws) => {
        const arr = findLuckyDraws?.data?.map((luckydraw) => {
          return {
            id: luckydraw._id,
            items: luckydraw.items,
            winners: luckydraw.winners,
          };
        });
        setLuckyDraws(arr);
      });
  }, []);

  // Function to handle CSV download
  const handleDownloadCSV = () => {
    const csvContent = convertToCSV(luckydraws);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "discount_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - luckydraws.length) : 0;

  const filteredLuckyDraws = applySortFilter(
    luckydraws,
    getComparator(order, orderBy),
    filterName
  );

  const isDiscountNotFound = filteredLuckyDraws.length === 0;

  return (
    <Page title="Lucky Draw Winners History">
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={4.5}
        >
          <Typography variant="h4">Lucky Draw Winners History</Typography>
        </Stack>

        <Card
          sx={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", mb: 1 }}
        >
          <ListToolbar
            selected={selected}
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            handleDownloadCSV={handleDownloadCSV}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={luckydraws.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {console.log(filteredLuckyDraws)}
                  {filteredLuckyDraws
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((row) => {
                      const { id, items, winners } = row;
                      return (
                        <React.Fragment key={id}>
                          {winners?.map((item, index) => {
                            const {
                              username,
                              phoneNumber,
                              firstname,
                              lastname,
                            } = item;
                            const isItemSelected =
                              selected.indexOf(id + index) !== -1;
                            return (
                              <TableRow
                                hover
                                key={id + index}
                                tabIndex={-1}
                                role="checkbox"
                                selected={isItemSelected}
                                aria-checked={isItemSelected}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={isItemSelected}
                                    onChange={(event) => handleClick(event, id)}
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  {firstname + lastname}
                                </TableCell>
                                <TableCell align="left">{username}</TableCell>
                                <TableCell align="left">
                                  {phoneNumber}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={7} />
                    </TableRow>
                  )}
                  {isDiscountNotFound && (
                    <TableRow>
                      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
            component="div"
            count={luckydraws.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
