# DevTinder APIs

(grouping of similar routes under one path/Router)

## authRouter
 - POST /signup
 - POST /login
 - POST /logout

## profileRouter
 - GET /profile/view
 - GET /profile/edit
 - PATCH /profile/password

## connectionRequestsRouter
 - POST /request/send/:status/:userId        -> using same dynamic-route for handling both the ignored & interested (status) requests
 
 - POST /request/review/:status/:requestId     -> using same dynamic-route for handling both the accepted & rejected (status) requests (we can accept or reject the request only if it is in interested status)

## userRouter
 - GET /user/requests/received
 - GET /user/connections
 - GET /user/feed       -> Gets you the profiles of other users on platform


Status: ignore, interested, accepted, rejected