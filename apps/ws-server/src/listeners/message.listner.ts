import { Server, Socket } from "socket.io"
import { createClient } from "redis"

const messageListeners = (io : Server , socket : Socket , client:ReturnType<typeof createClient> ) => {
    socket.on("send:message" , async ({conversationId , content , senderId} : {conversationId : string , content : string , senderId : string}) => {
        // produce this message to kafka producer
        // the consumer should create a message with conversationId , content , senderId , createdAt
        //insert the message into the redis as recent messages for the conversationId
        console.log("sending message" , {conversationId , content , senderId})
        if(!conversationId || !content || !senderId) {
            socket.emit("err" , "conversationId , content , senderId are required to send message")
        }else {

            //check if the user exists in the room
            if(!socket.rooms.has(conversationId)) {
                socket.emit("err" , "Not joined the group yet. Cannot send message")
            }

            await client.hSet( `conversation:${conversationId}` , {content , senderId , createdAt : Date.now() , conversationId} )
            await client.expire(`conversation:${conversationId}` , 3600* 24 * 2) // 2 days
            io.to(conversationId).emit("receive:message" , {content , senderId , createdAt : Date.now() , conversationId})
        }

    })
}

export default messageListeners