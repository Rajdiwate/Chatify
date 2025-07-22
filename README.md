# TODO --->


## Redis -->
    setup Redis for cache
        store user details to get on "/me" route

## BUGS --> 
    accepting request from anywhere should sync in the search results and pending requests

## Frontend -->
    create a slice for storing current selected chat user , chats  , states to update the chat 

## API --> 
    create a getConversations api (to display friends and groups)
        frontend will send the type(DIRECT/GROUP)
        if DIRECT , get the conversations with length 2 , where chat member constains userId
        if Group , get all the conversations with type GROUP and chat member contains userId
        use this api insted of the getFriends API
        On accept req api , create a conversation , Add both the users in chat member table --> return the conversation with type DIRECT and update the frontend state

    POST /create-group
    POST /join-group
    POST /send-message
    POST /send-group-invite


## WS -->
    create socket io server and authenticate user based on jwt token in the header
    create join room , send-message , recieve-message listeners

