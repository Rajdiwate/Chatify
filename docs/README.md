## NOTE --->
    if there is improper input in the ws data input , emit an error event to client. the frontend will listen and  display toast for the error message

# TODO --->

    on accept invite , 
        emit accept:invite to the server with the conversationId
        on emit accept:invite to all the users in the conversation except the current user
        listen accept:invite on frontend and call the getConversation function
        can show a toast to every user in the conversation to let them know that a new user has joined

    create ops files of k8s for deploying the project
    create a different docker file for kafka zookeeper. this will be used to create the docker compose file insted of pulling the image ofapache/kafka from hub

## Issues --->
    if redis and kafka are down , the server will crash. Insted they should run and throw erros to frontend that service is not available

