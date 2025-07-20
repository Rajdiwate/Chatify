// hooks/useAppHelpers.js
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./redux";

export const useAppHelpers = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return { dispatch, navigate };
};
