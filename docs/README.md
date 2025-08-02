## NOTE --->
    if there is improper input in the ws data input , emit an error event to client. the frontend will listen and  display toast for the error message

# TODO --->

    on sending invite , reciever should get a realtime update
    on accept invite , members should see an increased in group member count

    create ops files of k8s for deploying the project
    create a different docker file for kafka zookeeper. this will be used to create the docker compose file insted of pulling the image ofapache/kafka from hub

## Issues --->
    if redis and kafka are down , the server will crash. Insted they should run and throw erros to frontend that service is not available

