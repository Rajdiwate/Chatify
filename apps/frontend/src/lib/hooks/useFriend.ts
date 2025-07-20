import { useCallback, useEffect } from "react";
import { getFriendsThunk } from "../redux/slices/friend/thunks";
import { useAppSelector } from "./redux";
import { useAppHelpers } from "./useAppHelpers";

export const useFriend = () => {
  const { loading, error, friends, fetched } = useAppSelector(
    (state) => state.friends
  );
  const { dispatch } = useAppHelpers();
  const { user } = useAppSelector((state) => state.auth);

  const getFriends = useCallback(async () => {
    dispatch(getFriendsThunk());
  }, [dispatch ]);

  useEffect(() => {
    if (!fetched) {
      getFriends();
    }
  }, [getFriends, fetched , user]);

  return { loading, error, friends, getFriends };
};
