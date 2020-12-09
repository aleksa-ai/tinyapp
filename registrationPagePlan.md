# User Registration Form
1. Dev on feature/user-registration branch

2. Create Registration page (to include form w email & password fields)
< <body>
    <h1>Register page!</h1>
    <form action="/register" method="POST">
        <input type="email" name="email" placeholder="Enter your email">
        <input type="password" name="password" placeholder="Enter your password">
        <button type="submit">Register</button>
    </form> >

3. Create GET /register endpoint
< app.get('/register', (req, res) => {
  res.render('register')
}) >