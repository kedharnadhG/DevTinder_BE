const express = require('express');
// const {adminAuth, userAuth} = require('./middlewares/auth');


const app = express();


app.get('/skip', (req, res, next) => {
  console.log('This handler will be skipped');
  next('route'); // Skips to the next matching route handler
}, (req, res) => {
  res.send('You will not see this response because the handler is skipped');
}, (req, res, next) => {
    console.log('This handler will also be skipped');
});

// Next matching route handler
app.get('/skip', (req, res) => {
  res.send('Skipped to this route handler');
});


app.get("/getUserData", (req, res) => {

    try {
        throw new Error("Some error");
        res.send("User Data Sent");
    } catch (error) {
        res.status(500).send("Something went wrong contact support team");
    }
})


//if anything breaks, (error) it will caught here (wild card error handler)
app.use("/", (err, req, res, next) => {
    if(err){
        //you can also log the error here
        res.status(500).send(err.message || "Something went wrong");
    }
})

app.listen(7777, () => {
    console.log('Server is successfully listening on http://localhost:7777');
});