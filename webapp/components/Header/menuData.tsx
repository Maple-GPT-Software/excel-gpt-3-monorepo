const menuData = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Pricing",
    path: "/pricing",
    newTab: false,
  },
  {
    id: 4,
    title: "Account",
    newTab: false,
    submenu: [
      {
        id: 46,
        title: "Sign In",
        path: "/signin",
        newTab: false,
      },
      {
        id: 47,
        title: "Sign Up",
        path: "/signup",
        newTab: false,
      },
    ],
  },
];
export default menuData;
