import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import HomePage from "../pages/Home";

export const router = createBrowserRouter([
  {
    path: "signup",
    element: (
      <AuthLayout>
        <Signup />
      </AuthLayout>
    ),
  },
  {
    path: "signin",
    element: (
      <AuthLayout>
        <Signin />{" "}
      </AuthLayout>
    ),
  },

  {
    path: "/",
    element: <HomePage />,
  },
]);
