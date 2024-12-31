import React, { useState, useEffect } from "react";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
import { baseURL } from "../../constants/baseURL";
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  Box,
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
import MoreMenu from "../../components/MoreMenu";
import { useNavigate } from "react-router-dom";

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "phoneNumber", label: "Phone Number", alignRight: false },
  { id: "" },
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
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Users() {
  const [USERLIST, setUSERLIST] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  function deleteClick(arr) {
    console.log(arr);
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/user/deleteuser`, {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: arr }),
    })
      .then((response) => response.json())
      .then((findUsers) => {
        const arr = findUsers.data.map((user) => ({
          id: user._id,
          name: user.firstname + " " + user.lastname,
          email: user.username,
          status: user.status ? true : false,
          phoneNumber: user.phoneNumber,
        }));
        setUSERLIST(arr);
      });
  }

  function deactivateClick(arr) {
    console.log(arr);
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/user/deactivateuser`, {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: arr }),
    })
      .then((response) => response.json())
      .then((findUsers) => {
        console.log(findUsers);
        const arr = findUsers.data.map((user) => ({
          id: user._id,
          name: user.firstname + " " + user.lastname,
          email: user.username,
          status: user.status ? true : false,
          phoneNumber: user.phoneNumber,
        }));
        setUSERLIST(arr);
      });
  }

  function activateClick(arr) {
    console.log(arr);
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/user/activateuser`, {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: arr }),
    })
      .then((response) => response.json())
      .then((findUsers) => {
        const arr = findUsers.data.map((user) => ({
          id: user._id,
          name: user.firstname + " " + user.lastname,
          email: user.username,
          status: user.status ? true : false,
          phoneNumber: user.phoneNumber,
        }));
        setUSERLIST(arr);
      });
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/user/getallusers`)
      .then((response) => response.json())
      .then((findUsers) => {
        const arr = findUsers.data.map((user) => ({
          id: user._id,
          name: user.firstname + " " + user.lastname,
          email: user.username,
          status: user.status ? true : false,
          phoneNumber: user.phoneNumber,
        }));
        setUSERLIST(arr);
        setLoading(false); // Stop loading once data is fetched
      });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.id);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(
    USERLIST,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  const handleNav = () => {
    navigate("/users/add-user");
  };

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={4.5}
        >
          <Typography variant="h4">Users</Typography>
          <Button
            onClick={handleNav}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New User
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

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <ListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={USERLIST.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const {
                            id,
                            name,
                            email,
                            status,
                            phoneNumber,
                          } = row;
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
                                  onChange={(event) =>
                                    handleClick(event, id)
                                  }
                                />
                              </TableCell>
                              <TableCell component="th" scope="row" padding="none">
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Avatar alt={name} />
                                  <Typography variant="subtitle2" noWrap>
                                    {name}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{email}</TableCell>
                              <TableCell align="left">
                                {status ? (
                                  <Iconify icon="subway:tick" color="#409c52" />
                                ) : (
                                  <Iconify
                                    icon="flat-color-icons:cancel"
                                    width={22}
                                    height={22}
                                  />
                                )}
                              </TableCell>
                              <TableCell align="left">{phoneNumber}</TableCell>

                              <TableCell align="right">
                                <MoreMenu
                                  active={status}
                                  deleteHandler={deleteClick}
                                  deactivateHandler={deactivateClick}
                                  activateHandler={activateClick}
                                  id={id}
                                />
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

                    {isUserNotFound && (
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
                count={USERLIST.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Card>
      </Container>
    </Page>
  );
}
