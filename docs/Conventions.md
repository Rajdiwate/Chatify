## storing recent messages based on conversationId (2 days expiry)

    lPush(`conversation:${conversationId}`, JSON.stringify({ content, senderId, senderName, createdAt: Date.now(), conversationId, }))

## Kafka Topic ==> persist

## Kafka Client Name ==> chatify

## Kafka Consumer group ==> data-patch-service

## Kafka Main consumer demo data ==>

    '{"content":"Consumer test","senderId":"cmdepxjee000190z8uwfqy6p6","senderName":"zoro","createdAt":"2025-07-25T12:33:27.160Z","conversationId":"cmdepy7iz000590z85vtnvnpn"}'

## Kafka Retry consumer demo data ==>

    Array of ==> '{"content":"Consumer test","senderId":"cmdepxjee000190z8uwfqy6p6","senderName":"zoro","createdAt":"2025-07-25T12:33:27.160Z","conversationId":"cmdepy7iz000590z85vtnvnpn"}'
