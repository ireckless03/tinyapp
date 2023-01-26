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
    password: "hmmmmmmm",
  },
  Gon: {
    id: "Gon",
    email: "Gon1@example.com",
    password: "sniffsniff",
  },
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = () => {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  let string_length = 6;
  let string = '';
  for (let i = 0; i < string_length; i++) {
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

//checks user id and pw 
// if ok then redirects to homepage
// if not error message
app.post('/login', (req, res) => {
  console.log('req body',req.body);
  for (const user of Object.keys(users)) {
    console.log('user',user);
    if (req.body.email.toLocaleLowerCase === users[user].email.toLocaleLowerCase && req.body.password === users[user].password) {
      res.cookie('user_id', user); // user shows as gon/kilua/ unique generated ID
      return res.redirect('/');
    }
    }

return res.status(400).send("Wrong username or password"); 
});



app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  return res.redirect(`/urls`);
});

// Delete a URL, redirect to main url page
app.post('/urls/:id/delete', (req, res) => {
  const shortID = req.params.id;
  delete urlDatabase[shortID];
  return res.redirect('/urls');
});

// to eddit long url, redirects to urlshort page
app.post('/urls/:id/edit', (req, res) => {
  const shortID = req.params.id;
  // urlDatabase[shortID] =
  return res.redirect(`/urls/${shortID}/`);
});

// after clicking submit to update url, redirect to main url page
app.post('/urls/:id/update', (req, res) => {
  const shortID = req.params.id;
  urlDatabase[shortID] = req.body.longURL;
  return res.redirect(`/urls`);
});

////////////////
///////////// checks for emial and pw to be valid
//  also checks for existing user
app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send("Email and password are required!");
  }
  
  for (const values of Object.values(users)) {
    if (values.email.toLocaleLowerCase() === req.body.email.toLocaleLowerCase()) {
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
console.log(users);
  
  return res.redirect(`/urls`);
  
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// postman and rested curl
// form tag or anchor to link to another page

// why is delete route a post request? - trying to change data in backend
//
// Get - request doesnt alter anything

// C
// R
// D - app.delete