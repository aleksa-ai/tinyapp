## Registering New Users

1. Add users object
  (Take from activity)

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

2. Upon submission of data on registr. page, create registration handler (generates new user ID insert it as property with its values into global users object)

  A. Building on register routes from previous step (template)
  
  ```javascript
    app.post('/register', (req, res) => {
      const { id, email, password } = req.body
  ```
  B. Generate new user ID?

  C. Insert new user ID and that user infor into users object

  ```javascript
    users[newID] = {
      id: newID, 
      email: req.body.email, 
      password: req.body.password
      };
  ```
  D. Test users object being appended to

3. Passing the user Object to the _header

  A. Update all views to pass user object (vs. username)

  ```javascript
  res.clearCookie('username'); //Take out
  res.clearCookie('user_id'); //Replace
```
  
  B.Pass user object to _header to display user's email

    Switch username for user_id

4. Result: Registration form to create new user & TinyApp automatically log us in as that user

  A. Possible errors/bugs: 
    1) Register without email or password? 
    2) Register a user with existent email