const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

var cookies = require("cookie-parser"); 

let users = {
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const usernames = {}
const generateRandomString = () => {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 6;
  var string = '';
  for (var i = 0; i < string_length; i++) {
    var number = Math.floor(Math.random() * chars.length);
    string += chars.substring(number, number + 1);
  }
  return string;
}

app.use(express.urlencoded({ extended: true }));

app.use(cookies());

app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, userName: req.cookies.userName };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_new", templateVars)
});


app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render('urls_show',templateVars);
});

// if short url entered in path, redirect to long url
app.get(`/u/:id`, (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

// generate short url and save short & long to database
app.post("/urls", (req, res) => {
  console.log(req.body); 
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

// Delete a URL, redirect to main url page
app.post('/urls/:id/delete', (req, res) => {
  const shortID = req.params.id;
  delete urlDatabase[shortID];
  res.redirect('/urls');
})

// to eddit long url, redirects to urlshort page
app.post('/urls/:id/edit', (req, res) => {
  const shortID = req.params.id;
 // urlDatabase[shortID] = 
  res.redirect(`/urls/${shortID}/`);
})

// after clicking submit to update url, redirect to main url page
app.post('/urls/:id/update', (req, res) => {
  console.log(req.body);
  const shortID = req.params.id;
  urlDatabase[shortID] = req.body.longURL;
  res.redirect(`/urls`);
})

// gets user id and creates a cookie, redirect to main url page, need to show the cookie
app.post('/login', (req, res) => {
  res.cookie('userName', req.body.userName);
  res.redirect(`/urls`);
})

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