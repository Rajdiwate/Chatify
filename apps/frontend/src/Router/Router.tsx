import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";


export const router = createBrowserRouter([
  {
    path: "/",
    element : <AuthLayout/>,
    children : [
      {
        path : "signup",
        element : <Signup/>
      },
      {
          path : "signin",
        element : <Signin/>
      }
    ]
  },
]);
