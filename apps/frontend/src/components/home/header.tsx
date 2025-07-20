import { AppBar, Toolbar, Typography, InputBase, Avatar, Box, IconButton } from "@mui/material"
import { Search, Menu } from "lucide-react"

export function Header() {
  return (
    <AppBar position="static" elevation={1} className="bg-white border-b border-gray-200">
      <Toolbar className="px-4">
        {/* Logo */}
        <Typography variant="h6" className="text-blue-600 font-bold mr-8">
          ChatApp
        </Typography>

        {/* Search Bar */}
        <Box className="flex-1 max-w-md mx-4">
          <Box className="relative">
            <Box className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </Box>
            <InputBase
              placeholder="Search for people"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-gray-900"
              sx={{
                "& .MuiInputBase-input": {
                  padding: "8px 0",
                },
              }}
            />
          </Box>
        </Box>

        {/* Profile */}
        <Box className="flex items-center gap-2">
          <IconButton className="md:hidden">
            <Menu className="h-6 w-6 text-gray-600" />
          </IconButton>
          <Avatar className="w-8 h-8 bg-blue-500 cursor-pointer">
            <Typography variant="body2" className="text-white font-semibold">
              U
            </Typography>
          </Avatar>
          <Typography variant="body2" className="text-gray-700 font-medium hidden md:block">
            Profile
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
