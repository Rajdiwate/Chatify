## NOTE

    if there is improper input in the ws data input , emit an error event to client. the frontend will listen and  display toast for the error message

    create a different docker file for kafka zookeeper. this will be used to create the docker compose file insted of pulling the image of apache/kafka from hub

# TODO --->

        Integrate the accept invite api,  on accepting the invite , update the group convos



    create ops files of k8s for deploying the project

## Issues

    if redis and kafka are down , the server will crash. Insted they should run and throw erros to frontend that service is not available

We can have 2 different frontends for chatting and for video calling
