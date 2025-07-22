# TODO --->


## Redis -->
    setup Redis for cache
        store user details to get on "/me" route

## BUGS --> 
    accepting request from anywhere should sync in the search results and pending requests

## Frontend -->
    create a slice for storing current selected chat user , chats  , states to update the chat 

## API --> 
    logout api
    POST /create-group
    POST /join-group
    POST /send-message
    POST /send-group-invite


## WS -->
    create socket io server and authenticate user based on jwt token in the header
    create join room , send-message , recieve-message listeners

