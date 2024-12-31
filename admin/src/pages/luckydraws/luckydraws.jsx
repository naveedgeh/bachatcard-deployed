import { filter } from "lodash";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { baseURL } from "../../constants/baseURL";
// material
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
// components
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "timeframe", label: "Lucky Draw Time Frame", alignRight: false },
  { id: "items", label: "Items", alignRight: false },
  { id: "createdAt", label: "Start Date", alignRight: false },
  { id: "endDate", label: "End Date", alignRight: false },
];

// ----------------------------------------------------------------------

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
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (item) => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function LuckyDraws() {
  const [luckyDrawsList, setLuckyDrawsList] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = luckyDrawsList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - luckyDrawsList.length)
      : 0;

  const filteredLuckyDraws = applySortFilter(
    luckyDrawsList,
    getComparator(order, orderBy),
    filterName
  );

  const isLuckyDrawNotFound = filteredLuckyDraws.length === 0;

  const handleNav = () => {
    navigate("/luckydraws/add-luckydraw");
  };

  // Function to handle deletion of lucky draws
  function deleteClick(arr) {
    console.log(arr);
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/luckydraws`, {
      method: "Delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: arr }),
    })
      .then((response) => response.json())
      .then((findLuckyDraws) => {
        const updatedList = findLuckyDraws.data.map((luckyDraw) => ({
          id: luckyDraw._id,
          timeframe: luckyDraw.timeframe,
          items: luckyDraw.items,
          createdAt: luckyDraw.createdAt,
        }));
        setLuckyDrawsList(updatedList);
      });
  }

  // Fetching lucky draws data on component mount
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/luckydraws`)
      .then((response) => response.json())
      .then((findLuckyDraws) => {
        const luckyDraws = findLuckyDraws.data.map((luckyDraw) => ({
          id: luckyDraw._id,
          timeframe: luckyDraw.timeframe,
          items: luckyDraw.items,
          createdAt: luckyDraw.createdAt,
          expired: luckyDraw.expired
        }));
        setLuckyDrawsList(luckyDraws);
      });
  }, []);

  return (
    <Page title="Lucky Draws">
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={4.5}
        >
          <Typography variant="h4">Lucky Draws</Typography>
          <Button
            onClick={handleNav}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Lucky Draw
          </Button>
        </Stack>

        <Card
          sx={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", mb: 1 }}
        >
          <ListToolbar
            selected={selected}
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            deleteHandler={deleteClick}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={luckyDrawsList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredLuckyDraws
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, timeframe, expired, items, createdAt } = row;
                      const isItemSelected = selected.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
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
                          <TableCell component="th" scope="row" padding="25">
                            {timeframe.duration + " " + timeframe.type}
                          </TableCell>
                          <TableCell align="left">{items.join(", ")}</TableCell>
                          <TableCell align="left">
                            {expired == false ? new Date(createdAt).toISOString().slice(0, 10) : "0000-00-00"}
                          </TableCell>
                          <TableCell align="left">
                            {expired == false ? (() => {
                              const createdAtDate = new Date(createdAt);
                              const { duration, type } = timeframe;

                              if (type === "month") {
                                createdAtDate.setMonth(
                                  createdAtDate.getMonth() + parseInt(duration)
                                );
                              } else if (type === "day") {
                                createdAtDate.setDate(
                                  createdAtDate.getDate() + parseInt(duration)
                                );
                              } else {
                                throw new Error("Invalid timeframe type");
                              }

                              return createdAtDate.toISOString().slice(0, 10);
                            })() : "0000-00-00" }
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isLuckyDrawNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
            component="div"
            count={luckyDrawsList.length}
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
