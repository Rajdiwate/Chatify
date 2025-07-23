# TODO --->

    frontend will initiate the socket connection on the home page if user is logged in.
    WS should figure out the user and map the userId->socketID

    once connection is made successfully , frontend will send the
    conversations Ids.
    Ws should join the user in those rooms(convo ids)

    on send:message listner on server , wss should store the messages
    in redis , produce it to message broker and at last emit the
    recieve:message on the room(convo ID)

    frontend should get messages from http server ,
    listen to recieve:message event and update the
    chat state by mergeing the chats of ws and http.

    the http server should lookup in the redis for the recent chats
    based on cases: 
    1. db wont have all the chats stored all the time due to batch updates.
        - get the recent chats from redis , get the older chats from db , merge them and send

## TypeScript -->

    disabled strict mode and enabled noImplicitAny for pipeline success --> need to fix

## Redis -->

    setup Redis for cache
        store user details to get on "/me" route

## BUGS -->

## Frontend -->

## API -->
    POST /create-group
    POST /join-group
    POST /send-message
    POST /send-group-invite

## WS -->

    create socket io server and authenticate user based on jwt token in the header
    store the userId and the socketId in the redis
    create join room , send-message , recieve-message listeners
