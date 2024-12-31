import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography } from "@mui/material";
import SummaryCard from "./components/SummaryCard";
import { Page } from "src/components";
import { useAppContext } from "src/hooks";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const theme = useTheme();
  const { _get_user_profile } = useAppContext();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/admin/`)
      .then((response) => response.json())
      .then((dashboard) => {
        setDashboardData(dashboard.data);
      });
  }, []);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          {dashboardData &&
            Object.entries(dashboardData).map(([key, value], i) => (
              <Grid key={i} item xs={6} sm={4} md={3}>
                <SummaryCard
                  color={getColorByKey(key)}
                  title={getTitleByKey(key)}
                  count={value}
                  icon={getIconByKey(key)}
                />
              </Grid>
            ))}
        </Grid>
      </Container>
    </Page>
  );
}

// Utility functions to get color, title, and icon based on the key
function getColorByKey(key) {
  switch (key) {
    case "user":
      return "success";
    case "brand":
      return "warning";
    case "brand":
      return "warning";
    case "luckydraw":
      return "error";
    case "discount":
      return "secondary";
    case "categories":
      return "info";
    case "traffic":
      return "secondary";
    default:
      return "primary";
  }
}

function getTitleByKey(key) {
  switch (key) {
    case "user":
      return "Users";
    case "brand":
      return "Brand";
    case "categories":
      return "Categories";
    case "luckydraw":
      return "Lucky Draw";
    case "discount":
      return "Discount";
    case "traffic":
      return "Traffic";
    default:
      return "Unknown";
  }
}

function getIconByKey(key) {
  switch (key) {
    case "user":
      return "ant-design:android-filled";
    case "brand":
      return "ant-design:android-filled";
    case "categories":
      return "icon-park-outline:sales-report";
    case "traffic":
      return "clarity:cloud-traffic-line";
    case "luckydraw":
      return "tdesign:ferris-wheel";
    case "discount":
      return "nimbus:marketing";
    default:
      return "unknown-icon";
  }
}
