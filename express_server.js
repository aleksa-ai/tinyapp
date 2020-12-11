const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.set("view engine", "ejs");

// Generate random 6-character-long string
const generateRandomString = function() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * 6));
  }
  return result;
};

// Object to contain short URLs with corresponding long URL and user ID
const urlDatabase = {
};

// Object to contain user with their infos
const users = {
};

const { emailExists, getUserByEmail, urlsForUser, urlExists,userOwnsURL } = require('./helpers');

//Welcome page behaviour
app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// Render main page of URLs
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.session.user_id, urlDatabase),
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});

// Render page for creating a new shortURL
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: users[req.session.user_id]
    };
    res.render("urls_new", templateVars);
  }
});

// Render page for the shortURL
app.get("/urls/:shortURL", (req, res) => {
  if (!urlExists(req.params.shortURL, urlDatabase)) {
    res.status(400).send('URL does not exist');
  } else if (!req.session.user_id) {
    res.status(403).send('Access is forbidden');
  } else if (!userOwnsURL(req.session.user_id, req.params.shortURL, urlDatabase)) {
    res.status(403).send('Access is forbidden: You are not the URL owner');
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id]
    };
    res.render("urls_show", templateVars);
  }
});

// Redirect to long URL webpage upon clicking on shortURL
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    res.status(404).send('Requested URL could not be located or does not exist');
  }
});

// Create a new shortURL for a longURL
app.post("/urls", (req, res) => {
  if (!req.body.longURL) {
    res.status(400).send('Url not entered.');
  } else {
    let id = generateRandomString();
    urlDatabase[id] = {
      longURL: req.body.longURL,
      userID: req.session.user_id
    };
    res.redirect(`/urls/${id}`);
  }
});

// Edit existing shortURL
app.post("/urls/:shortURL", (req, res) => {
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    res.status(403).send('Access is forbidden');
  } else if (!urlDatabase[req.params.shortURL]) {
    res.status(403).send('URL does not exist');
  } else if (!req.body.longURL) {
    res.status(400).send('Url not entered');
  } else {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect("/urls");
  }
});

// Redirect to shortURL page upon clicking Edit button from main URLs page
app.post("/urls/:shortURL/edit", (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
});

// Delete existing shortURL: longURL
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send('Access is forbidden');
  }
});

// Render login page
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("login", templateVars);
});

//Render registration page
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render('register', templateVars);
});

// Login the user if [email & password] entered & if email exists, password matches; otherwise error 400 &403 respectively
app.post("/login", (req, res) => {
  const userID = getUserByEmail(req.body.email, users);
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Email or password left empty');
  } else if (!emailExists(req.body.email, users)) {
    res.status(403).send('Email does not exist');
  } else if (!bcrypt.compareSync(req.body.password, users[userID].password)) {
    res.status(403).send('Password does not match');
  } else {
    req.session.user_id = userID;
    res.redirect("/urls");
  }
});

// Creates new user in users object if [email & password] entered & if email not already in use; otherwise error 400
app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Email or password left empty');
  } else if (emailExists(req.body.email, users)) {
    res.status(400).send('Email is taken');
  } else {
    const newID = generateRandomString();
    users[newID] = {
      id: newID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session.user_id = newID;
    res.redirect('/urls');
  }
});

// Log out the user
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// App listen function
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});