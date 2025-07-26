## NOTE

    if there is improper input in the ws data input , emit an error event to client. the frontend will listen and  display toast for the error message

# TODO --->

    listen to 'err' on frontend and display the toast
    make displaying friendrequest realtime
    on friend request accept , the one who sent the request has to refresh

    structue well using env files n all

    Add group chat feature



## Issues
    if redis and kafka are down , the server will crash. Insted they should run and throw erros to frontend that service is not available


We can have 2 different frontends for chatting and for video calling