// ** Node.js application using Express to create a server that handles user authentication using JWT **

/* JWT (JSON Web Token) is a compact and self-contained way to securely transmit information between parties as a JSON object.
It consists of three parts: a header, a payload, and a signature.
The header typically contains metadata about the token, such as the type of token and the hashing algorithm used.
The payload contains the claims, which are statements about an entity (user) and additional data.
The signature is used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way.
JWTs can be used for authentication, authorization, and information exchange.
They are commonly used in web applications for securely transmitting authentication credentials between the client and server. */

// Importing Express.js to create the server
const express = require('express');

// Middleware to parse request bodies
const bodyParser = require('body-parser');

// JSON Web Token library for creating and verifying tokens
const jwt = require('jsonwebtoken'); 

 // Module for handling file paths
const path = require('path');

// Middleware for JWT authentication
const { expressjwt: expressJwt } = require('express-jwt');

// Create an instance of Express application
const app = express();

// Port number on which the server will listen for incoming requests
const PORT = 3000; 

// Secret key used to sign JWT tokens
const secretKey = 'Secret!';

// Serve static files (including styles.css) from the current directory
app.use(express.static(__dirname));

// JWT MiddleWare - hashing algorithm used for JWT tokens
const jwtMW = expressJwt({
    secret: secretKey,
    algorithms: ['HS256'] 
});


// Set headers to allow cross-origin requests from http://localhost:3000. --> Essential for allowing requests from your front-end application running on localhost:3000 to access your server.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

// Parse the body of any POST requests expecting a JSON object. Middleware essential for extracting data sent from the front-end, in the login() function defined in the HTML.
app.use(bodyParser.json());

// Parse the body of any POST requests with URL-encoded data. Middleware used for parsing form data sent from the front-end.
app.use(bodyParser.urlencoded({ extended: true }));

// Array of user objects (K,V pair) - temporary Database holder
let users = [
    {
        id: 1,
        username: 'Max',
        password: '777'
    },
    {
        id: 2,
        username: 'Hello',
        password: '123'
    },
    {
        id: 3,
        username: 'World',
        password: '456'
    },
    {
        id: 4,
        username: 'Gray',
        password: '890'
    }
];

// Define a route handler for POST requests to '/api/login'. This endpoint handles user authentication.
app.post('/api/login', (req, res) => {
    // Extract 'username' and 'password' from the request body. This data is sent from the front-end login form.
    const { username, password } = req.body;    
    
    // Authentication Process
    let isAuthenticated = false;
    for (let user of users) {
        if (username == user.username && password == user.password) {
            isAuthenticated = true;
            let token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '3m' }); // Token expires in 3m
            res.json({
                success: true,
                err: null,
                token
            });
            break; // No need for break statement here
        }
    }

    if (!isAuthenticated) {
        res.status(401).json({
            success: false,
            token: null,
            err: 'Username or Password is Incorrect!',
        });
}


    // < ----- For Testing the Workings of Posting Request and Sending Response to and from the FrontEnd. ------ >
    //console.log('JSON req.body Values: ', username, password);
    // Respond to the client with a JSON object containing the received 'username' and 'password'.
    // This response is just for demonstration purposes and should be replaced with actual authentication logic.
    //res.json({'username': username, 'password': password});
});

// jwtMW is a middle ware for checking authorization - Only allow access to /api/dashboard if the user has a valid JWT.
app.use('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret Content: You Are Authenticated to View Dashboard!!'
    })
});

// jwtMW is a middle ware for checking authorization - Only allow access to /api/settings if the user has a valid JWT.
app.use('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret Content: You Are Authenticated to View Settings!!'
    })
});

// Define a route handler for GET requests to the root URL ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Define a route handler for GET requests to all routes (After successful login, if you refresh the page, it will launch index.html - If token already exist in the onLoad() function, it will direct you to Dashboard)
app.get('*', (req, res) => {
    // Serve the index.html file for all routes
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error-handling middleware function. If user doesn't have the correct jwt credentials, this code will execute
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            err
        });
    }
    else {
        next(err);
    }
});

// Start the Express server, listening on the specified port
app.listen(PORT, () => {
    console.log(`Serving on Port ${PORT}`);
});
