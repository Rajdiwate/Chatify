## NOTE --->

    if there is improper input in the ws data input , emit an error event to client. the frontend will listen and  display toast for the error message

# TODO --->


    create a CI/CD to -> checkout repo , login to docker hub , build docker images and push to docker hub 
                      -> checkout the staging ops repo , update the deployment files for the images of services
    
    create a new folder on staging ops (chatify) , create three more folders specific to the services , in each create a deployments , services , secrets yml files

    create ops files of k8s for deploying the project

## Issues --->

    if redis and kafka are down , the server will crash. Insted they should run and throw erros to frontend that service is not available
