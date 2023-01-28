const express = require("express");
const bcrypt = require('bcryptjs');
const {generateRandomString, isUserOwner, urlsForUser} = require('./helpers');
const app = express();
const PORT = 8080;
let cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['red rabbits juggling orange juice'],
}));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


// constants for testing
const users = {
  Kilua: {
    id: 'Kilua',
    email: "Kilua@example.com",
    password: bcrypt.hashSync('dd', 10),
  },
  Gon: {
    id: "Gon",
    email: "Gon1@example.com",
    password: bcrypt.hashSync('dd', 10),
  },
};

const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "Kilua",
  },
  s4m5xK: {
    longURL: "http://www.google.com",
    userID: "Gon",
  },
};


app.get("/", (req, res) => {
  return res.redirect('/urls');
});

// only allows users to see their own urls
app.get("/urls", (req, res) => {
  let loggedInUser = req.session.user_id;
  if (!loggedInUser) {
    return res.status(403).send('Please Log in first');
  }

  const templateVars = {
    urls: urlsForUser(loggedInUser, urlDatabase),
    userID: loggedInUser,
    user: users[loggedInUser]
  };
  console.log(templateVars);
  return res.render("urls_index", templateVars);
});

app.get("/login", (req, res) => {
  let id = req.session.user_id;
  const templateVars = {
    urls: urlDatabase,
    userID: id,
    user: users[id]
  };
  return res.render("url_login", templateVars);
});

app.get("/register", (req, res) => {
  let loggedInUser = req.session.user_id;
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
  let loggedInUser = req.session.user_id;
  const templateVars = {
    urls: urlDatabase,
    userID: loggedInUser,
    user: users[loggedInUser]
  };
  return res.render("urls_new", templateVars);
});
//
app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  let loggedInUser = req.session.user_id;
  if (!urlDatabase[shortURL]) {
    return res.status(404).send('Page not found');
  }

  if (!loggedInUser) {
    return res.status(403).send('Not authorized to view, please log in');
  }

  if (urlDatabase[shortURL].userID !== loggedInUser) {
    return res.status(403).send('This is a Private Link');
  }

  const templateVars = {
    shortURL,
    longURL: urlDatabase[shortURL].longURL,
    userID: loggedInUser,
    user: users[loggedInUser]
    
  };
  return res.render('urls_show',templateVars);
});

// if short url entered in path, redirect to long url
app.get(`/u/:id`, (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  return res.redirect(longURL);
});

// generate short url and save short & long to database
app.post("/urls", (req, res) => {
  // if user true then
  
  if (req.session.user_id) {
    const id = generateRandomString();
    urlDatabase[id] = {
      longURL: req.body.longURL,
      userID: req.session.user_id,
    };
    return res.redirect(`/urls/${id}`);
  }
  return res.status(401).send('Not authorized to do this action');
});

//checks for correct login credentials and redirects to homepage
app.post('/login', (req, res) => {
  let email = req.body.email.toLocaleLowerCase();
  let password = req.body.password;
  for (const user of Object.keys(users)) {
    if (email !== users[user].email.toLocaleLowerCase()) {
      console.log('user hashedpassword',users[user].password);
      console.log('entered pw',password);
    } else {
      if (!bcrypt.compareSync(password, users[user].password)) {
      } else {
        req.session.user_id = user;
        return res.redirect('/urls');
      }
      return res.status(400).send("Wrong Password!");
    }
  }
  return res.status(400).send("User Not Found!");
});

//logs user out and clears cookies
app.post('/logout', (req, res) => {
  res.clearCookie('session');
  return res.redirect(`/login`);
});

// Delete a URL, redirect to main url page
app.post('/urls/:id/delete', (req, res) => {
  const shortURL = req.params.id;
  const loggedInUser = req.session.user_id;
  if (isUserOwner(shortURL, loggedInUser, urlDatabase)) {
    delete urlDatabase[shortURL];
    return res.redirect('/urls');
  }
  return res.status(401).send("Only owner can delete");
});

// to edit long url, redirects to urlshort page
app.post('/urls/:id/edit', (req, res) => {
  const loggedInUser = req.session.user_id;
  const shortURL = req.params.id;
  if (!isUserOwner(shortURL, loggedInUser, urlDatabase)) {
    return res.status(401).send('Only the owner can edit this URL');
  }
  return res.redirect(`/urls/${shortURL}/`);
});

// takes in submission for url change and changes urlDatabase
app.post('/urls/:id/update', (req, res) => {
  const shortURL = req.params.id;
  const loggedInUser = req.session.user_id;
  if (isUserOwner(shortURL, loggedInUser, urlDatabase)) {
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: loggedInUser};
    return res.redirect(`/urls`);
  }
  return res.status(401).send('Only the owner can update this');
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
  const userID = generateRandomString();
  const newUser = {
    user_id: userID,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  users[newUser.user_id] = newUser;
  req.session.user_id = userID;
  return res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = {urlDatabase, users};
