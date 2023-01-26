const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

let cookies = require("cookie-parser");

app.use(express.urlencoded({ extended: true }));

app.use(cookies());

const users = {
  Kilua: {
    id: 'Kilua',
    email: "Kilua@example.com",
    password: "dd",
  },
  Gon: {
    id: "Gon",
    email: "Gon1@example.com",
    password: "dd",
  },
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = () => {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  let stringLength = 6;
  let string = '';
  for (let i = 0; i < stringLength; i++) {
    let number = Math.floor(Math.random() * chars.length);
    string += chars.substring(number, number + 1);
  }
  return string;
};

app.get("/", (req, res) => {
  return res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  let loggedInUser = req.cookies.user_id;
  const templateVars = {
    urls: urlDatabase,
    userID: loggedInUser,
    user: users[loggedInUser]
  };
  return res.render("urls_index", templateVars);
});

app.get("/login", (req, res) => {
  let loggedInUser = req.cookies.user_id;
  const templateVars = {
    urls: urlDatabase,
    userID: loggedInUser,
    user: users[loggedInUser]
  };
  return res.render("url_login", templateVars);
});

app.get("/register", (req, res) => {
  let loggedInUser = req.cookies.user_id;
  const templateVars = {
    urls: urlDatabase,
    userID: loggedInUser,
    user: users[loggedInUser]
  };
  return res.render("url_register", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  let loggedInUser = req.cookies.user_id;
  const templateVars = {
    urls: urlDatabase,
    userID: loggedInUser,
    user: users[loggedInUser]
  };
  return res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let loggedInUser = req.cookies.user_id;
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    userID: loggedInUser,
    user: users[loggedInUser]
    
  };
  return res.render('urls_show',templateVars);
});

// if short url entered in path, redirect to long url
app.get(`/u/:id`, (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  return res.redirect(longURL);
});

// generate short url and save short & long to database
app.post("/urls", (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  return res.redirect(`/urls/${id}`);
});

//checks for correct login credentials and redirects to homepage
app.post('/login', (req, res) => {
  let email = req.body.email.toLocaleLowerCase();
  let password = req.body.password;
  for (const user of Object.keys(users)) {
    if (email !== users[user].email.toLocaleLowerCase()) {
    } else {
      if (password !== users[user].password) {
      } else {
        res.cookie('user_id', user);
        return res.redirect('/urls');
      }
      return res.status(400).send("Wrong Password!");
    }
  }
  return res.status(400).send("User Not Found!");
});

//logs user out and clears cookies
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  return res.redirect(`/login`);
});

// Delete a URL, redirect to main url page
app.post('/urls/:id/delete', (req, res) => {
  const shortID = req.params.id;
  delete urlDatabase[shortID];
  return res.redirect('/urls');
});

// to edit long url, redirects to urlshort page
app.post('/urls/:id/edit', (req, res) => {
  const shortID = req.params.id;
  return res.redirect(`/urls/${shortID}/`);
});

// takes in submission for url change and changes urlDatabase
app.post('/urls/:id/update', (req, res) => {
  const shortID = req.params.id;
  urlDatabase[shortID] = req.body.longURL;
  return res.redirect(`/urls`);
});

// checks for existing user before allowing registration
app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send("Email and password are required!");
  }
  
  for (const user of Object.values(users)) {
    if (user.email.toLocaleLowerCase() === req.body.email.toLocaleLowerCase()) {
      return res.status(400).send("User already exists!");
    }
  }

  const newUser = {
    user_id: generateRandomString(),
    email: req.body.email,
    password: req.body.password
  };

  users[newUser.user_id] = newUser;
  res.cookie('user_id', newUser.user_id);
  return res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


