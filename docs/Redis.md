## storing recent messages based on conversationId (2 days expiry)

    hSet('conversation:conversationId',{ senderId,  content, createdAt, conversationId}) 