# TODO --->

## Redis -->

    setup Redis for cache
        store user details to get on "/me" route

## BUGS -->

## Frontend -->

    create a slice for storing current selected chat user , chats  , states to update the chat
    on clicking on a chat , the currentConvId should be updated , and the chat should be displayed on the chatBox

## API -->

    POST /create-group
    POST /join-group
    POST /send-message
    POST /send-group-invite

## WS -->

    create socket io server and authenticate user based on jwt token in the header
    create join room , send-message , recieve-message listeners
