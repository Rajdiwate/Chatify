import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Avatar,
  Box,
} from "@mui/material";
import { LogOut, Search } from "lucide-react";
import {
  FriendRequestButton,
  FriendRequestPopover,
} from "../ui/friend-request-popover";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../lib/hooks/useAuth";
import { useAppHelpers } from "../../lib/hooks/useAppHelpers";
import { getPendingRequestsThunk } from "../../lib/redux/slices/auth/thunks";
import { SearchDropdown } from "../ui/search-dropdowm";
import { getSearchUserRequest } from "../../api/user.api";
import type { searchResultUser } from "../../lib/redux/slices/auth/types";
import { useDebounce } from "../../lib/hooks/useDebounce";
import { sendRequest } from "../../lib/redux/slices/conversation/ConversationSlice";
import { acceptFriendRequestThunk } from "../../lib/redux/slices/conversation/thunks";
import { reducePendingReq } from "../../lib/redux/slices/auth/AuthSlice";
import { useSocket } from "../../lib/socket/useSocket";

export function Header() {
  const [friendRequestAnchor, setFriendRequestAnchor] =
    useState<HTMLElement | null>(null);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchResult, setSearchResult] = useState<searchResultUser[]>([]);
  const { dispatch } = useAppHelpers();
  const { pendingRequests, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();

  const getSearchResults = async (query: string) => {
    setIsLoadingSearch(true);
    const data = await getSearchUserRequest(query);
    if (data.success) {
      setIsLoadingSearch(false);
      return data.users;
    } else {
      setIsLoadingSearch(false);
      return [];
    }
  };
  const handleFriendRequestClick = async (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setFriendRequestAnchor(event.currentTarget);
    setIsLoadingRequests(true);
    await dispatch(getPendingRequestsThunk()).unwrap();
    setIsLoadingRequests(false);
  };
  const handleFriendRequestClose = () => {
    setFriendRequestAnchor(null);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
  };

  const debouncedSearch = useDebounce(async (value: string) => {
    const searchedUsers = await getSearchResults(value);
    setSearchResult(searchedUsers);
  }, 500); // 500ms debounce delay

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchQuery(value);
      if (value !== "") {
        debouncedSearch(value);
      }
    },
    [debouncedSearch]
  );

  const handleChat = (userId: string) => {
    console.log("Starting chat with user:", userId);
    // Navigate to chat or open chat window
  };

  const handleAddFriend = (userId: string) => {
    console.log("Adding friend:", userId);
    dispatch(sendRequest({ receiverId: userId }));
    socket?.emit("send:request", {
      to: userId,
      from: user?.id,
      senderName: user?.username,
      type : "DIRECT"
    });
  };

  const handleAcceptRequest = async (userId: string) => {
    console.log("Accepting friend request from:", userId);
    await dispatch(acceptFriendRequestThunk({ senderId: userId })).unwrap();
    dispatch(reducePendingReq());
    console.log("emiting accept request" , user)
    socket?.emit("accept:request", {
      senderId: userId,
      type: "DIRECT",
    });
  };

  useEffect(() => {
    setSearchQuery("");
  }, [user?.pendingRequestsNumber]);

  return (
    <>
      <AppBar
        position="static"
        elevation={1}
        className="bg-white border-b border-gray-200"
      >
        <Toolbar className="px-4 flex justify-between   items-center">
          <div className="flex items-center flex-1 gap-10">
            {/* Logo */}
            <Typography
              variant="h6"
              fontSize={30}
              className="text-white font-bold mr-8 "
            >
              Chatify
            </Typography>

            {/* Search Bar */}
            <Box className="flex-1 mx-4 flex gap-4 ">
              <Box className="relative max-w-md flex-1">
                <Box className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none w-full">
                  <Search className="h-5 w-5 text-black" />
                </Box>
                <InputBase
                  ref={searchInputRef}
                  placeholder="Search for people"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-gray-900  "
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: "4px 0",
                    },
                  }}
                />
                {/* Search Dropdown */}
                <SearchDropdown
                  isOpen={isSearchFocused}
                  isLoading={isLoadingSearch}
                  setSearchResults={setSearchResult}
                  onClose={handleSearchClose}
                  searchQuery={searchQuery}
                  searchResult={searchResult}
                  onChat={handleChat}
                  onAddFriend={handleAddFriend}
                  onAcceptRequest={handleAcceptRequest}
                />
              </Box>
              <FriendRequestButton
                requestCount={user?.pendingRequestsNumber || 0}
                onClick={handleFriendRequestClick}
              />
            </Box>
          </div>

          {/* Profile */}
          <Box className="flex items-center gap-2">
            <Avatar className="w-8 h-8 bg-blue-500 cursor-pointer">
              <Typography variant="body2" className="text-white font-semibold">
                {user?.username.charAt(0).toUpperCase()}
              </Typography>
            </Avatar>
            <Typography
              variant="body2"
              fontSize={20}
              className="text-white font-medium hidden md:block text-3xl"
            >
              {user?.username}
            </Typography>
          </Box>

          {/* <Avatar className="w-8 h-8  cursor-pointer ml-10 bg-red-600" > */}
          <Typography
            variant="button"
            className="text-white font-semibold bg-red-600 flex items-center justify-center rounded-xl p-3 cursor-pointer"
            marginLeft={"50px"}
            height={"3rem"}
            width={"3rem"}
          >
            <LogOut onClick={logout} />
          </Typography>
          {/* </Avatar> */}
        </Toolbar>
      </AppBar>

      <FriendRequestPopover
        anchorEl={friendRequestAnchor}
        open={Boolean(friendRequestAnchor)}
        onClose={handleFriendRequestClose}
        pendingRequests={pendingRequests}
        isLoading={isLoadingRequests}
      />
    </>
  );
}
