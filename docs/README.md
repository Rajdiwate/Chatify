## NOTE

    if there is improper input in the ws data input , emit an error event to client. the frontend will listen and  display toast for the error message

    create a different docker file for kafka zookeeper. this will be used to create the docker compose file insted of pulling the image of apache/kafka from hub

# TODO --->

        on accepting the invite , update the group convos
        
        on the tabs(friends/groups) , give option to create group
        on clicking on "create group" , show him a form to fill and call the create groups api
        - update the group convos accordingly

        when user opens the group chat box , on the header give option to invite friends
        on clicking on that , the user should see a popup which will have a list of names(friends) to whome he can send invite ==> call the send Invite api.



    if user wants to add someone to the group , show him the list of DIRECT convo he has to select the friends he wants to add

    if user wants to send group invites to another user --> create a group invite with sender and receiver id

    with the help of this , multiple user in the group can invite different persons(friends). but the outside cannot search and join the group
    

    structue well using env files n all

    Add group chat feature



## Issues
    if redis and kafka are down , the server will crash. Insted they should run and throw erros to frontend that service is not available


We can have 2 different frontends for chatting and for video calling