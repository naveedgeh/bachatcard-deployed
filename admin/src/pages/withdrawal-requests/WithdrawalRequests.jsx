import { filter } from "lodash";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
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
  CircularProgress,
  Box,
} from "@mui/material";
import { Page, Scrollbar, SearchNotFound } from "src/components";
import ListHead from "../../components/ListHead";
import ListToolbar from "../../components/ListToolbar";

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
        _user.accountTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

function convertToCSV(data, total, totalpayable, adminfee) {
  const header = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(","));
  const totalFeeRow = `Total,,,,,${total},${adminfee},${totalpayable}`; // Assuming the total and fee are the last two columns
  return [header, ...rows, totalFeeRow].join("\n");
}

export default function Users() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true); // State to manage loading
  const [USERLIST, setUSERLIST] = useState([]);
  const [total, setTotal] = useState(0);
  const [adminFee, setAdminFee] = useState(0.15);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const TABLE_HEAD = [
    { id: "paymentMethod", label: "Method", alignRight: false },
    { id: "accountTitle", label: "Account Title", alignRight: false },
    { id: "phoneNumber", label: "Phone Number", alignRight: false },
    { id: "IBAN", label: "IBAN", alignRight: false },
    { id: "amount", label: "Amount", alignRight: false },
    { id: "adminfee", label: `Fee ${adminFee * 100} %`, alignRight: false },
    { id: "payable", label: "Payable", alignRight: false },
    { id: "status", label: "Status", alignRight: false },
    { id: "createdAt", label: "Date", alignRight: false },
    { id: "" },
  ];

  useEffect(() => {
    fetchAdminFee();
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/user/wallet/withdrawal`)
      .then((response) => response.json())
      .then((findRequests) => {
        const arr = findRequests.data.map((request) => ({
          id: request._id,
          paymentMethod: request.paymentMethod,
          accountTitle: request.accountTitle,
          phoneNumber: request.phoneNumber,
          IBAN: request.IBAN,
          amount: request.amount,
          adminfee: adminFee * request.amount,
          payable: request.amount - adminFee * request.amount,
          status: request.status,
          createdAt: request.createdAt,
        }));
        setUSERLIST(arr);
        updateTotalAmount(arr);
        setLoading(false);
      });
  }, [adminFee]);

  useEffect(() => {
    filterData();
  }, [startDate, endDate, adminFee]);

  const fetchAdminFee = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/fee`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    setAdminFee(parseInt(result?.data?.fee) / 100);
  };

  const filterData = () => {
    const filteredData = USERLIST.filter((user) => {
      const userDate = new Date(user.createdAt);
      return (
        (!startDate || userDate >= new Date(startDate)) &&
        (!endDate || userDate <= new Date(endDate))
      );
    });
    updateTotalAmount(filteredData);
  };

  const updateTotalAmount = (users) => {
    const totalAmount = users.reduce((total, user) => total + user.amount, 0);
    setTotal(totalAmount);
  };

  const acceptModal = async (id) => {
    const isConfirmed = window.confirm("Do you want to accept?");
    if (isConfirmed) {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/user/wallet/withdrawal/accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id }),
        }
      )
        .then((response) => response.json())
        .then((findRequests) => {
          enqueueSnackbar(findRequests.message, { variant: "success" });
          const arr = findRequests.data.map((request) => ({
            id: request._id,
            paymentMethod: request.paymentMethod,
            accountTitle: request.accountTitle,
            phoneNumber: request.phoneNumber,
            IBAN: request.IBAN,
            amount: request.amount,
            adminfee: adminFee * request.amount,
            payable: request.amount - adminFee * request.amount,
            status: request.status,
            createdAt: request.createdAt,
          }));
          setUSERLIST(arr);
          filterData(); // Update filtered data after accepting
        });
    }
  };
  
  const declineModal = async (id) => {
    const isConfirmed = window.confirm("Do you want to decline?");
    if (isConfirmed) {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/user/wallet/withdrawal/decline`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id }),
        }
      )
        .then((response) => response.json())
        .then((findRequests) => {
          enqueueSnackbar(findRequests.message, { variant: "success" });
          const arr = findRequests.data.map((request) => ({
            id: request._id,
            paymentMethod: request.paymentMethod,
            accountTitle: request.accountTitle,
            phoneNumber: request.phoneNumber,
            IBAN: request.IBAN,
            amount: request.amount,
            adminfee: adminFee * request.amount,
            payable: request.amount - adminFee * request.amount,
            status: request.status,
            createdAt: request.createdAt,
          }));
          setUSERLIST(arr);
          filterData(); // Update filtered data after declining
        });
    }
  };  

  const handleDownloadCSV = () => {
    const totalpayable = total - adminFee * total;
    const adminfee = adminFee * total;
    const csvContent = convertToCSV(
      filteredUsers,
      total,
      totalpayable,
      adminfee
    );
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "withdrawal_request.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const dateFilter = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const filteredUsers = applySortFilter(
    USERLIST.filter((user) => {
      const accountTitleMatch = user.accountTitle
        .toLowerCase()
        .includes(filterName.toLowerCase());
      const startDateMatch =
        !startDate || new Date(user.createdAt) >= new Date(startDate);
      const endDateMatch =
        !endDate || new Date(user.createdAt) <= new Date(endDate);
      return accountTitleMatch && startDateMatch && endDateMatch;
    }),
    getComparator(order, orderBy)
  );

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0;

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={4.5}
        >
          <Typography variant="h4">Requests</Typography>
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
            dateFilter={dateFilter}
            text="Total Payable"
            total={total - adminFee * total}
            feetext="Admin Fee"
            fee={adminFee * total}
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
                      rowCount={filteredUsers.length}
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
                            paymentMethod,
                            accountTitle,
                            phoneNumber,
                            IBAN,
                            amount,
                            adminfee,
                            payable,
                            status,
                            createdAt,
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
                                  onChange={(event) => handleClick(event, id)}
                                />
                              </TableCell>
                              <TableCell align="left">
                                {paymentMethod}
                              </TableCell>
                              <TableCell align="left">{accountTitle}</TableCell>
                              <TableCell align="left">{phoneNumber}</TableCell>
                              <TableCell align="left">{IBAN}</TableCell>
                              <TableCell align="left">{amount}</TableCell>
                              <TableCell align="left">{adminfee}</TableCell>
                              <TableCell align="left">{payable}</TableCell>
                              <TableCell align="left">{status}</TableCell>
                              <TableCell align="left">
                                {new Date(createdAt).toISOString().slice(0, 10)}
                              </TableCell>
                              <TableCell align="right">
                                <Button
                                  onClick={() => acceptModal(id)}
                                  variant="contained"
                                  sx={{ mr: 1 }}
                                  disabled={status === "accepted"} // Proper conditional check
                                >
                                  Accept
                                </Button>

                                <Button
                                  onClick={(e) => declineModal(id)}
                                  variant="outlined"
                                  disabled={status === "declined"}
                                >
                                  Decline
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={11} />
                        </TableRow>
                      )}
                      {isUserNotFound && (
                        <TableRow>
                          <TableCell align="center" colSpan={11} sx={{ py: 3 }}>
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
                count={filteredUsers.length}
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
