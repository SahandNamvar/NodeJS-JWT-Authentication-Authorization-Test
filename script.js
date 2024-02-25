function login() {

    // Retrieve and store user/pass from input fields in data object
    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };

    console.log('Input Field Data Retrieved: ', data.username, data.password);
    
    // Make a POST request to the '/api/login' endpoint using Axios
    // Pass the data object as the payload for the request
    axios.post('/api/login', data)
        .then(res => {
            // Once the server responds to the POST request, log the response to the console
            console.log('Axios Response After POST: ', res);
            
            // Then, set the input fields to empty
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';

            // Then, if response (res) exists, and it contains an element called data, and data has attribute success,
            // then get the token that was generated in the server.js authentication process, so that the user with this token will have access to the rest of the website.
            // Note: Axios adds a new elements data which contains our response object.
            // So, the res.json created in the Authentication process will be in the form:
            // {data: { success: true, err: null, tokenValue: token }};
            if (res && res.data && res.data.success) {
                const token = res.data.token;
                localStorage.setItem('jwt', token); // Store the token on LocalStorage --> User doesn't have to sign-in again when navigating through different routes, or when come back to the website
                getDashboard();
                window.history.pushState(null, '', '/dashboard'); // Update the URL to '/dashboard'
            } else {
                window.history.pushState(null, '', '/login');
            }
        });
}

// Function to retrieve dashboard data from the server and update the dashboard view
function getDashboard() {
    const token = localStorage.getItem('jwt');

    // Make a GET request to the '/api/dashboard' endpoint using Axios
    // Include the JWT token in the request headers to authenticate the user
    axios.get('/api/dashboard', { headers: {'Authorization': `Bearer ${token}`} })
        .then(res => {
            // If the server responds with success and contains dashboard data,
            // update the dashboard view with the received content
            if (res && res.data && res.data.success) {
                document.querySelector('h2.text-center').innerHTML = 'Dashboard'; // Update dashboard title
                document.querySelector('.form-group-holder').innerHTML = res.data.myContent; // Update dashboard
                // Hide the "Forgot password?" and "Don't have an account? Sign up" links
                document.getElementById('forgotPassword').style.display = 'none';
                document.getElementById('signUp').style.display = 'none';
            }
        })
        .catch(err => {
            console.error('Error fetching dashboard data:', err);
        });
}

// Function for settings
function getSettings() {
    const token = localStorage.getItem('jwt');

    axios.get('/api/settings', { headers: {'Authorization': `Bearer ${token}`} })
        .then(res => {
            if (res && res.data && res.data.success) {
                document.querySelector('h2.text-center').innerHTML = 'Settings';
                document.querySelector('.form-group-holder').innerHTML = res.data.myContent;
                document.getElementById('forgotPassword').style.display = 'none';
                document.getElementById('signUp').style.display = 'none';
            }
        })
        .catch(err => {
            console.error('Error fetching settings data:', err);
        });
}

// If the token already exist in localStorage, load dashboard on page refresh, instead of Login page.
function onLoad() {
    const token = localStorage.getItem('jwt');
    if (token) {
        getDashboard();
        handleTokenExpiration(); // Check token expiration immediately
    }
}
onLoad();

// Function to update the page content and URL when navigating
function navigate(route) {
    if (route === 'dashboard') {
        getDashboard();
        window.history.pushState(null, '', '/dashboard'); // Update the URL to '/dashboard'
    } else if (route === 'settings') {
        getSettings();
        window.history.pushState(null, '', '/settings'); // Update the URL to '/settings'
    }
}

// Function to check if JWT token is expired
function isTokenExpired(token) {
    if (!token) return true; // Token doesn't exist
    const tokenData = JSON.parse(atob(token.split('.')[1])); // Parse token payload
    const tokenExp = tokenData.exp * 1000; // Convert expiration time to milliseconds
    const currentTime = Date.now(); // Get current time in milliseconds
    return currentTime > tokenExp; // Check if current time is after token expiration time
}

// Function to handle token expiration
function handleTokenExpiration() {
    const token = localStorage.getItem('jwt');
    if (isTokenExpired(token)) {
        localStorage.removeItem('jwt'); // Remove expired token
        console.log('handleTokenExpiration: remove jwt token & reload page to root');
        window.location.href = '/'; // Reload page to root address
        window.location.reload();
    }
}

// Call handleTokenExpiration function periodically to check for token expiration
setInterval(handleTokenExpiration, 60000); // Check every 60 seconds (1 minute)

/*
    Logic:

    TokenExpired(token):
        This function takes a JWT token as input.
        It first checks if the token exists. If it doesn't (i.e., it's null or undefined), it returns true because there's no token to validate, and technically, it's expired.
        If the token exists, it decodes the token's payload using atob() function. JWT tokens consist of three parts separated by dots: header, payload, and signature. The payload is the middle part containing information like the expiration time (exp) among other things.
        The decoded payload is then parsed from JSON format to an object.
        It extracts the expiration time (exp) from the payload and converts it to milliseconds (since exp is usually in seconds).
        It gets the current time in milliseconds.
        Finally, it compares the current time with the expiration time. If the current time is greater than the expiration time, it means the token has expired, so it returns true. Otherwise, it returns false.

    handleTokenExpiration():
        This function is responsible for handling token expiration.
        It retrieves the JWT token from the local storage.
        It checks if the token is expired by calling the isTokenExpired() function.
        If the token is expired, it removes the token from local storage to invalidate it.
        Then, it logs a message indicating that the token has been removed.
        Finally, it reloads the page to the root address ('/') using window.location.href and window.location.reload().
*/