# User Registration Form
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
# Registering New Users

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
  * * Switch username for user_id

4. Result: Registration form to create new user & TinyApp automatically log us in as that user

  * Possible errors/bugs: 
    * * Register without email or password? 
    * * Register a user with existent email

# Registration Error

1. Handle Registration Errors per following conditions:
  * Empty email or password fields => send 400 status code
  * Email already exists => send 400 status code 

    * * emailExists helper function to keep DRY:
    ```javascript
    const emailExists = email => {
      for (let user in users) {
        if (users[user].email === email) return true;
        }
        return false;
        }
    ```
    * * If no email / password => res.status(400); res.send('Email or password left empty');
    * * else if emailExists(email) => res.status(400); res.send('Email is taken');
    * * else... const newID...