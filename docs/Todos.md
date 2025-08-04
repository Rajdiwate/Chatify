## NOTE --->

    if there is improper input in the ws data input , emit an error event to client. the frontend will listen and  display toast for the error message

# TODO --->

    create a kubernetes cluster using kind, add extraPortMapping for port 3001 and 3000
    apply the manifests fies for db , redis , kafka
    migrate the db
    add argoCD and configure it to watch the ops repo api , ws ,data patch service
    update the   chatify cd to change the image tag to the new image tag by checking out the ops repo in pipeline
    test by doing a commit
 

## Issues --->

    if redis and kafka are down , the server will crash. Insted they should run and throw erros to frontend that service is not available
