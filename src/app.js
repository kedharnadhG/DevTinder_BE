const express = require('express');


const app = express();

/**
 
    //whatever request comes in, we want to send back a response
    app.use((req,res)=> {
        res.send('Hello World from express server');
    })

*/

//it will only handle the request if the path is /test
app.use("/test", (req, res) => {
    res.send('Hello World from express server');
});

app.use("/hello", (req, res) => {
    res.send('Hello World from express server');
});

app.use("/", (req, res) => {
    res.send('Hello World from express server, it is the Namaste Node JS dashboard');
});



app.listen(7777, () => {
    console.log('Server is successfully listening on http://localhost:7777');
});