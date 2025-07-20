import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/hooks/useAuth";
import type { ReactNode } from "react";
import { LoadingSpinner } from "../components/loading/loading-spinner";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { loading, user } = useAuth();

  if (loading) return <div className="h-[100dvh] w-[100dvw] flex items-center justify-center"><LoadingSpinner/></div>;

  if (user) return <Navigate to={"/"} replace={true} />;

  return <>{children}</>;
};

export default AuthLayout;
