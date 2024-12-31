import React, { useState, useEffect } from "react";
import { filter } from "lodash";
import { useNavigate } from "react-router-dom";
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
  Avatar,
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
import MoreMenu from "../../components/MoreMenu";

const TABLE_HEAD = [
  { id: "brand", label: "Brand", alignRight: false },
  { id: "title", label: "Title", alignRight: false },
  { id: "username", label: "Username", alignRight: false },
  { id: "price", label: "Price", alignRight: false },
  { id: "createdAt", label: "Create Date", alignRight: false },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
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

const renderDiscountRows = (filteredDiscounts, page, rowsPerPage, selected, handleClick, filterName) => {
  return filteredDiscounts
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    ?.map((row) => {
      const { id, title, brand, history } = row;
      return history.length > 0 ? (
        <React.Fragment key={id}>
          {history.map((item, index) => {
            const { username, price, createdAt } = item;
            const isItemSelected = selected.indexOf(id + index) !== -1;
            return (
              <TableRow
                hover
                key={`${id}-${index}`}
                tabIndex={-1}
                role="checkbox"
                selected={isItemSelected}
                aria-checked={isItemSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isItemSelected}
                    onChange={(event) => handleClick(event, id + index)}
                  />
                </TableCell>
                <TableCell align="left">{brand?.brandname}</TableCell>
                <TableCell align="left">{title}</TableCell>
                <TableCell align="left">{username}</TableCell>
                <TableCell align="left">{price}</TableCell>
                <TableCell align="left">{createdAt}</TableCell>
              </TableRow>
            );
          })}
        </React.Fragment>
      ) : (
        <TableRow key={id}>
          <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
            <SearchNotFound searchQuery={filterName} />
          </TableCell>
        </TableRow>
      );
    });
};

export default function Discounts() {
  const [discounts, setDiscounts] = useState([]);
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
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/discounts`)
      .then((response) => response.json())
      .then((findDiscounts) => {
        const arr = findDiscounts?.data?.map((discount) => ({
          id: discount._id,
          title: discount.title,
          brand: discount.brand,
          image: discount.image,
          category: discount.category,
          endDate: discount.endDate,
          endTime: discount.endTime,
          history: discount.history,
        }));
        setDiscounts(arr);
        setLoading(false); // Set loading to false after data is fetched
      });
  }, []);

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

  // Function to handle CSV download
  const handleDownloadCSV = () => {
    const csvContent = convertToCSV(discounts);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - discounts.length) : 0;

  const filteredDiscounts = applySortFilter(
    discounts,
    getComparator(order, orderBy),
    filterName
  );

  const isDiscountNotFound = filteredDiscounts.length === 0;

  return (
    <Page title="Discount History">
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={4.5}
        >
          <Typography variant="h4">Discount History</Typography>
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
          {loading ? ( // Render loader while loading
            <Stack alignItems="center" my={5}>
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
                    />
                    <TableBody>
                      {renderDiscountRows(
                        filteredDiscounts,
                        page,
                        rowsPerPage,
                        selected,
                        handleClick,
                        filterName
                      )}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={7} />
                        </TableRow>
                      )}
                    </TableBody>
                    {isDiscountNotFound && (
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
