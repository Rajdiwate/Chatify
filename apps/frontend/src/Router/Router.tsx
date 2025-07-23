import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import HomePage from "../pages/Home";
import SocketProvider from "../lib/socket/SocketProvider";
import HomeLayout from "../layouts/HomeLayout";

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
    element: (
      <SocketProvider>
        <HomeLayout>
          <HomePage />
        </HomeLayout>
        
      </SocketProvider>
    ),
  },
]);
