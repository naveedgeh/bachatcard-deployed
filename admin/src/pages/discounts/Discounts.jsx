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
  CircularProgress,
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
  { id: "image", label: "Image", alignRight: false },
  { id: "brand", label: "Brand", alignRight: false },
  { id: "title", label: "Title", alignRight: false },
  { id: "category", label: "Category", alignRight: false },
  { id: "address", label: "Address", alignRight: false },
  { id: "number", label: "Phone Number", alignRight: false },
  { id: "endDate", label: "End Date", alignRight: false },
  { id: "endTime", label: "End Time", alignRight: false },
  { id: "timeLeft", label: "Time Left", alignRight: false }, // New column for time left
  { id: "qr", label: "QR Code", alignRight: false }, // New column for time left
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

const formatTimeLeft = (timeDifference) => {
  const totalSeconds = Math.floor(timeDifference / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${hours} : ${minutes} : ${seconds}s`;
};

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

export default function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = discounts?.map((n) => n.id);
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

  const deleteClick = (ids) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/discounts`, {
      method: "Delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((response) => response.json())
      .then((findDiscounts) => {
        const arr = findDiscounts?.data?.map((discount) => {
          return {
            id: discount._id,
            title: discount.title,
            brand: discount.brand,
            image: discount.image,
            category: discount.category,
            address: discount.address,
            number: discount.brand?.phoneNumber,
            endDate: discount.endDate,
            endTime: discount.endTime,
          };
        });
        setDiscounts(arr);
      });
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/discounts`)
      .then((response) => response.json())
      .then((findDiscounts) => {
        const arr = findDiscounts?.data?.map((discount) => {
          return {
            id: discount._id,
            title: discount.title,
            brand: discount.brand,
            image: discount.image,
            category: discount.category,
            address: discount.address,
            number: discount.brand?.phoneNumber,
            endDate: discount.endDate,
            endTime: discount.endTime,
          };
        });
        setDiscounts(arr);
        console.log(discounts, "discounts");
      })
      .catch((error) => {
        console.error("Error fetching discounts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      const currentTime = new Date();
      const updatedTimeLeft = {};

      discounts.forEach((discount) => {
        // Parse endDate into a Date object
        const endDate = new Date(discount.endDate);

        // Parse the time components of endTime
        const [hours, minutes] = discount.endTime.split(":");

        // Set the time components for endDate
        endDate.setHours(hours);
        endDate.setMinutes(minutes);

        const difference = endDate - currentTime;
        updatedTimeLeft[discount.id] = difference > 0 ? difference : 0;
      });

      setTimeLeft(updatedTimeLeft);
    }, 1000);

    return () => clearInterval(timerId);
  }, [discounts]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - discounts.length) : 0;

  const filteredDiscounts = applySortFilter(
    discounts,
    getComparator(order, orderBy),
    filterName
  );

  const isDiscountNotFound = filteredDiscounts.length === 0;

  const handleNav = () => {
    navigate("/discounts/add-discount");
  };

  return (
    <Page title="Discount">
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={4.5}
        >
          <Typography variant="h4">Discounts</Typography>
          <Button
            onClick={handleNav}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Discount
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
            <Stack alignItems="center" my={4}>
              <CircularProgress />
            </Stack>
          ) : (
            <>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <ListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={discounts.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredDiscounts
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        ?.map((row) => {
                          const {
                            id,
                            title,
                            brand,
                            image,
                            category,
                            address,
                            number,
                            endTime,
                            endDate,
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
                              <TableCell
                                component="th"
                                scope="row"
                                padding="25"
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={24}
                                >
                                  <img
                                    src={baseURL + image}
                                    width={50}
                                    alt={image}
                                  />
                                </Stack>
                              </TableCell>
                              <TableCell align="left">
                                {brand?.brandname}
                              </TableCell>
                              <TableCell align="left">{title}</TableCell>
                              <TableCell align="left">{category}</TableCell>
                              <TableCell align="left">{address}</TableCell>
                              <TableCell align="left">{number}</TableCell>
                              <TableCell align="left">{endTime}</TableCell>
                              <TableCell align="left">{endDate}</TableCell>
                              <TableCell align="left">
                                {timeLeft[id] > 0
                                  ? formatTimeLeft(timeLeft[id])
                                  : "Expired"}
                              </TableCell>
                              <TableCell align="left">
                                <a
                                  href={
                                    "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
                                    id
                                  }
                                  target="_blank"
                                >
                                  View
                                </a>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={7} />
                        </TableRow>
                      )}
                    </TableBody>

                    {isDiscountNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
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
                count={discounts.length}
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
