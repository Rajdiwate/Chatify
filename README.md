#TODO --->


## Redis -->
    setup Redis for cache
        store user details to get on "/me" route

## Frontend -->
    search users -> 
        hit  /getAllUsers?username=abc api basend on what user types and get all details
        create dropdown displaying the search results
        give option to chat with them if friends or send friend request if not friends

## API --> 
    GET  /getAllUsers?username=abc ----------> should also send the status of is the current user is friends with them or not
    POST /create-group
    POST /join-group
    POST /send-message
    POST /send-group-invite


## WS -->
    create socket io server and authenticate user based on jwt token in the header
    create join room , send-message , recieve-message listeners

