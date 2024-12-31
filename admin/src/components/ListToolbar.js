import PropTypes from "prop-types";
import React, { useState } from "react";
// material
import { styled } from "@mui/material/styles";
import {
  Toolbar,
  Tooltip,
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
// component
import Iconify from "../components/Iconify";

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
  "& legend": {
    display: "none",
  },
}));

// ----------------------------------------------------------------------

ListToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  filterName: PropTypes.string,
  selected: PropTypes.array.isRequired,
  onFilterName: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  dateFilter: PropTypes.func,
  total: PropTypes.number,
  handleDownloadCSV: PropTypes.func,
};

export default function ListToolbar({
  numSelected,
  filterName,
  onFilterName,
  selected,
  deleteHandler,
  dateFilter,
  text,
  total,
  feetext, 
  fee, 
  handleDownloadCSV,
}) {
  const [formInputs, setFormInputs] = useState({
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "endDate") {
      dateFilter(formInputs.startDate, value);
    }
  };

  const deleteManyHandler = (event) => {
    event.preventDefault();
    deleteHandler(selected);
  };

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: "primary.main",
          bgcolor: "primary.lighter",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        !dateFilter && (
          <SearchStyle
            value={filterName}
            onChange={onFilterName}
            placeholder="Search..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: "text.disabled", width: 20, height: 20 }}
                />
              </InputAdornment>
            }
          />
        )
      )}

      {dateFilter && (
        <Box sx={{ display: "flex" }}>
          <TextField
            value={formInputs.startDate}
            onChange={handleChange}
            name="startDate"
            required
            type="date"
          />
          <TextField
            value={formInputs.endDate}
            sx={{ marginLeft: "15px" }}
            onChange={handleChange}
            name="endDate"
            required
            type="date"
          />
        </Box>
      )}

      {fee !== undefined && (
        <Box
          sx={{
            background: "#F9921E",
            color: "#fff",
            padding: "10px",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" sx={{ mr: 1, fontWeight: "500", fontSize: "14px" }}>
            {feetext}: 
          </Typography>
          <Typography variant="body1" sx={{ mr: 1, fontWeight: "700", fontSize: "16px" }}>
            {fee}
          </Typography>
        </Box>
      )}

      {total !== undefined && (
        <Box
          sx={{
            background: "#F9921E",
            color: "#fff",
            padding: "10px",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" sx={{ mr: 1, fontWeight: "500", fontSize: "14px" }}>
            {text}: 
          </Typography>
          <Typography variant="body1" sx={{ mr: 1, fontWeight: "700", fontSize: "16px" }}>
            {total}
          </Typography>
        </Box>
      )}

      {numSelected > 0 && deleteHandler ? (
        <Tooltip title="Delete">
          <IconButton onClick={deleteManyHandler}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        handleDownloadCSV && (
          <Button variant="contained" onClick={handleDownloadCSV}>
            Download CSV
          </Button>
        )
      )}
    </RootStyle>
  );
}
