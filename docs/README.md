# TODO --->

    on send:message listner on server , wss should store the messages in redis --> DONE
    produce it to message broker 
    emit the recieve:message on the room(convo ID) --> DONE

    frontend should get messages from http server , --> DONE
    listen to recieve:message event  --> DONE
    and update the chat state by mergeing the chats of ws and http.

    the http server should lookup in the redis for the recent chats
    based on cases: 
    1. db wont have all the chats stored all the time due to batch updates.
        - get the recent chats from redis , get the older chats from db , merge them and send


    ==> Dont fetch chat from server on each tab change.
    ==> Store the Chats in such a way that they should get mapped to each conversation Id. whenEver the curentConvo changes , get the chats from chats slice. Dont override the chats of each conversation. Insted push them in an array

## NOTE
    if there is improper input in the ws data input , emit an error event to client. the frontend will listen and  display the error message

## Frontend -->

## WS -->

    create socket io server and authenticate user based on jwt token in the header
    store the userId and the socketId in the redis
    create join room , send-message , recieve-message listeners
