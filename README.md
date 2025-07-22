# TODO --->


## Redis -->
    setup Redis for cache
        store user details to get on "/me" route

## BUGS --> 
    accepting request from anywhere should sync in the search results and pending requests

## Frontend -->

    on home page , getConversation req wil be called
    on req accept , you will get the created conversation.
    push this conversation in the state.

    create a slice for storing current selected chat user , chats  , states to update the chat 

## API --> 

    POST /create-group
    POST /join-group
    POST /send-message
    POST /send-group-invite


## WS -->
    create socket io server and authenticate user based on jwt token in the header
    create join room , send-message , recieve-message listeners

