"use client"

import { useState, useEffect, useRef } from "react"
import { Paper, Box, Typography, Divider } from "@mui/material"
import { Search, Users, Clock } from "lucide-react"
import { SearchResultItem, type UserRelationshipStatus } from "./search-result-item"
import { LoadingSpinner } from "../loading/loading-spinner"

interface SearchUser {
  id: string
  name: string
  username?: string
  avatar?: string
  isOnline?: boolean
  mutualFriends?: number
  relationshipStatus: UserRelationshipStatus
}

interface SearchDropdownProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onChat?: (userId: string) => void
  onAddFriend?: (userId: string) => void
  onAcceptRequest?: (userId: string) => void
}

// Mock search data
const mockUsers: SearchUser[] = [
  {
    id: "current_user",
    name: "You",
    username: "currentuser",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    relationshipStatus: "self",
  },
  {
    id: "1",
    name: "Alice Johnson",
    username: "alice_j",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    mutualFriends: 3,
    relationshipStatus: "friend",
  },
  {
    id: "2",
    name: "Bob Smith",
    username: "bobsmith",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    mutualFriends: 1,
    relationshipStatus: "not_friend",
  },
  {
    id: "3",
    name: "Carol Davis",
    username: "carol_d",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    mutualFriends: 5,
    relationshipStatus: "request_sent",
  },
  {
    id: "4",
    name: "David Wilson",
    username: "davidw",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    mutualFriends: 2,
    relationshipStatus: "request_received",
  },
  {
    id: "5",
    name: "Emma Brown",
    username: "emma_b",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    mutualFriends: 0,
    relationshipStatus: "not_friend",
  },
  {
    id: "6",
    name: "Frank Miller",
    username: "frank_m",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    mutualFriends: 4,
    relationshipStatus: "friend",
  },
]

export function SearchDropdown({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onChat,
  onAddFriend,
  onAcceptRequest,
}: SearchDropdownProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    const timeoutId = setTimeout(() => {
      const filtered = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(filtered)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleChat = async (userId: string) => {
    setProcessingIds((prev) => new Set(prev).add(userId))
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      onChat?.(userId)
      onClose()
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleAddFriend = async (userId: string) => {
    setProcessingIds((prev) => new Set(prev).add(userId))
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Update the user's relationship status to "request_sent"
      setSearchResults((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, relationshipStatus: "request_sent" } : user)),
      )
      onAddFriend?.(userId)
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleAcceptRequest = async (userId: string) => {
    setProcessingIds((prev) => new Set(prev).add(userId))
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Update the user's relationship status to "friend"
      setSearchResults((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, relationshipStatus: "friend" } : user)),
      )
      onAcceptRequest?.(userId)
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  if (!isOpen) return null

  const groupedResults = {
    self: searchResults.filter((user) => user.relationshipStatus === "self"),
    friends: searchResults.filter((user) => user.relationshipStatus === "friend"),
    requests: searchResults.filter((user) => user.relationshipStatus === "request_received"),
    others: searchResults.filter((user) => ["not_friend", "request_sent"].includes(user.relationshipStatus)),
  }

  return (
    <Paper
      ref={dropdownRef}
      elevation={8}
      className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-hidden z-50 border border-gray-200"
      sx={{ borderRadius: "12px" }}
    >
      {isLoading ? (
        <Box className="flex justify-center py-6">
          <LoadingSpinner size={32} />
        </Box>
      ) : searchResults.length === 0 ? (
        <Box className="text-center py-6">
          <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <Typography variant="body2" className="text-gray-600">
            {searchQuery.trim() ? "No users found" : "Start typing to search"}
          </Typography>
        </Box>
      ) : (
        <Box className="max-h-96 overflow-y-auto">
          {/* Self */}
          {groupedResults.self.length > 0 && (
            <Box>
              {groupedResults.self.map((user) => (
                <SearchResultItem
                  key={user.id}
                  {...user}
                  isProcessing={processingIds.has(user.id)}
                  onChat={handleChat}
                  onAddFriend={handleAddFriend}
                  onAcceptRequest={handleAcceptRequest}
                />
              ))}
              <Divider />
            </Box>
          )}

          {/* Friends */}
          {groupedResults.friends.length > 0 && (
            <Box>
              <Box className="px-3 py-2 bg-gray-50">
                <Typography variant="caption" className="text-gray-600 font-medium flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Friends
                </Typography>
              </Box>
              {groupedResults.friends.map((user) => (
                <SearchResultItem
                  key={user.id}
                  {...user}
                  isProcessing={processingIds.has(user.id)}
                  onChat={handleChat}
                  onAddFriend={handleAddFriend}
                  onAcceptRequest={handleAcceptRequest}
                />
              ))}
              <Divider />
            </Box>
          )}

          {/* Pending Requests */}
          {groupedResults.requests.length > 0 && (
            <Box>
              <Box className="px-3 py-2 bg-gray-50">
                <Typography variant="caption" className="text-gray-600 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Friend Requests
                </Typography>
              </Box>
              {groupedResults.requests.map((user) => (
                <SearchResultItem
                  key={user.id}
                  {...user}
                  isProcessing={processingIds.has(user.id)}
                  onChat={handleChat}
                  onAddFriend={handleAddFriend}
                  onAcceptRequest={handleAcceptRequest}
                />
              ))}
              <Divider />
            </Box>
          )}

          {/* Others */}
          {groupedResults.others.length > 0 && (
            <Box>
              <Box className="px-3 py-2 bg-gray-50">
                <Typography variant="caption" className="text-gray-600 font-medium">
                  Other Users
                </Typography>
              </Box>
              {groupedResults.others.map((user) => (
                <SearchResultItem
                  key={user.id}
                  {...user}
                  isProcessing={processingIds.has(user.id)}
                  onChat={handleChat}
                  onAddFriend={handleAddFriend}
                  onAcceptRequest={handleAcceptRequest}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  )
}
