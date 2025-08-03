## NOTE --->

    if there is improper input in the ws data input , emit an error event to client. the frontend will listen and  display toast for the error message

# Find a way to create image of a service only when the things are changed.

# TODO --->

    Need to migrate the db. 
        create a ckuster , run the , apply the deployment files for kafka , db, redis. migrate the db.
        install argocd on the cluster and specify the repo for argocd to watch

        update the cd for chatify to modify the image tag each time the the new image is created
## Issues --->

    if redis and kafka are down , the server will crash. Insted they should run and throw erros to frontend that service is not available
