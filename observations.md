# Route Handling in Express.js
/**
 
    //whatever request comes in, we want to send back a response
    app.use((req,res)=> {
        res.send('Hello World from express server');
    })



    //(ir we hit "/hello/2")it won't execute since , since the route matches the above-one ("/hello") itself, so then "/hello" route handler will handle it
    app.use("/hello/2", (req,res) => {
        res.send("abraka dabra")
    })
 


    app.use("/hello", (req, res) => {
        res.send('Hello World from express server /hello');
    });


    //it will only handle the request if the path is /test
    app.use("/test", (req, res) => {
        res.send('Hello World from express server /test');
    });



    // this overwrites all the routes (w.r.t sequence/order of the routes), because this is the first middleware & 
    // anything that matches after the "/" this route-handler will handle it
    app.use("/", (req, res) => {
        res.send('Hello World from express server, it is the Namaste Node  dashboard (root /)');
    });


*/
