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

--- -------

## advanced routing techniques
```js
app.get(/ab?c/, (req, res) => {
    res.send('Hello from the server /ab?c');
});
 
app.get(/ab+c/, (req, res) => {
    res.send('Hello from the server /ab+c');
});

app.get(/ab.*cd$/, (req, res) => {
    res.send('Hello from the server /ab*cd');
});

app.get(/a(bc)?d/, (req, res) => {
    res.send('Hello from the server /a(bc)?d');
});

app.get(/a/, (req, res) => {
    res.send('Hello from the server /a');
});

```

---- 

## params in routes

/*

// app.use("/user", (req, res) => {
//     res.send("HAHAHAHHAHHAH")
// })


//this will only handle GET call to /user
app.get("/user", (req, res) => {
    //to see the query params in the request, use req.query
    console.log(req.query);
    res.send({
        firstname: "Kedharnadh",
        lastname: "G"
    })
})

app.get("/user/:userId", (req, res) => {
    //to see the params in the request, use req.params
    console.log(req.params);
    res.send({
        id: req.params.userId
    })
})

app.get("/user/:userId/:username/:password", (req, res) => {
    //to see the params in the request, use req.params
    console.log(req.params);
    res.send({
        id: req.params.userId,
        username: req.params.username,
        password: req.params.password
    })
})

app.post("/user", (req, res) => {
    //Saving data to the database
    res.send("Data saved successfully");
})

app.delete("/user", (req, res) => {
    res.send("Data deleted successfully");
})


//this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
    res.send('Hello from the server /test');
});

*/

----
---


# Middlewares

 - next function and errors along with the res.send()    (you can interchange the next() & res.send())
```js//a route can have multiple route-handlers
app.use("/user", (req, res, next) => {
    //Route Hander1
    console.log("Handling the route user")
    next();  //which call the next route-handler
    res.send("Response!!")  //it throws error  (see notes for ref, it's js call-stack thing)
}, (req, res) => {
    //Route Hander2
    console.log("Handling the route user2!!")
    res.send("2nd Response!!")  //this is the output
});
```

#### Handling multiple route-handlers
```js
// refer notes once

app.use("/user", 
  (req, res, next) => {
    //Route Hander1
    console.log("Handling the route user")
    next();
}, (req, res, next) => {
    //Route Hander2
    console.log("Handling the route user2!!")
    // res.send("2nd Response!!")
    next();
}, 
[(req, res, next) => {
    //Route Hander3
    console.log("Handling the route user3!!")
    // res.send("3rd Response!!")
    next();
}, (req, res, next) => {
    //Route Hander4
    console.log("Handling the route user4!!")
    // res.send("4th Response!!")
    next();
}], 
(req, res, next) => {
    //Route Hander5
    console.log("Handling the route user5!!")
    res.send("5th Response!!")

});
```

##### 2nd way to handle multiple route-handlers

```js

    //make sure of sequence/order of the route-handlers, and res.send() and next()

    app.get("/user", (req, res, next) => {
        console.log("Handling the route get user2");
        // res.send("2nd Response!!");
        next();
    })


    app.get("/user", 
    (req, res, next) => {
        //Route Hander1
        console.log("Handling the route user")
        // next();
    });
```


---
---
# Middlewares in Express.js


```js
app.use("/", (req, res, next) => {
    // res.send("Handling / route")
    next();
})

//separate route-handler for "/user"
app.get("/user", 
    (req, res, next) => {
        console.log("Handling /user route");        
        next();
    },
    (req, res, next) => {
        next()
    },
    (req, res, next) => {
        // &( the fn's | route-handlers it gone through till it reaches the request-handler those fn's are called Middlewares)
        res.send("3rd Response!!");  // This is the actual request-handler(who is sending the response)
    }
)

    //When next('route') is called, Express will skip the remaining handlers for the current route and move on to the next matching route handler.

    //How to use next('route') in Express.js for to redirect to another route/ skip the route-handlers
    app.get('/skip', (req, res, next) => {
        console.log('This handler will be skipped');
        next('route'); // Skips to the next matching route handler
    }, (req, res) => {
        res.send('You will not see this response because the handler is skipped');
    });

    // Next matching route handler
    app.get('/skip', (req, res) => {
     res.send('Skipped to this route handler');  //this is the output
    });


```


---

## Basic dummy Auth Middleware (process)

```js
(understand it) (generally we do all this via Middlewares folder)

// Handle Auth middleware for all GET, POST, .... requests (which are starting with the route "/admin" "/admin/..") (always use app.use)

app.use("/admin", (req, res, next) => {
    console.log("Admin auth is getting checked!")
    const token = "xyz";   // which is getting from the client

    const isAdminAuthorized = token === "xyz";  // "xyz" is db-stored one

    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Access");
    } else {
        next();
    }
});

//the above middleware won't be called for "/user" route because it doesn't start with "/admin"
app.get("/user", (req, res) => {
    res.send("User Data Sent");
})


// by using the above middleware, i can ensure that only admin (with the token & authorized) can access this route (whatever the path i.e starts with /admin)
app.get("/admin/getAllData", (req,res) => {
    res.send("All Data Sent");
})

app.get("/admin/deleteUser", (req,res) => {
    res.send("User Deleted");
})


```

--- 
 #### optimized approach 

```js

const userAuth = (req, res, next) => {
    console.log("User auth is getting checked!")
    const token = "sdfesxyz";   // which is getting from the client

    const isUserAuthorized = token === "xyz";  // "xyz" is db-stored one

    if(!isUserAuthorized){
        res.status(401).send("Unauthorized Access");
    } else {
        next();
    }
};



module.exports = {
    adminAuth,
    userAuth

};
------


const {adminAuth, userAuth} = require('./middlewares/auth');


const app = express();

// Handle Auth middleware for all GET, POST, .... requests (which are starting with the route "/admin" "/admin/..") (always use app.use)

app.use("/admin", adminAuth);


//the above middleware won't be called for "/user" route because it doesn't start with "/admin"
// since we have only one-route for "/user" we can use "userAuth-middleware" as a route-handler (i.e in between (as we know i.e route-handler chaning only))
app.get("/user", userAuth, (req, res) => {
    res.send("User Data Sent");
})
```

----
-----

### Basic Error Handling

```js
//using try-catch
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

```

----

----
#### MODELS (Schema)


```js

//creating a new-Instance of the User-Model(i.e like a class)
const user = new User({
    firstName: "MS",
    lastName: "DHONI",
    emailId: "Dhoni@gmail.com",
    password: "Dhonibhai",
    age: 45,
    gender: "male",
    phoneNumber: "6755324342",
});
```