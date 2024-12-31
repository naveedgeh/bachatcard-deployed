import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Container, Grid } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBackHeader, Page } from "src/components";
import {
  Stack,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { DataGrid } from "@mui/x-data-grid";

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 580,
  display: "flex",
  justifyContent: "start",
  flexDirection: "column",
  padding: theme.spacing(6, 2),
}));
const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "productName", headerName: "Product Name", width: 130 },
  { field: "productPrice", headerName: "Product Price", width: 130 },
  { field: "number1", headerName: "Payment Method 1", width: 130 },
  { field: "number2", headerName: "Payment Method 2", width: 130 },
];
const columns1 = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "levelName", headerName: "Level Name", width: 130 },
  { field: "levelPrice", headerName: "Level Percentage", width: 130 },
];

const product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [Levels, setLevels] = useState([]);
  const [formInputs, setFormInputs] = useState({
    productname: "",
    productprice: "",
    number1: "",
    number2: "",
  });

  const [coinPrice, setCoinPrice] = useState({
    coinprice: "",
  });

  let initialInputs = [
    { level1: "", price1: "" },
    { level2: "", price2: "" },
    { level3: "", price3: "" },
    { level4: "", price4: "" },
    { level5: "", price5: "" },
  ];
  const [levelInputs, setLevelInputs] = useState(initialInputs);

  const [adPrice, setAdPrice] = useState({
    adprice: "",
  });

  const [adminFee, setAdminFee] = useState({
    adminFee: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCoinLoading, setCoinLoading] = useState(false);
  const [isAdLoading, setAdLoading] = useState(false);
  const [isFeeLoading, setFeeLoading] = useState(false);
  const [isLevelLoading, setLevelLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    console.log(Levels);
    if (Levels.length > 0) {
      initialInputs = Levels.map((level, index) => ({
        [`level${index + 1}`]: level.levelName,
        [`price${index + 1}`]: level.levelPrice,
      }));
      console.log("testing", initialInputs);
      setLevelInputs(initialInputs);
    }
  }, [Levels]);
  const handleNav = () => {
    navigate(-1);
  };

  useEffect(() => {
    fetchProduct();
    fetchCoinPrice();
    fetchAdPrice();
    fetchAdminFee();
    fetchLevelProduct();
  }, []);

  const handleChange = (e) => {
    const { target } = e;
    setFormInputs({ ...formInputs, [target.name]: target.value });
  };
  const handleLevelChange = (e, index) => {
    const { name, value } = e.target;
    setLevelInputs((prevInputs) =>
      prevInputs.map((input, i) =>
        i === index ? { ...input, [name]: value } : input
      )
    );
  };

  const dataPrepare = (data = {}) => {
    let productData = [];
    // for (let i = 0; i < data.length; i++) {
    let newProduct = {
      id: 1,
      productName: data.name,
      productPrice: data.price,
      number1: data.paymentNumber1,
      number2: data.paymentNumber2,
    };
    productData.push(newProduct);
    // }
    return productData;
  };

  const dataLevelPrepare = (data = []) => {
    let levelData = [];
    for (let i = 0; i < data.length; i++) {
      let newLevel = {
        id: i + 1,
        levelName: data[i].level,
        levelPrice: data[i].percentagePrice,
      };
      levelData.push(newLevel);
    }

    return levelData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/[0-9]/.test(formInputs.number1)) {
      enqueueSnackbar("Please add a phone number", { variant: "error" });
      return 0;
    }
    if (!/[0-9]/.test(formInputs.number2)) {
      enqueueSnackbar("Please add a phone number", { variant: "error" });
      return 0;
    }

    console.log(formInputs, "formInputs");
    const data = new FormData();
    data.append("name", formInputs.productname?.trim());
    data.append("price", formInputs.productprice?.trim());
    data.append("paymentNumber1", formInputs.number1?.trim());
    data.append("paymentNumber2", formInputs.number2?.trim());

    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/create`, {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          fetchProduct();
          enqueueSnackbar("Succussfuly Add", { variant: "sucess" });
          setIsLoading(false);
        } else {
          enqueueSnackbar(data.message, { variant: "error" });
          setIsLoading(false);
          setFormInputs({ productname: "", productprice: "" });
        }
      });
  };
  const handleSubmitPrice = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("coin", coinPrice.coinprice);

    setCoinLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/coin`, {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          fetchCoinPrice();
          enqueueSnackbar(data.message, { variant: "sucess" });
          setCoinLoading(false);
        } else {
          enqueueSnackbar(data.message, { variant: "error" });
          setCoinLoading(false);
        }
      });
  };
  const handleSubmitAd = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("ad", adPrice.adprice);

    setCoinLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/ad`, {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          fetchAdPrice();
          enqueueSnackbar(data.message, { variant: "sucess" });
          setAdLoading(false);
        } else {
          enqueueSnackbar(data.message, { variant: "error" });
          setAdLoading(false);
        }
      });
  };
  const handleSubmitFee = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fee", adminFee.adminFee);

    setCoinLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/fee`, {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          fetchAdminFee();
          enqueueSnackbar(data.message, { variant: "sucess" });
          setFeeLoading(false);
        } else {
          enqueueSnackbar(data.message, { variant: "error" });
          setFeeLoading(false);
        }
      });
  };

  const handleLevelSubmit = async (e) => {
    e.preventDefault();

    for (const input of levelInputs) {
      if (!/[0-9]/.test(input[`level${levelInputs.indexOf(input) + 1}`])) {
        enqueueSnackbar("Please add a Level", { variant: "error" });
        return;
      }
    }

    const data = new FormData();
    // levelInputs.forEach((input, index) => {
    //   data.append(`level${index + 1}`, input[`level${index + 1}`].trim());
    //   data.append(`price${index + 1}`, input[`price${index + 1}`].trim());
    // });
    console.log("naveed", levelInputs);
    data.append("levelInputs", JSON.stringify(levelInputs));
    setLevelLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/level-create`, {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          fetchLevelProduct();
          enqueueSnackbar(data.message, { variant: "sucess" });
          setLevelLoading(false);
        } else {
          enqueueSnackbar(data.message, { variant: "error" });
          setLevelLoading(false);
        }
      });
  };

  const fetchProduct = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/product/products`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    const dataFormate = dataPrepare(result);

    console.log(result, "result");

    setProducts(dataFormate);
    setFormInputs({
      number1: result.paymentNumber1,
      number2: result.paymentNumber2,
      productname: result.name,
      productprice: result.price.toString(),
    });

    console.log(formInputs, "formInputs");
  };
  const fetchCoinPrice = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/coin`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    setCoinPrice({ coinprice: result?.data?.coin });
  };
  const fetchAdPrice = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/ad`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    console.log(result?.data);
    setAdPrice({ adprice: result?.data?.ad });
  };
  const fetchAdminFee = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/fee`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    console.log(result?.data);
    setAdminFee({ adminFee: result?.data?.fee });
  };

  const fetchLevelProduct = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/product/level`,
      {
        method: "GET",
      }
    );
    const result = await response.json();

    const dataFormate = dataLevelPrepare(result?.result);

    setLevels(dataFormate);
  };

  return (
    <Page title="Product">
      <Container maxWidth="xl">
        {/* Product Price Update */}
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* Commission Percentage Create and Update */}
          <Grid item xs={6}>
            {/* <Item> */}
            <Typography variant="h4">Update Product</Typography>
            <Container maxWidth="xl">
              <ContentStyle>
                <form autoComplete="off" onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      value={formInputs.productname}
                      onChange={handleChange}
                      name="productname"
                      required
                      fullWidth
                      type="text"
                      label="Product Name"
                    />
                    <TextField
                      value={formInputs.number1}
                      onChange={handleChange}
                      name="number1"
                      required
                      fullWidth
                      type="text"
                      label="Payment Method 1"
                    />
                    <TextField
                      value={formInputs.number2}
                      onChange={handleChange}
                      name="number2"
                      required
                      fullWidth
                      type="text"
                      label="Payment Method 2"
                    />

                    <TextField
                      value={formInputs.productprice}
                      onChange={handleChange}
                      name="productprice"
                      required
                      fullWidth
                      type="text"
                      label="Product Price"
                    />
                  </Stack>

                  <LoadingButton
                    sx={{ my: 3 }}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isLoading}
                  >
                    Update
                  </LoadingButton>
                </form>
              </ContentStyle>
            </Container>
            {/* </Item> */}
            <Typography variant="h4">Update Zee Coin Price</Typography>
            <Container maxWidth="xl">
              <ContentStyle>
                <form autoComplete="off" onSubmit={handleSubmitPrice}>
                  <Stack spacing={3}>
                    <TextField
                      value={coinPrice.coinprice}
                      onChange={(e) =>
                        setCoinPrice({ coinprice: e.target.value })
                      }
                      name="coinprice"
                      required
                      fullWidth
                      type="text"
                      label="Coin Price"
                    />
                  </Stack>

                  <LoadingButton
                    sx={{ my: 3 }}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isCoinLoading}
                  >
                    Update
                  </LoadingButton>
                </form>
              </ContentStyle>
            </Container>
            <Typography variant="h4">Update Ad Price</Typography>
            <Container maxWidth="xl">
              <ContentStyle>
                <form autoComplete="off" onSubmit={handleSubmitAd}>
                  <Stack spacing={3}>
                    <TextField
                      value={adPrice.adprice}
                      onChange={(e) => setAdPrice({ adprice: e.target.value })}
                      name="adprice"
                      required
                      fullWidth
                      type="text"
                      label="Ad Price"
                    />
                  </Stack>

                  <LoadingButton
                    sx={{ my: 3 }}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isAdLoading}
                  >
                    Update
                  </LoadingButton>
                </form>
              </ContentStyle>
            </Container>
            <Typography variant="h4">Update Admin Fee %</Typography>
            <Container maxWidth="xl">
              <ContentStyle>
                <form autoComplete="off" onSubmit={handleSubmitFee}>
                  <Stack spacing={3}>
                    <TextField
                      value={adminFee.adminFee}
                      onChange={(e) =>
                        setAdminFee({ adminFee: e.target.value })
                      }
                      name="adminFee"
                      required
                      fullWidth
                      type="text"
                      label="Admin Fee"
                    />
                  </Stack>

                  <LoadingButton
                    sx={{ my: 3 }}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isFeeLoading}
                  >
                    Update
                  </LoadingButton>
                </form>
              </ContentStyle>
            </Container>
          </Grid>
          <Grid item xs={6}>
            {/* <Item>2</Item> */}
            <ContentStyle>
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={products}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                />
              </div>
            </ContentStyle>
          </Grid>
        </Grid>

        {/* Commission Percentage Create and Update */}
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            {/* <Item> */}
            <Typography variant="h4">Commission Update</Typography>
            <Container maxWidth="xl">
              <ContentStyle>
                <form autoComplete="off" onSubmit={handleLevelSubmit}>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={2.4}>
                      <Stack spacing={3}>
                        <TextField
                          value={levelInputs[0]?.level1}
                          onChange={(e) => handleLevelChange(e, 0)}
                          name="level1"
                          required
                          fullWidth
                          type="text"
                          label="Level-1"
                        />

                        <TextField
                          value={levelInputs[0]?.price1}
                          onChange={(e) => handleLevelChange(e, 0)}
                          name="price1"
                          required
                          fullWidth
                          type="text"
                          label="Percentage"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={2.4}>
                      <Stack spacing={3}>
                        <TextField
                          value={levelInputs[1]?.level2}
                          onChange={(e) => handleLevelChange(e, 1)}
                          name="level2"
                          required
                          fullWidth
                          type="text"
                          label="Level-2"
                        />

                        <TextField
                          value={levelInputs[1]?.price2}
                          onChange={(e) => handleLevelChange(e, 1)}
                          name="price2"
                          required
                          fullWidth
                          type="text"
                          label="Percentage"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={2.4}>
                      <Stack spacing={3}>
                        <TextField
                          value={levelInputs[2]?.level3}
                          onChange={(e) => handleLevelChange(e, 2)}
                          name="level3"
                          required
                          fullWidth
                          type="text"
                          label="Level-3"
                        />

                        <TextField
                          value={levelInputs[2]?.price3}
                          onChange={(e) => handleLevelChange(e, 2)}
                          name="price3"
                          required
                          fullWidth
                          type="text"
                          label="Percentage"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={2.4}>
                      <Stack spacing={3}>
                        <TextField
                          value={levelInputs[3]?.level4}
                          onChange={(e) => handleLevelChange(e, 3)}
                          name="level4"
                          required
                          fullWidth
                          type="text"
                          label="Level-4"
                        />

                        <TextField
                          value={levelInputs[3]?.price4}
                          onChange={(e) => handleLevelChange(e, 3)}
                          name="price4"
                          required
                          fullWidth
                          type="text"
                          label="Percentage"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={2.4}>
                      <Stack spacing={3}>
                        <TextField
                          value={levelInputs[4]?.level5}
                          onChange={(e) => handleLevelChange(e, 4)}
                          name="level5"
                          required
                          fullWidth
                          type="text"
                          label="Level-5"
                        />

                        <TextField
                          value={levelInputs[4]?.price5}
                          onChange={(e) => handleLevelChange(e, 4)}
                          name="price5"
                          required
                          fullWidth
                          type="text"
                          label="Percentage"
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                  <LoadingButton
                    sx={{ my: 3 }}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isLevelLoading}
                  >
                    Update
                  </LoadingButton>
                </form>
              </ContentStyle>
            </Container>
            {/* </Item> */}
          </Grid>
          <Grid item xs={5}>
            {/* <Item>2</Item> */}
            <ContentStyle>
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={Levels}
                  columns={columns1}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                />
              </div>
            </ContentStyle>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default product;
