const express = require('express');


const app = express();

app.use("/user", (req, res) => {
    res.send("HAHAHAHHAHHAH")
})


//this will only handle GET call to /user
app.get("/user", (req, res) => {
    res.send({
        firstname: "Kedharnadh",
        lastname: "G"
    })
})

app.post("/user", (req, res) => {
    //Saving data to the database
    res.send("Data saved successfully");
})

app.delete("/user", (req, res) => {
    res.send("Data deleted successfully")
})

//this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
    res.send('Hello from the server /test');
});

app.listen(7777, () => {
    console.log('Server is successfully listening on http://localhost:7777');
});