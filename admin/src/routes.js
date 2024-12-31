import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
//pages
import {
  Dashboard,
  Login,
  Page404,
  Profile,
  Settings,
  Users,
  AddUser,
  Categories,
  Discounts,
  LuckyDraws,
  AddLuckyDraw,
  LuckyDrawHistory,
  AddCategory,
  AddDiscount,
  NonWorking,
  BuyRequests,
  Product,
  TopUp,
  Banner,
  DiscountsHistory,
  WithdrawalRequests,
  MLM,
} from "./pages";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "users", element: <Users /> },
        { path: "users/add-user", element: <AddUser /> },
        { path: "product/product", element: <Product /> },
        { path: "categories", element: <Categories /> },
        { path: "banner", element: <Banner /> },
        { path: "discounts", element: <Discounts /> },
        { path: "categories/add-category", element: <AddCategory /> },
        { path: "discounts", element: <Categories /> },
        { path: "discounts/history", element: <DiscountsHistory /> },
        { path: "discounts/add-discount", element: <AddDiscount /> },
        { path: "luckydraws", element: <LuckyDraws /> },
        { path: "luckydraws/history", element: <LuckyDrawHistory /> },
        { path: "luckydraws/add-luckydraw", element: <AddLuckyDraw /> },
        { path: "non-working", element: <NonWorking /> },
        { path: "top-up", element: <TopUp /> },
        { path: "buy-requests", element: <BuyRequests /> },
        { path: "withdrawal-requests", element: <WithdrawalRequests /> },
        { path: "mlm", element: <MLM /> },
        { path: "profile", element: <Profile /> },
        { path: "settings", element: <Settings /> },
      ],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "/", element: <Navigate to="/dashboard" /> },
        { path: "login", element: <Login /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
