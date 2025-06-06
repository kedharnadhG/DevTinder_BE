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
 - POST /request/send/interested/:userId
 - POST /request/send/ignored/:userId
 - POST /request/review/accepted/:requestId
 - POST /request/review/rejected/:requestId

## userRouter
 - GET /user/connections
 - GET /user/requests
 - GET /user/feed       -> Gets you the profiles of other users on platform


Status: ignore, interested, accepted, rejected