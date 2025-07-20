import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Avatar,
  Box,
} from "@mui/material";
import { Search } from "lucide-react";
import {
  FriendRequestButton,
  FriendRequestPopover,
} from "../ui/friend-request-popover";
import { useState } from "react";
import { useAuth } from "../../lib/hooks/useAuth";
import { useAppHelpers } from "../../lib/hooks/useAppHelpers";
import { getPendingRequestsThunk } from "../../lib/redux/slices/auth/thunks";


export function Header() {
  const [friendRequestAnchor, setFriendRequestAnchor] =
    useState<HTMLElement | null>(null);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const {dispatch} = useAppHelpers()
  const {pendingRequests} = useAuth();
  const handleFriendRequestClick = async (event: React.MouseEvent<HTMLElement>) => {
    setFriendRequestAnchor(event.currentTarget);
    setIsLoadingRequests(true);
    await dispatch(getPendingRequestsThunk()).unwrap();
    setIsLoadingRequests(false);
   
  };

  const handleFriendRequestClose = () => {
    setFriendRequestAnchor(null);
  };
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
                  placeholder="Search for people"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-gray-900  "
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: "4px 0",
                    },
                  }}
                />
              </Box>
              <FriendRequestButton
                requestCount={pendingRequests.length}
                onClick={handleFriendRequestClick}
              />
            </Box>
          </div>

          {/* Profile */}
          <Box className="flex items-center gap-2">
            <Avatar className="w-8 h-8 bg-blue-500 cursor-pointer">
              <Typography variant="body2" className="text-white font-semibold">
                U
              </Typography>
            </Avatar>
            <Typography
              variant="body2"
              className="text-gray-700 font-medium hidden md:block"
            >
              Profile
            </Typography>
          </Box>
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
