import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../lib/hooks/useAuth"

const AuthLayout = () => {
  const { loading , user} = useAuth()

  if(loading) return <> Loading ....</>

  if(user) return <Navigate to={'/'} replace={true}/>

  return (
    <>
      <Outlet/>
    </>
  )
}

export default AuthLayout
