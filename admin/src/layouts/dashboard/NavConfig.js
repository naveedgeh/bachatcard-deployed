// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: "dashboard",
    path: "/dashboard",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
  {
    title: "User Section",
    icon: getIcon("fe:users"),
    children: [
      {
        title: "All Users",
        path: "/users",
      },
      {
        title: "Add User",
        path: "/users/add-user",
      },
      {
        title: "Banner",
        path: "/banner",
      },
    ],
  },
  {
    title: "Discount Section",
    icon: getIcon("nimbus:marketing"),
    children: [
      {
        title: "Add Category",
        path: "/categories/add-category",
      },
      {
        title: "Add Discount",
        path: "/discounts/add-discount",
      },
      {
        title: "Discount List",
        path: "/discounts",
      },
      {
        title: "Discounts History",
        path: "/discounts/history"
      }
    ]

  },
  {
    title: "lucky Draw",
    path: "/lucky-draw",
    icon: getIcon("tdesign:ferris-wheel"),
    children: [
      {
        title: "Create Lucky Draw",
        path: "/luckydraws/add-luckydraw",
      },
      {
        title: "Lucky Draw List",
        path: "/luckydraws",
      },
      {
        title: "History of Winners",

        path: "luckydraws/history"
      }
    ]

  },
  {
    title: "Non Working",
    path: "/non-working",
    icon: getIcon("carbon:hybrid-networking-alt"),
  },
  // {
  //   title: "MLM",
  //   path: "/mlm",
  //   icon: getIcon("dashicons:networking"),
  // },
  {
    title: "Product",
    path: "/product/product",
    icon: getIcon("fluent-mdl2:product")
  },
  {
    title: "Payout Section",
    icon: getIcon("ph:wallet-fill"),
    children: [
      {

        title: "Top Up",
        path: "/top-up"

      },
      {

        title: "Payment Requests",
        path: "/buy-requests"

      },
      {
        title: "Withdrawal Requests",
        path: "/withdrawal-requests",
      },
    ],
  },
  {
    title: "",
    path: "",
  },
];

export default navConfig;
