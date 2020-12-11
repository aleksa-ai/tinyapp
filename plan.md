# Project Directives

"This four-day project will have you building a web app using Node. The app will allow users to shorten long URLs much like TinyURL.com and bit.ly do.

You will build an HTTP Server that handles requests from the browser (client). Along the way you'll get introduced to some more advanced JavaScript and Node concepts, and you'll also learn more about Express, a web framework which is very popular in the Node community."

# Assignment incremetal steps

## URL Shortening (Part 1)

1. Create URL Submission Form
    * Create views/urls_new.ejs
      * Has form with action = /urls and method = POST
      * Input textbox has name = longURL
        * Attribute identifies data sent: key longURL to body of POST request
2. Routes for /urls/new
    * app.get("/urls/new")
    * app.post("urls")
      * Form has action attribute set to /urls
      * Use req.body.longURL to access longURL from /urls/new

3. Implement generateRandomString() in global scope

4. App.post("urls")
    * Save shortURL: longURL to urlDatabase
    * Redirect to /urls/:shortURL
5. Route for /u/:shortURL - method: GET
    * Redirect to actual longURL webpage

## Deleting URLs

1. In urls_index.ejs, add form button (Delete) with method = POST 
2. Route /urls/:shortURL/delete - method: POST
    * Delete key: value pair corresponding to shortURL
    * Redirect to "/urls"

## Updating URLs

1. In urls_show.ejs, add form that submits  updated long URL
    * Submit using method: POST
    * Action: /urls/:id
2. Route for /urls/:id - method: POST
    * Assign a new longURL to the existing shortURL
    * Redirect to "/urls"
3. In urls_index.ejs, add edit buttons 

## Cookies in Express

## User Registration Form
1. Dev on feature/user-registration branch

2. Create Registration page (incl. form w email & password fields)

```HTML
<body>
    <h1>Register page!</h1>
    <form action="/register" method="POST">
        <input type="email" name="email" placeholder="Enter your email">
        <input type="password" name="password" placeholder="Enter your password">
        <button type="submit">Register</button>
    </form>
```

3. Create GET /register endpoint

```javascript
app.get('/register', (req, res) => {
  res.render('register')
})
```
## Registering New Users

1. Add users object (from instructions)

  ```javascript
      const users = { 
      "userRandomID": {
        id: "userRandomID", 
        email: "user@example.com", 
        password: "purple-monkey-dinosaur"
      },
    "user2RandomID": {
        id: "user2RandomID", 
        email: "user2@example.com", 
        password: "dishwasher-funk"
      }
    }
  ``` 

2. Upon submission of data on registr. page, create registration handler (generate new user ID, insert it as property with its values into global users object)

  * Building on register routes from previous step (template)
  
  ```javascript
    app.post('/register', (req, res) => {
      const { id, email, password } = req.body
  ```
  * Generate new user ID (use generateRandomString function)

  * Insert new user ID and that user infor into users object

  ```javascript
    users[newID] = {
      id: newID, 
      email: req.body.email, 
      password: req.body.password
      };
  ```
  * Test users object being appended to

3. Passing the user Object to the _header

  * Update all views to pass user object (vs. username)

  ```javascript
  res.clearCookie('username'); //Take out
  res.clearCookie('user_id'); //Replace
  ```
  
  * Pass user object to _header to display user's email

4. Result: Registration form to create new user & TinyApp automatically log us in as that user

  * Possible errors/bugs: 
    * Register without email or password? 
    * Register a user with existent email

## Registration Error

1. Handle Registration Errors per following conditions:
  * Empty email or password fields => send 400 status code
  * Email already exists => send 400 status code 

    * emailExists helper function to keep DRY:
    ```javascript
    const emailExists = email => {
      for (let user in users) {
        if (users[user].email === email) return true;
        }
        return false;
        }
    ```
      * If no email / password => res.status(400); res.send('Email or password left empty');
      * else if emailExists(email) => res.status(400); res.send('Email is taken');
      * else... const newID...

## New Login Page

1. Create new login page & GET route
2. Remove the login form field in header & replace  with login and register page links

# Refactoring login route

1. Modify the POST /login route
    * Send corresponding user_id to cookies if login attempt successful
    * Return 403 message if email does not exist or password is incorrect
    * Redirect to /urls
2. Merge feature/user-registration git branch with master

## Basic Permission Features

1. Only Registered Users Can Shorten URLs
    * If someone not logged in when trying to access /urls/new, redirect to login page.
2. URLs Belong to Users
    * Change urlDatabase so values are objects containing the longURL and associated userID
3. Anyone Can Visit Short URLs
    * Test GET /u/:id routes to make sure they redirect for users, even if  aren't logged in

## More Permission Features

1. Users Can Only See Their Own Shortened URLs
    * /urls only displays URLs if user logged in
        * Create urlsForUser(id) function
    * /urls/:shortURL displays message?/prompt? instead of edit form if not logged in
2. Users Can Only Edit or Delete Their Own URLs
    * Update the edit and delete endpoints
    * Test: "-X POST -i localhost:8080/urls/:shortURL/delete"

## Storing Passwords Securely

1. Add bcrypt to Project
    * npm install bcrypt

2. Use bcrypt When Storing Passwords
    * Add const bcrypt = require('bcrypt');
    * Update /register with bcrypt.hashSync(password, 10);
3. Use bcrypt When Checking Passwords
    * bcrypt.compareSync(inputPassword, savedHashedPassword)
    * /login

## Switching to Encrypted Cookies

1. Install cookie-session middleware
2. const cookieSession = require('cookie-session');

```javascript
  app.use(cookieSession({
    name: 'session',
    keys: [/* keys */],
  }));
```
3. Update instances of cookies to session

## Testing Helper Functions

1. Refactor Helper Functions
    * Modify existing getUserByEmail function to take in user's email & users database as parameters

2. Create a Helper Functions Module
    * Move getUserByEmail function in helpers.js and export

3. Mocha and Chai
    * Implement framework for testing (M&C, users data in express_server with bcrypt for passwords, helpersTest file)
    * Write tests & Test