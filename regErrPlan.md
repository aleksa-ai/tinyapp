## Registration Error

1. Continue feature/user-registration git branch

2. Handle Registration Errors per following conditions:
  * Empty email or password fields  => send 400 status code
  * Email already exists            => send 400 status code 
    (incl. email lookup helper function to keep code DRY)

    A. emailExists function:
    ```javascript
    const emailExists = email => {
      for (let user in users) {
        if (users[user].email === email) return true;
        }
        return false;
        }
    ```

    B. If no email / password => 
          ****res.status(400);
          ****res.send('Email or password left empty');
        **else if emailExists(email) => 
            *****res.status(400)
            *****res.send('Email is taken');;
          ***else... const newID...