TODO --->


# Frontend -->
    setup -> 
        add axios ,react router dom , typscrit , tailwindcss , redux tooklit and configure them
        ceate login , signup pages and implement auth
        create home page  
            which will have header containing logo , searchBar with placeholder "search for people" and "profile" 
            below the header divider it in 2 sections. right one chatbox ,left one  friend selection section
            in friend selection section , give a header which will have a selctor slidebar for choosing between friends and groups. 
            in friend selection section  , below the header it should display the cards of user and gropus based on the selctor slidebar
            in chat box section , give a header which will have the username and lastseen  aligned on left
            in chat box section , below the header  , it should take the rest of the height and display the chats. 
            at bottom of chat box section , it should have a input feild and button to send message.


# API --> 
    POST /send-request
    POST /accept-request
    POST /create-group
    POST /join-group
    POST /send-message
    POST /send-group-invite


# WS -->
    create socket io server and authenticate user based on jwt token in the header
    create join room , send-message , recieve-message listeners

