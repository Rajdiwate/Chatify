## storing recent messages based on conversationId (2 days expiry)

    lPush(`conversation:${conversationId}`, JSON.stringify({ content, senderId, senderName, createdAt: Date.now(), conversationId, }))