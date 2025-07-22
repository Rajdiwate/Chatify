# TODO --->

## Redis -->

    setup Redis for cache
        store user details to get on "/me" route

## BUGS -->

## Frontend -->

    create socket io connection on the home page if user is logged in.
    when user clicks on any conversation , start listening to the incomming:message event and fetch the chats by dispatching getChatThunk
    merge the response of api with the messages present in the store
    e.g ==>
        when listening to incomming:message event , lets say chat with id 5,6,7 came in, and the api response gate the chats with id 1,2,3,4,5
        then merge them to 1,2,3,4,5,6,7 and display them. after that just listen to the incomming:message event and update the state

## API -->

    create

    POST /create-group
    POST /join-group
    POST /send-message
    POST /send-group-invite

## WS -->

    create socket io server and authenticate user based on jwt token in the header
    create join room , send-message , recieve-message listeners
