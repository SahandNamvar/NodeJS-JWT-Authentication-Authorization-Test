# NodeJS JSON Web Token Authentication Authorization Test

### Server Setup:

1. **Express Setup**:
   - `const express = require('express');`: Import the Express.js framework.
   - `const app = express();`: Create an instance of the Express application.

2. **Middleware Setup**:
   - `const bodyParser = require('body-parser');`: Middleware to parse request bodies.
   - `const jwt = require('jsonwebtoken');`: JSON Web Token library for creating and verifying tokens.
   - `const path = require('path');`: Module for handling file paths.
   - `const { expressjwt: expressJwt } = require('express-jwt');`: Middleware for JWT authentication.
   - Use `bodyParser.json()` and `bodyParser.urlencoded()` to parse JSON and URL-encoded request bodies, respectively.
   - Set headers to allow cross-origin requests from `http://localhost:3000`.

3. **Static File Serving**:
   - `app.use(express.static(__dirname));`: Serve static files (including `styles.css`) from the current directory.

4. **User Database**:
   - Define an array `users` containing user objects with `id`, `username`, and `password`.

5. **Authentication Route**:
   - Define a route handler for POST requests to `/api/login`.
   - Extract `username` and `password` from the request body.
   - Iterate through the `users` array to authenticate the user.
   - If authentication succeeds, sign a JWT token containing user information and send it to the client.
   - If authentication fails, send an error response.

6. **Protected Routes**:
   - Define middleware `jwtMW` to check authorization using JWT.
   - Use `jwtMW` middleware to protect routes `/api/dashboard` and `/api/settings`.
   - Respond with secret content if the user has a valid JWT, otherwise, send an unauthorized error.

7. **Routing**:
   - Define route handlers for GET requests to the root URL (`/`) and all other routes.
   - Serve the `index.html` file for all routes.

8. **Error Handling**:
   - Define an error-handling middleware function to handle unauthorized errors.
   - If the user doesn't have the correct JWT credentials, send a 401 Unauthorized response.

9. **Server Start**:
   - Start the Express server, listening on the specified port (`3000`).

This `server.js` file sets up an Express server with routes for user authentication (`/api/login`) and protected routes (`/api/dashboard` and `/api/settings`). It uses JWT for authentication and serves static files from the current directory. Additionally, it includes error handling middleware to handle unauthorized errors.

### JavaScript functions in detail:

1. **login() Function:**
   - **Purpose:** Handles the login process by sending a POST request to the server with the provided username and password.
   - **Steps:**
     - Retrieves the username and password entered by the user from the input fields.
     - Constructs a data object containing the username and password.
     - Sends a POST request to the '/api/login' endpoint using Axios, with the data object as the payload.
     - Upon receiving a response from the server:
       - Logs the response to the console for debugging purposes.
       - Clears the input fields for username and password.
       - If the response indicates a successful login (res.data.success is true):
         - Retrieves the JWT token from the response data.
         - Stores the token in the browser's local storage for future authentication.
         - Calls the getDashboard() function to load the dashboard content.
         - Updates the URL to '/dashboard' using window.history.pushState().
       - If the login fails, updates the URL to '/login'.

2. **getDashboard() Function:**
   - **Purpose:** Retrieves dashboard data from the server and updates the dashboard view accordingly.
   - **Steps:**
     - Retrieves the JWT token from the local storage.
     - Sends a GET request to the '/api/dashboard' endpoint using Axios, including the JWT token in the request headers for authentication.
     - Upon receiving a successful response from the server:
       - Updates the dashboard title and content based on the received data.
       - Hides the "Forgot password?" and "Sign up" links.
     - If an error occurs during the request, logs the error to the console.

3. **getSettings() Function:**
   - **Purpose:** Retrieves settings data from the server and updates the settings view.
   - **Steps:**
     - Retrieves the JWT token from the local storage.
     - Sends a GET request to the '/api/settings' endpoint using Axios, including the JWT token in the request headers.
     - Upon receiving a successful response from the server:
       - Updates the settings title and content based on the received data.
       - Hides the "Forgot password?" and "Sign up" links.
     - If an error occurs during the request, logs the error to the console.

4. **onLoad() Function:**
   - **Purpose:** Automatically loads the dashboard upon page refresh if a JWT token exists in the local storage.
   - **Steps:**
     - Retrieves the JWT token from the local storage.
     - If a token exists:
       - Calls the getDashboard() function to load the dashboard content.
       - Calls the handleTokenExpiration() function to immediately check for token expiration.

5. **navigate(route) Function:**
   - **Purpose:** Handles navigation between different pages (dashboard and settings).
   - **Steps:**
     - Takes a route parameter to determine the destination page.
     - If the route is 'dashboard':
       - Calls the getDashboard() function to load the dashboard content.
       - Updates the URL to '/dashboard' using window.history.pushState().
     - If the route is 'settings':
       - Calls the getSettings() function to load the settings content.
       - Updates the URL to '/settings'.

6. **isTokenExpired(token) Function:**
   - **Purpose:** Checks if a JWT token is expired.
   - **Steps:**
     - Takes a JWT token as input.
     - If the token does not exist, returns true.
     - Parses the token payload to extract the expiration time.
     - Compares the current time with the token expiration time and returns true if the token is expired, otherwise returns false.

7. **handleTokenExpiration() Function:**
   - **Purpose:** Handles token expiration by removing the token from local storage and reloading the page if expired.
   - **Steps:**
     - Retrieves the JWT token from the local storage.
     - Checks if the token is expired using the isTokenExpired() function.
     - If the token is expired:
       - Removes the token from local storage.
       - Logs a message indicating the token removal.
       - Reloads the page to the root address.

8. **setInterval(handleTokenExpiration, 60000) Function:**
   - **Purpose:** Sets up an interval to periodically check for token expiration and handle it accordingly.
   - **Steps:**
     - Calls the handleTokenExpiration() function every 60 seconds (1 minute) to check for token expiration and handle it.

